const asyncHandler = require('express-async-handler');
const Group = require('../models/Group');
const User = require('../models/User');
const { sendNotification } = require('../utils/notification'); // FCM
const sendEmail = require('../utils/email'); // Email
const expenseService = require('../services/expenseService');
const MonthlyAdjustment = require('../models/MonthlyAdjustment');

// ... (Keep createGroup, kickMember, etc. from previous response) ...

const createGroup = asyncHandler(async (req, res) => {
  const group = await Group.create({
    name: req.body.name,
    leader: req.user._id,
    members: [req.user._id]
  });
  res.status(201).json(group);
});

// @desc    Invite a member via Email and FCM
// @route   POST /api/groups/:id/invite
const inviteMember = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const group = await Group.findById(req.params.id);

  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  // Check if requester is leader
  if (group.leader.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the group leader can invite members');
  }

  const userToInvite = await User.findOne({ email });

  // 1. Prepare Invitation Link (In a real app, this would add them to a pending list or send a specific join token)
  // For simplicity, we'll send a link to the App Login page
  const inviteLink = `${process.env.FRONTEND_URL}/login`;

  const emailMessage = `
    <h1>Group Invitation</h1>
    <p>You have been invited to join the group <strong>${group.name}</strong> by ${req.user.name}.</p>
    <p>Please log in to your account to accept the invitation.</p>
    <a href="${inviteLink}">Go to App</a>
  `;

  // 2. Send Email
  try {
    await sendEmail({
      email: email,
      subject: `Invitation to join ${group.name}`,
      message: emailMessage,
    });
  } catch (error) {
    console.error('Failed to send invitation email:', error);
    // We continue execution even if email fails, to try FCM
  }

  // 3. Send FCM Notification (only if user exists in our DB)
  if (userToInvite && userToInvite.fcmToken) {
    await sendNotification(
      [userToInvite.fcmToken],
      'Group Invitation',
      `You have been invited to join ${group.name}`,
      { type: 'INVITE', groupId: group._id.toString() }
    );
    
    // Auto-add for now (or you can create an 'accept invitation' flow)
    // If you want to auto-add them upon invitation if they exist:
    if (!group.members.includes(userToInvite._id)) {
        group.members.push(userToInvite._id);
        await group.save();
    }
  }

  res.json({ message: 'Invitation processed (Email & Notification sent if applicable)' });
});

// @desc    Kick Member (Leader OR Admin)
const kickMember = asyncHandler(async (req, res) => {
  const { groupId, memberId, reason } = req.body;
  const group = await Group.findById(groupId);

  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  // CHECK: Allow if user is Leader OR Admin
  const isLeader = group.leader.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isLeader && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized: Only Leader or Admin can kick members');
  }

  // Proceed with kicking...
  group.members = group.members.filter(m => m.toString() !== memberId);
  
  group.auditLog.push({
    action: 'MEMBER_KICKED',
    performedBy: req.user._id,
    description: `Kicked by ${isAdmin ? 'Admin' : 'Leader'}. Reason: ${reason}`
  });

  await group.save();

  // Notify the user via FCM
  const userToKick = await User.findById(memberId);
  if (userToKick && userToKick.fcmToken) {
    await sendNotification(
      [userToKick.fcmToken],
      'Removed from Group',
      `You were removed from ${group.name}. Reason: ${reason}`
    );
  }

  // Notify the user via Email
  if (userToKick) {
      try {
        await sendEmail({
            email: userToKick.email,
            subject: `Removed from ${group.name}`,
            message: `<p>You have been removed from the group <strong>${group.name}</strong>.</p><p>Reason: ${reason}</p>`
        });
      } catch(e) { console.error("Email failed", e); }
  }

  res.json({ message: 'Member removed successfully' });
});

const setMemberActiveDays = asyncHandler(async (req, res) => {
  const { groupId, memberId, month, year, activeDays } = req.body;
  
  // Verify Leader
  const group = await Group.findById(groupId);
  if (group.leader.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Only leader can adjust days');
  }

  const daysInMonth = new Date(year, month, 0).getDate();

  const adjustment = await MonthlyAdjustment.findOneAndUpdate(
    { groupId, userId: memberId, month, year },
    { 
      activeDays, 
      totalDaysInMonth: daysInMonth,
      modifiedBy: req.user._id 
    },
    { upsert: true, new: true }
  );

  res.json(adjustment);
});

const notifyMonthlyExpenses = asyncHandler(async (req, res) => {
  const { groupId, month, year } = req.body;
  const summary = await expenseService.calculateMonthlyShare(groupId, month, year);

  for (const member of summary.members) {
    const msg = `Your ${month}/${year} Bill: Total $${member.totalToPay.toFixed(0)} ` +
                `(Shared: $${member.sharedCost.toFixed(0)}, Personal: $${member.personalCost.toFixed(0)}) ` +
                `Active Days: ${member.activeDays}`;
    
    // FCM
    if (member.fcmToken) {
      await sendNotification([member.fcmToken], 'Monthly Expense Report', msg);
    }

    // Email
    try {
        await sendEmail({
            email: member.email,
            subject: `Monthly Expense Report - ${month}/${year}`,
            message: `
                <h1>Monthly Report</h1>
                <p>${msg}</p>
                <ul>
                    <li>Shared Cost: $${member.sharedCost.toFixed(2)}</li>
                    <li>Personal Cost: $${member.personalCost.toFixed(2)}</li>
                    <li><strong>Total: $${member.totalToPay.toFixed(2)}</strong></li>
                </ul>
            `
        });
    } catch(e) { console.error("Email failed for report", e); }
  }

  res.json(summary);
});

const getGroupAuditLog = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id).populate('auditLog.performedBy', 'name email');
    if(!group) { res.status(404); throw new Error("Group not found"); }
    // Check if user is member
    if(!group.members.includes(req.user._id)) { res.status(403); throw new Error("Not authorized"); }
    res.json(group.auditLog);
});

// @desc    Delete Group (Leader OR Admin)
// @route   DELETE /api/groups/:id
const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  // CHECK: Allow if user is Leader OR Admin
  const isLeader = group.leader.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isLeader && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this group');
  }

  await group.remove(); // or Group.deleteOne({ _id: group._id })
  res.json({ message: 'Group deleted successfully' });
});

// @desc    Get All Groups (Admin Only)
// @route   GET /api/groups/admin/all
const getAllGroups = asyncHandler(async (req, res) => {
  // Return all groups with populated leader info
  const groups = await Group.find({}).populate('leader', 'name email');
  res.json(groups);
});

module.exports = {
  createGroup,
  inviteMember,
  kickMember,
  setMemberActiveDays,
  notifyMonthlyExpenses,
  getGroupAuditLog,
  deleteGroup, 
  getAllGroups,
};
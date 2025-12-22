const asyncHandler = require('express-async-handler');
const expenseService = require('../services/expenseService');
const { sendNotification } = require('../utils/notification');
const User = require('../models/User');
const Group = require('../models/Group');

// @desc    Get all expenses (with filtering/sorting)
// @route   GET /api/expenses
// @access  Private 
// @desc    Get expenses (Admin sees all, User sees their group's)
const getExpenses = asyncHandler(async (req, res) => {
  let query = req.query;

  // SECURITY: If NOT admin, force filter to only groups the user belongs to
  if (req.user.role !== 'admin') {
     // If a specific group is requested, check membership
     if (req.params.groupId) {
        const group = await Group.findById(req.params.groupId);
        if (!group || !group.members.includes(req.user._id)) {
            res.status(403);
            throw new Error('Not authorized to view this group');
        }
        // If authorized, letting the service handle the query is fine
        // as long as we pass the groupId filter
        query = { ...query, groupId: req.params.groupId };
     } else {
        // If just hitting /api/expenses without a group param, 
        // find ALL expenses for groups the user is in.
        // (This logic might be complex, simpler to require groupId for users)
        res.status(400);
        throw new Error('User must specify a Group ID');
     }
  } 
  // If ADMIN, they can pass any query they want (or no query to see all)

  const expenses = await expenseService.queryExpenses(query); 
  res.status(200).json(expenses);
});

// Helper to notify group
const notifyGroupUpdate = async (groupId, actorId, title, body) => {
  const group = await Group.findById(groupId);
  // Find all members EXCEPT the one who performed the action
  const recipients = await User.find({ 
    _id: { $in: group.members, $ne: actorId },
    fcmToken: { $exists: true, $ne: null }
  });
  
  const tokens = recipients.map(u => u.fcmToken);
  if (tokens.length > 0) {
    await sendNotification(tokens, title, body);
  }
};

const addExpense = asyncHandler(async (req, res) => {
  const { 
    productName, amount, tax, quantity, unit, 
    purchaseDate, purchasedBy, category, groupId 
  } = req.body;

  // Validation: Ensure user belongs to the group
  const group = await Group.findById(groupId);
  if (!group || !group.members.includes(req.user._id)) {
    res.status(403);
    throw new Error('You do not belong to this group');
  }

  const expense = await expenseService.create({
    productName,
    amount,
    tax: tax || 0,
    quantity: quantity || 1,
    unit,
    purchaseDate,
    purchasedBy: purchasedBy || req.user._id, // Default to self if not specified
    category,
    groupId,
    addedBy: req.user._id
  });

  await notifyGroupUpdate(
    req.body.groupId, 
    req.user._id, 
    'New Expense Added', 
    `${req.user.name} added ${expense.productName} ($${expense.amount})`
  );

  res.status(201).json(expense);
});

// @desc    Update an expense item (update-item)
// @route   PUT /api/expenses/:id
// @access  Private/Admin
const updateExpense = asyncHandler(async (req, res) => {
    // Pass req.user.id to the service for the 'updatedBy' field
    const updatedExpense = await expenseService.updateExpense(req.params.id, req.body, req.user._id);

    // NOTIFY GROUP
  await notifyGroupUpdate(
    updatedExpense.groupId, 
    req.user._id, 
    'Expense Updated', 
    `${req.user.name} updated ${updatedExpense.productName}`
  );

    res.status(200).json(updatedExpense);
});

// @desc    Delete an expense item (delete-item)
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
// @desc    Delete expense (Admin can delete ANY)
const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }

    // CHECK: Allow if User is 'addedBy' OR Group Leader OR Admin
    const isOwner = expense.addedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    // Check if group leader
    const group = await Group.findById(expense.groupId);
    const isLeader = group && group.leader.toString() === req.user._id.toString();

    if (!isOwner && !isLeader && !isAdmin) {
        res.status(403);
        throw new Error('Not authorized to delete this expense');
    }

    await expenseService.deleteExpense(req.params.id);
    // ... notification logic ...
    res.status(200).json({ message: 'Removed' });
});


// @desc    Calculate total summary (Monthly, Yearly, Date Range)
// @route   GET /api/expenses/summary
// @access  Private 
const getSummary = asyncHandler(async (req, res) => {
    // req.query will contain: { type: 'monthly/yearly/range', year: 'YYYY', month: 'MM', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
    const summary = await expenseService.calculateSummary(req.query);
    res.status(200).json(summary);
});


module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getSummary,
};
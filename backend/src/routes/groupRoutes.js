const express = require('express');
const router = express.Router();
const { 
  createGroup, 
  inviteMember, 
  kickMember, 
  getGroupAuditLog ,
 setMemberActiveDays,
  notifyMonthlyExpenses,
  getAllGroups, 
  deleteGroup
} = require('../controllers/groupController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createGroup);
router.post('/:id/invite', protect, inviteMember);
router.post('/:id/kick', protect, kickMember);
router.get('/:id/audit', protect, getGroupAuditLog);
router.post('/adjustment', protect, setMemberActiveDays); // Leader sets active days
router.post('/notify-monthly', protect, notifyMonthlyExpenses); // Trigger monthly calculation & notification
// Admin Routes
router.get('/admin/all', protect, admin, getAllGroups); // View all groups
router.delete('/:id', protect, deleteGroup); // Leader or Admin can delete

module.exports = router;
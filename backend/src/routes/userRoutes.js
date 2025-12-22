const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  getUsers, 
  updateUser, 
  deleteUser,
  updateFcmToken
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail); // NEW: Verification Route
router.put('/fcm', protect, updateFcmToken); // NEW: FCM Token Update

// Admin Only Routes
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
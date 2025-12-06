const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin Only Routes
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
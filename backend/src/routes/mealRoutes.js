const express = require('express');
const router = express.Router();
const { 
  updateMealRequest, 
  cancelMealRequest, 
  getGroupMeals 
} = require('../controllers/mealController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, updateMealRequest);        // Add/Modify (Self/Guest)
router.post('/cancel', protect, cancelMealRequest); // Cancel entire meal
router.get('/:groupId', protect, getGroupMeals);    // View meals for a specific date

module.exports = router;
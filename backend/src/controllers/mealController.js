const asyncHandler = require('express-async-handler');
const Meal = require('../models/Meal');
const Group = require('../models/Group');
const User = require('../models/User'); // Import User model
const { sendNotification } = require('../utils/notification');
const sendEmail = require('../utils/email');

// Configuration: Cut-off times (24h format)
const MEAL_TIMES = {
  'Breakfast': 8, // 8:00 AM
  'Lunch': 13,    // 1:00 PM
  'Dinner': 21    // 9:00 PM
};

// Helper: Check if request is 6 hours in advance
const isWithinCutoff = (mealDate, mealType) => {
  const targetTime = MEAL_TIMES[mealType];
  if (targetTime === undefined) throw new Error('Invalid Meal Type');

  // Construct the deadline: Meal Date at (MealTime - 6 hours)
  const deadline = new Date(mealDate);
  deadline.setHours(targetTime - 6, 0, 0, 0);

  const now = new Date();
  
  // Returns true if current time is BEFORE the deadline
  return now <= deadline;
};

// @desc    Request or Update a Meal (Self or Guest)
// @route   POST /api/meals
const updateMealRequest = asyncHandler(async (req, res) => {
  const { groupId, date, mealType, selfMeal, guestMeals } = req.body;
  const userId = req.user._id;

  // 1. Validate Date
  const requestedDate = new Date(date);
  
  // 2. Check 6-Hour Constraint
  if (!isWithinCutoff(requestedDate, mealType)) {
    res.status(400);
    throw new Error(`Requests for ${mealType} must be made at least 6 hours in advance.`);
  }

  // 3. Find or Create Meal Entry
  let meal = await Meal.findOne({ groupId, userId, date: requestedDate, mealType });

  if (!meal) {
    meal = new Meal({
      groupId,
      userId,
      date: requestedDate,
      mealType,
      selfMeal: selfMeal !== undefined ? selfMeal : true,
      guestMeals: guestMeals || 0
    });
  } else {
    // Update existing fields
    if (selfMeal !== undefined) meal.selfMeal = selfMeal;
    if (guestMeals !== undefined) meal.guestMeals = guestMeals;
    meal.status = 'Requested'; // Reactivate if it was cancelled
  }

  const savedMeal = await meal.save();

  // 4. Notify Group Leader
  const group = await Group.findById(groupId).populate('leader');
  if (group && group.leader) {
    const leader = group.leader;
    const message = `${req.user.name} updated ${mealType} for ${date}: Self=${meal.selfMeal}, Guests=${meal.guestMeals}`;

    // FCM to Leader
    if (leader.fcmToken) {
      await sendNotification(
        [leader.fcmToken],
        'Meal Request Update',
        message,
        { type: 'MEAL_UPDATE', mealId: savedMeal._id.toString() }
      );
    }

    // Email to Leader
    try {
      await sendEmail({
        email: leader.email,
        subject: `Meal Request: ${req.user.name} - ${mealType}`,
        message: `
          <h3>Meal Request Update</h3>
          <p><strong>Member:</strong> ${req.user.name}</p>
          <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
          <p><strong>Meal:</strong> ${mealType}</p>
          <p><strong>Status:</strong> ${meal.selfMeal ? 'Eating' : 'Not Eating'}</p>
          <p><strong>Guest Meals:</strong> ${meal.guestMeals}</p>
          <p><em>Request made at: ${new Date().toLocaleString()}</em></p>
        `
      });
    } catch (error) {
      console.error("Failed to send meal email", error);
    }
  }

  res.status(200).json(savedMeal);
});

// @desc    Cancel a Meal Completely (Shortcut)
// @route   POST /api/meals/cancel
const cancelMealRequest = asyncHandler(async (req, res) => {
  const { groupId, date, mealType } = req.body;
  
  const requestedDate = new Date(date);

  // Check 6-Hour Constraint
  if (!isWithinCutoff(requestedDate, mealType)) {
    res.status(400);
    throw new Error(`Cancellations for ${mealType} must be made at least 6 hours in advance.`);
  }

  const meal = await Meal.findOne({ groupId, userId: req.user._id, date: requestedDate, mealType });

  if (meal) {
    meal.selfMeal = false;
    meal.guestMeals = 0;
    meal.status = 'Cancelled';
    await meal.save();
    
    // Notify Leader logic (Similar to update above)
    // ...
    res.status(200).json({ message: 'Meal cancelled successfully' });
  } else {
    res.status(404);
    throw new Error('Meal record not found');
  }
});

// @desc    Get Daily Meal Sheet (For Leader/View)
// @route   GET /api/meals/:groupId
const getGroupMeals = asyncHandler(async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD
  const queryDate = new Date(date);

  const meals = await Meal.find({ 
    groupId: req.params.groupId, 
    date: queryDate 
  }).populate('userId', 'name email');

  res.json(meals);
});

module.exports = {
  updateMealRequest,
  cancelMealRequest,
  getGroupMeals
};
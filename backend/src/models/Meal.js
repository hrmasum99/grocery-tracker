const mongoose = require('mongoose');

const mealSchema = mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // The specific date of the meal
  mealType: { 
    type: String, 
    required: true, 
    enum: ['Breakfast', 'Lunch', 'Dinner'] 
  },
  selfMeal: { type: Boolean, default: true }, // 1 meal for the member themselves
  guestMeals: { type: Number, default: 0 }, // Quantity of extra/guest meals
  totalQuantity: { type: Number }, // Auto-calculated (self + guests)
  status: {
    type: String,
    enum: ['Requested', 'Cancelled'],
    default: 'Requested'
  }
}, { timestamps: true });

// Compound index to ensure one record per user per meal-type per day
mealSchema.index({ groupId: 1, userId: 1, date: 1, mealType: 1 }, { unique: true });

// Auto-calculate totalQuantity before saving
mealSchema.pre('save', function(next) {
  this.totalQuantity = (this.selfMeal ? 1 : 0) + this.guestMeals;
  next();
});

module.exports = mongoose.model('Meal', mealSchema);
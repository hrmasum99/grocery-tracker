const mongoose = require('mongoose');

const adjustmentSchema = mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  activeDays: { type: Number, required: true }, // e.g., 20 days out of 30
  totalDaysInMonth: { type: Number, required: true }, // e.g., 30 or 31
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Ensure one adjustment per user per month per group
adjustmentSchema.index({ groupId: 1, userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyAdjustment', adjustmentSchema);
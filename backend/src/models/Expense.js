const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Please add a product name'],
    },
    amount: {
      type: String,
      required: [true, 'Please add an amount'],
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Please add a purchase date'],
    },
    purchasedBy: {
      type: String,
      required: [true, 'Please add the purchaser name'],
      enum: ['Masum', 'Masud', 'Akash', 'Other'], // Customize this list
    },
  // NEW FIELD FOR TRACING
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optional, only set on updates
    },
    // The timestamps field will automatically handle createdAt and updatedAt
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
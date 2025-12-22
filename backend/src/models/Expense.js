const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
  productName: { type: String, required: true },
  amount: { type: Number, required: true }, // Net Amount
  tax: { type: Number, default: 0 }, // Optional VAT/Tax
  totalAmount: { type: Number }, // amount + tax
  quantity: { type: Number, default: 1 },
  unit: { 
    type: String, 
    enum: ['kg', 'gm', 'L', 'ml', 'pcs', 'dozen', 'box', 'none'], 
    default: 'none' 
  },
  purchaseDate: { type: Date, required: true },
  purchasedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: { 
    type: String, 
    required: true, 
    enum: ['Grocery', 'Utility', 'Rent', 'Personal', 'Other'] 
  },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Auto-calculate totalAmount before saving
expenseSchema.pre('save', function(next) {
  this.totalAmount = this.amount + this.tax;
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);
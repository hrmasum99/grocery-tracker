// backend/src/controllers/expenseController.js (Finalized)

const asyncHandler = require('express-async-handler');
const expenseService = require('../services/expenseService');

// @desc    Get all expenses (with filtering/sorting)
// @route   GET /api/expenses
// @access  Private 
const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.queryExpenses(req.query); 
  res.status(200).json(expenses);
});

// @desc    Add a new expense (add-item)
// @route   POST /api/expenses
// @access  Private 
const addExpense = asyncHandler(async (req, res) => {
  const { productName, amount, purchaseDate, purchasedBy } = req.body;

  if (!productName || !amount || !purchaseDate || !purchasedBy) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const expense = await expenseService.createExpense({
    productName,
    amount,
    purchaseDate,
    purchasedBy,
  });

  res.status(201).json(expense);
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  res.status(200).json(expense);
});

// @desc    Update an expense item (update-item)
// @route   PUT /api/expenses/:id
// @access  Private/Admin
const updateExpense = asyncHandler(async (req, res) => {
    // Pass req.user.id to the service for the 'updatedBy' field
    const updatedExpense = await expenseService.updateExpense(req.params.id, req.body, req.user._id);
    res.status(200).json(updatedExpense);
});

// @desc    Delete an expense item (delete-item)
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
const deleteExpense = asyncHandler(async (req, res) => {
    const result = await expenseService.deleteExpense(req.params.id);
    res.status(200).json(result);
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
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
  getSummary,
};
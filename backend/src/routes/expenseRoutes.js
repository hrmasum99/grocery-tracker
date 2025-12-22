const express = require('express');
const router = express.Router();
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} = require('../controllers/expenseController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import admin

// GET/POST (all items, protected for all users)
router.route('/')
  .get(protect, getExpenses) // get-list-of-expense (with filters)
  .post(protect, addExpense); // add-item

// GET Summary (all users)
router.route('/summary').get(protect, getSummary); // getSummary (with filters)

// PUT/DELETE (individual item, restricted to Admin)
router.route('/:id')
  .put(protect, admin, updateExpense) // update-item (by admin)
  .delete(protect, admin, deleteExpense); // delete-item (by admin)

  router.route('/group/:groupId')
  .get(protect, getExpenses)
  .post(protect, addExpense);

router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

module.exports = router;
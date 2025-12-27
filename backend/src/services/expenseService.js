const Expense = require('../models/Expense');

// ------------------- QUERY & SUMMARY SERVICES -------------------

// General Expense Fetching with Filtering and Sorting
const queryExpenses = async (query) => {
    const filter = {};
    const sort = {};

    // 1. Build Date Filter
    if (query.day) {
        // Filter by specific day
        const date = new Date(query.day);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        filter.purchaseDate = { $gte: startOfDay, $lte: endOfDay };
    } else if (query.startDate && query.endDate) {
        // Filter by date range
        filter.purchaseDate = {
            $gte: new Date(query.startDate),
            $lte: new Date(query.endDate)
        };
    } else if (query.month && query.year) {
        // Filter by month/year
        const year = parseInt(query.year);
        const month = parseInt(query.month) - 1; // 0-indexed month
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
        filter.purchaseDate = { $gte: startOfMonth, $lte: endOfMonth };
    }

    // 2. Build Sort Option
    const sortBy = query.sortBy || 'date'; // Default to date
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1; // Default to descending

    if (sortBy === 'date') {
        sort.purchaseDate = sortOrder;
    } else if (sortBy === 'amount') {
        sort.amount = sortOrder;
    } else {
        sort.createdAt = sortOrder;
    }

    return await Expense.find(filter)
      .sort(sort)
      .populate('updatedBy', 'name'); // Populate the user who updated it
};

// Generalized Summary Calculation (Monthly, Yearly, DateRange)
const calculateSummary = async (query) => {
    const { type, year, month, startDate, endDate } = query;
    let start, end;
    let title;

    if (type === 'monthly' && month && year) {
        const y = parseInt(year);
        const m = parseInt(month) - 1;
        start = new Date(y, m, 1);
        end = new Date(y, m + 1, 0, 23, 59, 59, 999);
        title = `Monthly Summary: ${new Date(start).toLocaleString('default', { month: 'long' })} ${y}`;
    } else if (type === 'yearly' && year) {
        const y = parseInt(year);
        start = new Date(y, 0, 1);
        end = new Date(y, 11, 31, 23, 59, 59, 999);
        title = `Yearly Summary: ${y}`;
    } else if (type === 'range' && startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
        title = `Range Summary: ${startDate} to ${endDate}`;
    } else {
        throw new Error('Invalid summary type or missing date parameters.');
    }

    const summary = await Expense.aggregate([
        {
            $match: {
                purchaseDate: { $gte: start, $lte: end },
            },
        },
        {
            $group: {
                _id: null,
                totalExpenditure: { $sum: '$amount' },
            },
        },
    ]);

    const total = summary.length > 0 ? summary[0].totalExpenditure : 0;
    return { title, totalExpenditure: total, start, end };
};


// ------------------- CRUD SERVICES -------------------

const createExpense = async (data) => {
    return await Expense.create(data);
};

const getExpenseById = async (id) => {
  return await Expense.findById(id).populate('updatedBy', 'name');
};

const updateExpense = async (id, data, userId) => {
    const expense = await Expense.findById(id);

    if (!expense) {
        throw new Error('Expense not found');
    }

    expense.productName = data.productName || expense.productName;
    expense.amount = data.amount || expense.amount;
    expense.purchaseDate = data.purchaseDate || expense.purchaseDate;
    expense.purchasedBy = data.purchasedBy || expense.purchasedBy;
    expense.updatedBy = userId; // Set the user who performed the update

    return await expense.save();
};

const deleteExpense = async (id) => {
    const expense = await Expense.findById(id);

    if (!expense) {
        throw new Error('Expense not found');
    }

    await Expense.deleteOne({ _id: expense._id });
    return { message: 'Expense item removed successfully' };
};


module.exports = {
    queryExpenses,
  calculateSummary,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
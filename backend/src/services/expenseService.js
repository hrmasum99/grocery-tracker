const Expense = require('../models/Expense');
const MonthlyAdjustment = require('../models/MonthlyAdjustment');
const User = require('../models/User');

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

const getUserTotalExpenditure = async (userId, timeframe) => {
  // Finds all expenses where the user is the 'addedBy' OR part of the group
  return await Expense.aggregate([
    { $match: { 
        addedBy: mongoose.Types.ObjectId(userId),
        purchaseDate: { $gte: timeframe.start, $lte: timeframe.end }
    }},
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);
};

const calculateMonthlyShare = async (groupId, month, year) => {
  const Group = require('../models/Group'); // Lazy load to avoid circular dependency
  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  // 1. Get Group & Members
  const group = await Group.findById(groupId).populate('members');
  if (!group) throw new Error('Group not found');

  // 2. Get Total Shared Expenses (Grocery/Utility/Rent)
  const sharedExpenses = await Expense.aggregate([
    { $match: { 
        groupId: mongoose.Types.ObjectId(groupId),
        category: { $in: ['Grocery', 'Utility', 'Rent', 'Other'] }, // Exclude 'Personal'
        purchaseDate: { $gte: startDate, $lte: endDate }
    }},
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const totalSharedAmount = sharedExpenses.length > 0 ? sharedExpenses[0].total : 0;

  // 3. Get Adjustments (Active Days)
  const adjustments = await MonthlyAdjustment.find({
    groupId, month, year
  });

  // 4. Calculate Total Active Days of ALL members
  let totalGroupActiveDays = 0;
  const memberData = group.members.map(member => {
    const adj = adjustments.find(a => a.userId.toString() === member._id.toString());
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Default to full month if no adjustment set by leader
    const activeDays = adj ? adj.activeDays : daysInMonth;
    
    totalGroupActiveDays += activeDays;
    
    return {
      userId: member._id,
      name: member.name,
      email: member.email,
      fcmToken: member.fcmToken,
      activeDays,
      daysInMonth
    };
  });

  // 5. Calculate Cost Per Day
  // If totalActiveDays is 0 (unlikely), avoid NaN
  const costPerDay = totalGroupActiveDays > 0 ? (totalSharedAmount / totalGroupActiveDays) : 0;

  // 6. Final Calculation per Member
  const finalShares = await Promise.all(memberData.map(async (m) => {
    // Shared Cost
    const sharedCost = m.activeDays * costPerDay;

    // Add Personal Expenses (Not shared)
    const personalExpenses = await Expense.aggregate([
      { $match: { 
          groupId: mongoose.Types.ObjectId(groupId),
          addedBy: m.userId,
          category: 'Personal',
          purchaseDate: { $gte: startDate, $lte: endDate }
      }},
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const personalCost = personalExpenses.length > 0 ? personalExpenses[0].total : 0;

    return {
      ...m,
      sharedCost,
      personalCost,
      totalToPay: sharedCost + personalCost
    };
  }));

  return {
    month,
    year,
    totalSharedAmount,
    costPerDay,
    members: finalShares
  };
};

module.exports = {
    queryExpenses,
    calculateSummary,
    createExpense,
    updateExpense,
    deleteExpense,
    getUserTotalExpenditure,
    calculateMonthlyShare,
};
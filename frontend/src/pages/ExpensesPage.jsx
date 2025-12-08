import React, { useState, useEffect } from 'react';
import { Filter, Plus, Edit2, Trash2, Search, Calendar, DollarSign, User, Package, Loader2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import ExpenseModal from '../components/expense/ExpenseModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ExpensesPage = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'date',
    sortOrder: 'desc',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await api.expenses.getAll(filters);
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.expenses.delete(id);
      fetchExpenses();
    } catch (err) {
      alert(err.message);
    }
  };

  // Calculate total
  const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  const columns = [
    {
      key: 'productName',
      label: 'Product',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-2 rounded-lg">
            <Package className="text-green-600" size={20} />
          </div>
          <span className="font-semibold text-gray-900">{row.productName}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="text-green-600" size={16} />
          <span className="text-lg font-bold text-gray-900">${row.amount}</span>
        </div>
      ),
    },
    {
      key: 'purchaseDate',
      label: 'Date',
      render: (row) => (
        <div className="flex items-center space-x-2 text-gray-700">
          <Calendar className="text-blue-600" size={16} />
          <span>{new Date(row.purchaseDate).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: 'purchasedBy',
      label: 'Purchased By',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <User className="text-purple-600" size={16} />
          <span className="text-gray-700">{row.purchasedBy}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInLeft">
        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Expenses</p>
              <p className="text-3xl font-bold">{expenses.length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Package size={32} />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Amount</p>
              <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <DollarSign size={32} />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">This Month</p>
              <p className="text-3xl font-bold">
                {expenses.filter(e => {
                  const expenseDate = new Date(e.purchaseDate);
                  const now = new Date();
                  return expenseDate.getMonth() === now.getMonth() && 
                         expenseDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Calendar size={32} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="p-6 animate-slideInRight">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 rounded-lg">
              <Filter className="text-green-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Filters & Search</h2>
          </div>
          <Button
            icon={Plus}
            onClick={() => {
              setSelectedExpense(null);
              setShowModal(true);
            }}
          >
            Add New Expense
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Sort By"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            options={[
              { value: 'date', label: 'Date' },
              { value: 'amount', label: 'Amount' },
            ]}
          />
          <Select
            label="Order"
            value={filters.sortOrder}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
            options={[
              { value: 'desc', label: 'Newest First' },
              { value: 'asc', label: 'Oldest First' },
            ]}
          />
          <Input
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </Card>

      {/* Expenses Table */}
      <Card className="overflow-hidden animate-fadeIn">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-green-600" size={48} />
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first expense</p>
            <Button
              icon={Plus}
              onClick={() => {
                setSelectedExpense(null);
                setShowModal(true);
              }}
            >
              Add Expense
            </Button>
          </div>
        ) : (
          <Table
            columns={columns}
            data={expenses}
            actions={
              user?.role === 'admin'
                ? (row) => (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedExpense(row);
                          setShowModal(true);
                        }}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition transform hover:scale-110"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row._id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition transform hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                : null
            }
          />
        )}
      </Card>

      <ExpenseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        expense={selectedExpense}
        onSuccess={fetchExpenses}
      />
    </div>
  );
};

export default ExpensesPage;
import React, { useState, useEffect } from 'react';
import { Filter, Plus, Edit2, Trash2 } from 'lucide-react';
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
    try {
      const data = await api.expenses.getAll(filters);
      setExpenses(data);
    } catch (err) {
      console.error(err);
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

  const columns = [
    { key: 'productName', label: 'Product', render: (row) => <span className="font-medium text-gray-900">{row.productName}</span> },
    { key: 'amount', label: 'Amount', render: (row) => <span className="text-gray-700">${row.amount}</span> },
    { key: 'purchaseDate', label: 'Date', render: (row) => <span className="text-gray-700">{new Date(row.purchaseDate).toLocaleDateString()}</span> },
    { key: 'purchasedBy', label: 'Purchased By', render: (row) => <span className="text-gray-700">{row.purchasedBy}</span> },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Filter size={20} className="mr-2" />
            Filters
          </h2>
          <Button icon={Plus} onClick={() => { setSelectedExpense(null); setShowModal(true); }}>
            Add Expense
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

      <Card>
        <Table
          columns={columns}
          data={expenses}
          actions={user?.role === 'admin' ? (row) => (
            <div className="flex justify-end space-x-3">
              <button onClick={() => { setSelectedExpense(row); setShowModal(true); }} className="text-indigo-600 hover:text-indigo-800">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:text-red-800">
                <Trash2 size={16} />
              </button>
            </div>
          ) : null}
        />
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
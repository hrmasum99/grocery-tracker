import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import api from '../../services/api';

const ExpenseModal = ({ isOpen, onClose, expense, onSuccess }) => {
  const [formData, setFormData] = useState({
    productName: '',
    amount: '',
    purchaseDate: '',
    purchasedBy: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        productName: expense.productName,
        amount: expense.amount,
        purchaseDate: new Date(expense.purchaseDate).toISOString().split('T')[0],
        purchasedBy: expense.purchasedBy,
      });
    } else {
      setFormData({
        productName: '',
        amount: '',
        purchaseDate: '',
        purchasedBy: '',
      });
    }
  }, [expense, isOpen]);

  const handleSubmit = async () => {
    try {
      if (expense) {
        await api.expenses.update(expense._id, formData);
      } else {
        await api.expenses.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expense ? 'Edit Expense' : 'Add Expense'}>
      <div className="space-y-4">
        <Input
          label="Product Name"
          value={formData.productName}
          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
          required
        />
        <Input
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
        <Input
          label="Purchase Date"
          type="date"
          value={formData.purchaseDate}
          onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          required
        />
        <Select
          label="Purchased By"
          value={formData.purchasedBy}
          onChange={(e) => setFormData({ ...formData, purchasedBy: e.target.value })}
          placeholder="Select..."
          options={[
            { value: 'Masum', label: 'Masum' },
            { value: 'Masud', label: 'Masud' },
            { value: 'Akash', label: 'Akash' },
            { value: 'Other', label: 'Other' },
          ]}
        />
        <div className="flex space-x-3 pt-4">
          <Button onClick={handleSubmit} className="flex-1">
            {expense ? 'Update' : 'Add'}
          </Button>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExpenseModal;
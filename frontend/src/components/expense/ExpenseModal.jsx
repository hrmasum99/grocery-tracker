import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Calendar, User, Save, Loader2, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const ExpenseModal = ({ isOpen, onClose, expense, onSuccess }) => {
  const [formData, setFormData] = useState({
    productName: '',
    amount: '',
    purchaseDate: '',
    purchasedBy: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

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
    setErrors({});
    setSuccess(false);
  }, [expense, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (!formData.purchasedBy) newErrors.purchasedBy = 'Please select who purchased';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (expense) {
        await api.expenses.update(expense._id, formData);
      } else {
        await api.expenses.create(formData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideInRight max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          
          <div className="relative flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {expense ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <p className="text-green-100 text-sm">
                  {expense ? 'Update expense details' : 'Track your grocery spending'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition backdrop-blur-sm"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Product Name */}
          <div className="animate-slideInLeft">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Package className="text-green-600" size={18} />
                <span>Product Name</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="e.g., Organic Apples, Milk, Bread..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                errors.productName ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.productName}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="text-blue-600" size={18} />
                <span>Amount</span>
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-semibold">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.amount ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.amount}
              </p>
            )}
          </div>

          {/* Purchase Date */}
          <div className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="text-purple-600" size={18} />
                <span>Purchase Date</span>
              </div>
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                errors.purchaseDate ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.purchaseDate && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.purchaseDate}
              </p>
            )}
          </div>

          {/* Purchased By */}
          <div className="animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <User className="text-indigo-600" size={18} />
                <span>Purchased By</span>
              </div>
            </label>
            <select
              value={formData.purchasedBy}
              onChange={(e) => setFormData({ ...formData, purchasedBy: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                errors.purchasedBy ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            >
              <option value="">Select who purchased...</option>
              <option value="Masum">🙋‍♂️ Masum</option>
              <option value="Masud">👨 Masud</option>
              <option value="Akash">🧑 Akash</option>
              <option value="Other">👤 Other</option>
            </select>
            {errors.purchasedBy && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.purchasedBy}
              </p>
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="bg-gray-50 px-6 py-4 flex space-x-3 flex-shrink-0 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition transform ${
              success
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white hover:scale-105'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{expense ? 'Updating...' : 'Adding...'}</span>
              </>
            ) : success ? (
              <>
                <CheckCircle size={20} />
                <span>Success!</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>{expense ? 'Update Expense' : 'Add Expense'}</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-white border-2 border-gray-200 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold transition transform hover:scale-105 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
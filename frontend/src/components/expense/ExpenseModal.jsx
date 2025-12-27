'use client';

import { useState, useEffect } from 'react';
import { X, Package, DollarSign, Calendar, User, Save, Loader2, CheckCircle } from 'lucide-react';
import api from '@/services/api';

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

  // Reset form data when modal opens or expense changes
  useEffect(() => {
    if (isOpen) {
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

      // Hide navbar and buttons when modal opens
      document.body.style.overflow = 'hidden';
      const navbar = document.getElementById('main-navbar');
      const navButtons = document.getElementById('nav-buttons');
      if (navbar) navbar.style.display = 'none';
      if (navButtons) navButtons.style.display = 'none';
    } else {
      // Show navbar and buttons when modal closes
      document.body.style.overflow = 'unset';
      const navbar = document.getElementById('main-navbar');
      const navButtons = document.getElementById('nav-buttons');
      if (navbar) navbar.style.display = 'block';
      if (navButtons) navButtons.style.display = 'flex';
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = 'unset';
      const navbar = document.getElementById('main-navbar');
      const navButtons = document.getElementById('nav-buttons');
      if (navbar) navbar.style.display = 'block';
      if (navButtons) navButtons.style.display = 'flex';
    };
  }, [isOpen, expense]);

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
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideInRight max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 sm:p-6 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20"></div>
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16"></div>
          
          <div className="relative flex justify-between items-start sm:items-center">
            <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg backdrop-blur-sm">
                <Package className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl font-bold">
                  {expense ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <p className="text-green-100 text-xs sm:text-sm mt-0.5">
                  {expense ? 'Update expense details' : 'Track your grocery spending'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-1.5 sm:p-2 rounded-lg transition backdrop-blur-sm ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Product Name */}
          <div className="animate-slideInLeft">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Package className="text-green-600" size={16} />
                <span>Product Name</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="e.g., Organic Apples, Milk, Bread..."
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                errors.productName ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.productName && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.productName}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-blue-600 text-lg font-bold">৳</span>
                <span>Amount (BDT)</span>
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base sm:text-lg font-semibold">
                ৳
              </span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.amount ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.amount}
              </p>
            )}
          </div>
          {/* Purchase Date */}
          <div className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Calendar className="text-purple-600" size={16} />
                <span>Purchase Date</span>
              </div>
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                errors.purchaseDate ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.purchaseDate && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.purchaseDate}
              </p>
            )}
          </div>

          {/* Purchased By */}
          <div className="animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <User className="text-indigo-600" size={16} />
                <span>Purchased By</span>
              </div>
            </label>
            <select
              value={formData.purchasedBy}
              onChange={(e) => setFormData({ ...formData, purchasedBy: e.target.value })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
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
              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.purchasedBy}
              </p>
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex space-x-2 sm:space-x-3 shrink-0 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className={`flex-1 flex items-center justify-center space-x-1.5 sm:space-x-2 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition transform ${
              success
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white hover:scale-105'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>{expense ? 'Updating...' : 'Adding...'}</span>
              </>
            ) : success ? (
              <>
                <CheckCircle size={18} />
                <span>Success!</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{expense ? 'Update' : 'Add'}</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-white border-2 border-gray-200 hover:bg-gray-100 text-gray-700 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition transform hover:scale-105 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
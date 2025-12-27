'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Save, Loader2, CheckCircle } from 'lucide-react';
import api from '@/services/api';

export default function UserModal({ isOpen, onClose, user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Reset form data when modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } else {
        setFormData({
          name: '',
          email: '',
          role: 'user',
        });
      }
      setErrors({});
      setSuccess(false);

      document.body.style.overflow = 'hidden';
      const navbar = document.getElementById('main-navbar');
      const navButtons = document.getElementById('nav-buttons');
      if (navbar) navbar.style.display = 'none';
      if (navButtons) navButtons.style.display = 'none';
    } else {
      document.body.style.overflow = 'unset';
      const navbar = document.getElementById('main-navbar');
      const navButtons = document.getElementById('nav-buttons');
      if (navbar) navbar.style.display = 'block';
      if (navButtons) navButtons.style.display = 'flex';
    }

    return () => {
      document.body.style.overflow = 'unset';
      const navbar = document.getElementById('main-navbar');
      const navButtons = document.getElementById('nav-buttons');
      if (navbar) navbar.style.display = 'block';
      if (navButtons) navButtons.style.display = 'flex';
    };
  }, [isOpen, user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await api.users.update(user._id, formData);
      
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
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" 
        onClick={onClose}
      ></div>
      
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideInRight max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 sm:p-6 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20"></div>
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16"></div>
          
          <div className="relative flex justify-between items-start sm:items-center">
            <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg backdrop-blur-sm">
                <User className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl font-bold">Edit User</h3>
                <p className="text-purple-100 text-xs sm:text-sm mt-0.5">Update user information</p>
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

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              <div className="flex items-center space-x-1.5">
                <User className="text-purple-600" size={16} />
                <span>Name</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">⚠️ {errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              <div className="flex items-center space-x-1.5">
                <Mail className="text-indigo-600" size={16} />
                <span>Email</span>
              </div>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">⚠️ {errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              <div className="flex items-center space-x-1.5">
                <Shield className="text-blue-600" size={16} />
                <span>Role</span>
              </div>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition border-gray-200"
            >
              <option value="user">👤 User</option>
              <option value="admin">👑 Admin</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex space-x-2 sm:space-x-3 shrink-0 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition transform ${
              success
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white hover:scale-105'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Updating...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle size={18} />
                <span>Success!</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Update User</span>
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
}
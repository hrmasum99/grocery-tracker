import React from 'react';
import { DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-indigo-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">ExpenseTracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name}{' '}
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                {user?.role}
              </span>
            </span>
            <button onClick={logout} className="text-gray-600 hover:text-red-600 transition">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
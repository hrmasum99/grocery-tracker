import React, { useState } from 'react';
import { ShoppingCart, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg fixed w-full z-[100] animate-slideInLeft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Grocery Tracker
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* User Info */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-full">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-full">
                <User className="text-white" size={16} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <span className="text-xs bg-gradient-to-r from-green-600 to-blue-600 text-white px-2 py-0.5 rounded-full">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-3 rounded-lg">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-full">
                  <User className="text-white" size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <span className="text-xs bg-gradient-to-r from-green-600 to-blue-600 text-white px-2 py-0.5 rounded-full">
                    {user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
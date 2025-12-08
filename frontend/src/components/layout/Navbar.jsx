import React, { useState } from 'react';
import { ShoppingCart, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav id="main-navbar" className="bg-white/80 backdrop-blur-md shadow-lg fixed w-full top-0 left-0 right-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Responsive sizing */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 group cursor-pointer">
            <ShoppingCart className="text-green-600" size={32} />
            <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Grocery Tracker
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* User Info */}
            <div className="flex items-center space-x-2 lg:space-x-3 bg-gradient-to-r from-green-100 to-blue-100 px-3 lg:px-4 py-2 rounded-full">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1.5 lg:p-2 rounded-full">
                <User className="text-white" size={14} />
              </div>
              <div className="text-left">
                <p className="text-xs lg:text-sm font-semibold text-gray-800">{user?.name}</p>
                {/* <span className="text-[10px] lg:text-xs bg-gradient-to-r from-green-600 to-blue-600 text-white px-1.5 lg:px-2 py-0.5 rounded-full">
                  {user?.role}
                </span> */}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 lg:space-x-2 px-3 lg:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-300 transform hover:scale-105 group text-sm lg:text-base"
            >
              <LogOut size={16} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 sm:py-4 animate-fadeIn border-t border-gray-200">
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-green-50 to-blue-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1.5 sm:p-2 rounded-full">
                  <User className="text-white" size={14} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">{user?.name}</p>
                  <span className="text-[10px] sm:text-xs bg-gradient-to-r from-green-600 to-blue-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full">
                    {user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition text-sm sm:text-base"
              >
                <LogOut size={16} />
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
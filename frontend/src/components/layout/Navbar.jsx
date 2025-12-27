'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, LogOut, Menu, X, User, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isOnDashboard = pathname === '/dashboard';

  const handleToggle = () => {
    if (isOnDashboard) {
      router.push('/');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <nav id="main-navbar" className="bg-white/80 backdrop-blur-md shadow-lg fixed w-full top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Responsive sizing */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1.5 sm:p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Grocery Tracker
            </h1>
          </div>

          {/* Desktop Menu */}
          {user && (
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {/* Home/Dashboard Toggle Button */}
              <Button
                variant="ghost"
                onClick={handleToggle}
                className="flex items-center space-x-2"
              >
                {isOnDashboard ? (
                  <>
                    <Home size={18} />
                    <span>Home</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </>
                )}
              </Button>

              {/* User Info */}
              <div className="flex items-center space-x-2 lg:space-x-3 bg-gradient-to-r from-green-50 to-blue-50 px-3 lg:px-4 py-2 rounded-full">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1.5 lg:p-2 rounded-full">
                  <User className="text-white" size={14} />
                </div>
                <div className="text-left">
                  <p className="text-xs lg:text-sm font-semibold text-gray-800">{user?.name}</p>
                  <span className="text-[10px] lg:text-xs bg-gradient-to-r from-green-600 to-blue-600 text-white px-1.5 lg:px-2 py-0.5 rounded-full">
                    {user?.role}
                  </span>
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
          )}

          {/* Mobile Menu Button */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-3 sm:py-4 animate-fadeIn border-t border-gray-200">
            <div className="flex flex-col space-y-2 sm:space-y-3">
              {/* Home/Dashboard Toggle */}
              <button
                onClick={() => {
                  handleToggle();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 rounded-lg transition text-sm sm:text-base"
              >
                {isOnDashboard ? (
                  <>
                    <Home size={18} />
                    <span className="font-medium">Go to Home</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard size={18} />
                    <span className="font-medium">Go to Dashboard</span>
                  </>
                )}
              </button>

              {/* User Info */}
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

              {/* Logout */}
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
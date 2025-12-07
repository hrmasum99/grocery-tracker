import React, { useState } from 'react';
import Navbar from './Navbar';
import Button from '../common/Button';
import ExpensesPage from '../../pages/ExpensesPage';
import SummaryPage from '../../pages/SummaryPage';
import UsersPage from '../../pages/UsersPage';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('expenses');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate-fadeIn">
      <Navbar />

      {/* Main content with proper padding for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Navigation buttons with fixed z-index */}
        <div className="flex space-x-2 mb-6 animate-slideInLeft relative z-[10]">
          <Button
            variant={currentView === 'expenses' ? 'primary' : 'ghost'}
            onClick={() => setCurrentView('expenses')}
          >
            Expenses
          </Button>
          <Button
            variant={currentView === 'summary' ? 'primary' : 'ghost'}
            onClick={() => setCurrentView('summary')}
          >
            Summary
          </Button>
          {user?.role === 'admin' && (
            <Button
              variant={currentView === 'users' ? 'primary' : 'ghost'}
              onClick={() => setCurrentView('users')}
            >
              Users
            </Button>
          )}
        </div>

        {/* Page content */}
        <div className="animate-fadeIn relative z-[1]">
          {currentView === 'expenses' && <ExpensesPage />}
          {currentView === 'summary' && <SummaryPage />}
          {currentView === 'users' && user?.role === 'admin' && <UsersPage />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
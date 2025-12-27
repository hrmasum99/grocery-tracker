'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/common/Button';
import ExpensesPage from '@/components/layout/ExpensesPage';
import SummaryPage from '@/components/layout/SummaryPage';
import UsersPage from '@/components/layout/UsersPage';
import { useAuth } from '@/context/AuthContext';

export default function DashboardContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('expenses');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate-fadeIn">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-24">
        <div id="nav-buttons" className="flex flex-wrap gap-2 mb-6 animate-slideInLeft">
          <Button
            variant={currentView === 'expenses' ? 'primary' : 'ghost'}
            onClick={() => setCurrentView('expenses')}
            className="text-sm md:text-base"
          >
            Expenses
          </Button>
          <Button
            variant={currentView === 'summary' ? 'primary' : 'ghost'}
            onClick={() => setCurrentView('summary')}
            className="text-sm md:text-base"
          >
            Summary
          </Button>
          {user?.role === 'admin' && (
            <Button
              variant={currentView === 'users' ? 'primary' : 'ghost'}
              onClick={() => setCurrentView('users')}
              className="text-sm md:text-base"
            >
              Users
            </Button>
          )}
        </div>

        <div className="animate-fadeIn">
          {currentView === 'expenses' && <ExpensesPage />}
          {currentView === 'summary' && <SummaryPage />}
          {currentView === 'users' && user?.role === 'admin' && <UsersPage />}
        </div>
      </div>
    </div>
  );
}
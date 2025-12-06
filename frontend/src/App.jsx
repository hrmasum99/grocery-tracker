import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Button from './components/common/Button';
import LoginPage from './pages/LoginPage';
import ExpensesPage from './pages/ExpensesPage';
import SummaryPage from './pages/SummaryPage';
import UsersPage from './pages/UsersPage';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('expenses');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-2 mb-6">
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

        {currentView === 'expenses' && <ExpensesPage />}
        {currentView === 'summary' && <SummaryPage />}
        {currentView === 'users' && user?.role === 'admin' && <UsersPage />}
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  return user ? <DashboardLayout /> : <LoginPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
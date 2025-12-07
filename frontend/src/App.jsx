import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import DashboardLayout from './components/layout/DashboardLayout';

const AppContent = () => {
  const { user } = useAuth();
  return user ? <DashboardLayout /> : <HomePage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
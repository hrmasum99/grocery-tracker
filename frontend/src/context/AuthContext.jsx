import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userRes = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userRes.ok) {
          const allUsers = await userRes.json();
          const currentUser = allUsers.find(u => u._id === decoded.id);
          setUser(currentUser);
        }
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
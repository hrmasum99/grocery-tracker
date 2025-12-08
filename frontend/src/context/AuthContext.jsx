import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token is valid by making a test request
          const res = await fetch('http://localhost:5000/api/expenses', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          if (res.ok) {
            // Token is valid, fetch user profile
            const decoded = JSON.parse(atob(storedToken.split('.')[1]));
            const userRes = await fetch('http://localhost:5000/api/users', {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
            
            if (userRes.ok) {
              const allUsers = await userRes.json();
              const currentUser = allUsers.find(u => u._id === decoded.id);
              if (currentUser) {
                setUser(currentUser);
                setToken(storedToken);
              } else {
                // User not found, clear token
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
              }
            } else {
              // Failed to fetch users, clear token
              localStorage.removeItem('token');
              setToken(null);
              setUser(null);
            }
          } else {
            // Token invalid, clear it
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.error('Auth error:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
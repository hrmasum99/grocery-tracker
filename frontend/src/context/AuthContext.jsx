'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          setToken(storedToken);
          
          // Decode JWT to get user info
          const decoded = JSON.parse(atob(storedToken.split('.')[1]));
          
          // Verify token is still valid by making a simple API call
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          if (res.ok) {
            // Token is valid, set user from decoded token
            const userData = {
              _id: decoded.id,
              name: decoded.name || 'User',
              email: decoded.email || '',
              role: decoded.role || 'user'
            };
            
            setUser(userData);
            console.log('✅ User authenticated:', userData.name, '- Role:', userData.role);
          } else {
            console.error('❌ Token invalid, status:', res.status);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.error('❌ Auth error:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Separate effect for redirects
  useEffect(() => {
    if (!loading) {
      if (user && pathname === '/') {
        console.log('✅ User logged in, redirecting to dashboard');
        router.push('/dashboard');
      } else if (!user && pathname === '/dashboard') {
        console.log('❌ No user, redirecting to home');
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (newToken, userData) => {
    console.log('🔐 Login called with:', userData.name);
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    
    // Small delay to ensure state is set
    setTimeout(() => {
      router.push('/dashboard');
    }, 100);
  };

  const logout = () => {
    console.log('🚪 Logout called');
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    router.push('/');
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
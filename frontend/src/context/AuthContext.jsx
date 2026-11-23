import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cc_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cc_token');
      if (storedToken) {
        try {
          const res = await api.auth.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('cc_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification notice:', err.message);
          // Keep cached user if valid
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password, requestedRole = null) => {
    try {
      const res = await api.auth.login({ email, password, requestedRole });
      if (res.success) {
        localStorage.setItem('cc_token', res.token);
        localStorage.setItem('cc_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const demoLogin = async (role = 'student') => {
    const email = role === 'admin' ? 'admin@campusconnect.edu' : 'aarav.patel@campusconnect.edu';
    return await login(email, 'demoPassword123', role);
  };

  const register = async (userData) => {
    try {
      const res = await api.auth.register(userData);
      if (res.success) {
        localStorage.setItem('cc_token', res.token);
        localStorage.setItem('cc_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updatedFields };
      localStorage.setItem('cc_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      role: user?.role || null,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isStudent: user?.role === 'student',
      login,
      demoLogin,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};


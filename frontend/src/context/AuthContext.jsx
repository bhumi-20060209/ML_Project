import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cardio_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 1,
      name: "Dr. Sarah Jenkins",
      email: "sarah.jenkins@cardio.ai"
    };
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('cardio_token') || 'demo_token_123');

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('cardio_user', JSON.stringify(userData));
      localStorage.setItem('cardio_token', userToken);
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authApi.register({ name, email, password });
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('cardio_user', JSON.stringify(userData));
      localStorage.setItem('cardio_token', userToken);
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cardio_user');
    localStorage.removeItem('cardio_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

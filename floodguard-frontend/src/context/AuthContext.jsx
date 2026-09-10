import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/floodApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('floodguard_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('floodguard_token') || null;
  });

  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      const data = res.data || res;
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('floodguard_token', data.access_token);
      localStorage.setItem('floodguard_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: err.response?.data?.detail || "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('floodguard_token');
    localStorage.removeItem('floodguard_user');
  };

  const isOfficer = user?.role === 'officer';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isOfficer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

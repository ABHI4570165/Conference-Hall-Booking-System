// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getUsers, saveUsers, getCurrentUser, saveCurrentUser, clearCurrentUser
} from '../utils/localStorage';
import { generateId } from '../utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user on mount
  useEffect(() => {
    const saved = getCurrentUser();
    if (saved) setCurrentUser(saved);
    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { success: false, message: 'Invalid email or password.' };
    const { password: _, ...safeUser } = user;
    setCurrentUser(safeUser);
    saveCurrentUser(safeUser);
    return { success: true, user: safeUser };
  }, []);

  const register = useCallback((data) => {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'Email already registered.' };
    }
    const newUser = {
      id: generateId('user'),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
      phone: data.phone || '',
      department: data.department || '',
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    saveCurrentUser(safeUser);
    return { success: true, user: safeUser };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    clearCurrentUser();
  }, []);

  const updateProfile = useCallback((updates) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx === -1) return { success: false, message: 'User not found.' };
    const updated = { ...users[idx], ...updates };
    users[idx] = updated;
    saveUsers(users);
    const { password: _, ...safeUser } = updated;
    setCurrentUser(safeUser);
    saveCurrentUser(safeUser);
    return { success: true };
  }, [currentUser]);

  const isAdmin = currentUser?.role === 'admin';
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{
      currentUser, loading, isAdmin, isAuthenticated,
      login, register, logout, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

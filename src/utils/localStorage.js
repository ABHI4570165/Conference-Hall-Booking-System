// src/utils/localStorage.js
// Helper functions for LocalStorage operations

import { SAMPLE_HALLS, SAMPLE_USERS, SAMPLE_BOOKINGS } from '../data/sampleData';

const KEYS = {
  USERS: 'hb_users',
  HALLS: 'hb_halls',
  BOOKINGS: 'hb_bookings',
  CURRENT_USER: 'hb_current_user',
  THEME: 'hb_theme',
};

// ─── Initialize seed data ───────────────────────────────────────────────────
export const initializeData = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SAMPLE_USERS));
  }
  if (!localStorage.getItem(KEYS.HALLS)) {
    localStorage.setItem(KEYS.HALLS, JSON.stringify(SAMPLE_HALLS));
  }
  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(SAMPLE_BOOKINGS));
  }
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.USERS)) || []; }
  catch { return []; }
};

export const saveUsers = (users) => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.CURRENT_USER)); }
  catch { return null; }
};

export const saveCurrentUser = (user) => {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
};

// ─── Halls ───────────────────────────────────────────────────────────────────
export const getHalls = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.HALLS)) || []; }
  catch { return []; }
};

export const saveHalls = (halls) => {
  localStorage.setItem(KEYS.HALLS, JSON.stringify(halls));
};

// ─── Bookings ────────────────────────────────────────────────────────────────
export const getBookings = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.BOOKINGS)) || []; }
  catch { return []; }
};

export const saveBookings = (bookings) => {
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
};

// ─── Theme ───────────────────────────────────────────────────────────────────
export const getTheme = () => {
  return localStorage.getItem(KEYS.THEME) || 'dark';
};

export const saveTheme = (theme) => {
  localStorage.setItem(KEYS.THEME, theme);
};

// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HallProvider } from './context/HallContext';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider } from './context/ToastContext';
import { initializeData } from './utils/localStorage';
import ToastContainer from './components/Toast';
import AppRoutes from './routes/AppRoutes';

// Seed LocalStorage on first load
initializeData();

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <HallProvider>
            <BookingProvider>
              <AppRoutes />
              <ToastContainer />
            </BookingProvider>
          </HallProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;

// src/context/BookingContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getBookings, saveBookings } from '../utils/localStorage';
import { generateId, hasConflict, calcDuration } from '../utils/helpers';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBookings(getBookings());
    setLoading(false);
  }, []);

  const persist = (updated) => {
    setBookings(updated);
    saveBookings(updated);
  };

  const createBooking = useCallback((data) => {
    // Conflict detection
    if (hasConflict(bookings, data.hallId, data.bookingDate, data.startTime, data.endTime)) {
      return {
        success: false,
        message: 'This hall is already booked for the selected time slot. Please choose a different time.',
      };
    }
    if (data.startTime >= data.endTime) {
      return { success: false, message: 'End time must be after start time.' };
    }
    const duration = calcDuration(data.startTime, data.endTime);
    const totalAmount = duration * data.pricePerHour;
    const newBooking = {
      id: generateId('booking'),
      ...data,
      duration,
      totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persist([...bookings, newBooking]);
    return { success: true, booking: newBooking };
  }, [bookings]);

  const cancelBooking = useCallback((id, userId, isAdmin = false) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return { success: false, message: 'Booking not found.' };
    if (!isAdmin && booking.userId !== userId) return { success: false, message: 'Unauthorized.' };
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: 'Cancelled', updatedAt: new Date().toISOString() } : b
    );
    persist(updated);
    return { success: true };
  }, [bookings]);

  const updateBookingStatus = useCallback((id, status) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b
    );
    persist(updated);
    return { success: true };
  }, [bookings]);

  const getUserBookings = useCallback((userId) => {
    return bookings.filter((b) => b.userId === userId);
  }, [bookings]);

  const getHallBookings = useCallback((hallId) => {
    return bookings.filter((b) => b.hallId === hallId && b.status !== 'Cancelled' && b.status !== 'Rejected');
  }, [bookings]);

  const checkAvailability = useCallback((hallId, date, startTime, endTime) => {
    return !hasConflict(bookings, hallId, date, startTime, endTime);
  }, [bookings]);

  return (
    <BookingContext.Provider value={{
      bookings, loading, createBooking, cancelBooking, updateBookingStatus,
      getUserBookings, getHallBookings, checkAvailability,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within BookingProvider');
  return ctx;
};

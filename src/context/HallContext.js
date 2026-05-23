// src/context/HallContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getHalls, saveHalls } from '../utils/localStorage';
import { generateId } from '../utils/helpers';

const HallContext = createContext(null);

export const HallProvider = ({ children }) => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHalls(getHalls());
    setLoading(false);
  }, []);

  const persist = (updated) => {
    setHalls(updated);
    saveHalls(updated);
  };

  const addHall = useCallback((data) => {
    const newHall = {
      id: generateId('hall'),
      ...data,
      createdAt: new Date().toISOString(),
    };
    const updated = [...halls, newHall];
    persist(updated);
    return { success: true, hall: newHall };
  }, [halls]);

  const updateHall = useCallback((id, data) => {
    const updated = halls.map((h) => h.id === id ? { ...h, ...data, updatedAt: new Date().toISOString() } : h);
    persist(updated);
    return { success: true };
  }, [halls]);

  const deleteHall = useCallback((id) => {
    const updated = halls.filter((h) => h.id !== id);
    persist(updated);
    return { success: true };
  }, [halls]);

  const getHallById = useCallback((id) => halls.find((h) => h.id === id), [halls]);

  const updateAvailability = useCallback((id, status) => {
    const updated = halls.map((h) => h.id === id ? { ...h, availabilityStatus: status } : h);
    persist(updated);
    return { success: true };
  }, [halls]);

  return (
    <HallContext.Provider value={{
      halls, loading, addHall, updateHall, deleteHall, getHallById, updateAvailability,
    }}>
      {children}
    </HallContext.Provider>
  );
};

export const useHalls = () => {
  const ctx = useContext(HallContext);
  if (!ctx) throw new Error('useHalls must be used within HallProvider');
  return ctx;
};

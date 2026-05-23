// src/layouts/DashboardLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const DashboardLayout = () => {
  const { isAdmin } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Desktop sidebar */}
      <Sidebar role={isAdmin ? 'admin' : 'user'} />

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col">
            <Sidebar role={isAdmin ? 'admin' : 'user'} />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="font-display font-bold text-slate-100">
            Hall<span className="text-amber-400">Book</span>
          </span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

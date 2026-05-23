// src/components/Sidebar.js
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, CalendarDays, Users, Settings,
  LogOut, Menu, X, Star, PlusSquare, ClipboardList, User, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getInitials } from '../utils/helpers';

const NavItem = ({ to, icon: Icon, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
  >
    <Icon size={16} />
    <span>{label}</span>
  </NavLink>
);

const Sidebar = ({ role = 'user' }) => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
  };

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/halls', icon: Building2, label: 'Manage Halls' },
    { to: '/admin/bookings', icon: ClipboardList, label: 'Manage Bookings' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const userLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/halls', icon: Building2, label: 'Browse Halls' },
    { to: '/dashboard/bookings', icon: CalendarDays, label: 'My Bookings' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} min-h-screen sticky top-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Building2 size={15} className="text-slate-900" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-slate-100">
              Hall<span className="text-amber-400">Book</span>
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ChevronRight size={16} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-slate-800">
            <span className={`badge text-[10px] font-bold uppercase tracking-widest ${role === 'admin' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-blue-500/15 text-blue-400 border-blue-500/20'}`}>
              {role === 'admin' ? '⚡ Admin' : '👤 User'}
            </span>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {links.map((link) => (
            collapsed ? (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center justify-center p-2.5 rounded-lg transition-all ${isActive ? 'bg-amber-500/10 text-amber-400' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`
                }
                title={link.label}
              >
                <link.icon size={16} />
              </NavLink>
            ) : (
              <NavItem key={link.to} {...link} />
            )
          ))}
        </nav>

        {/* User profile section */}
        <div className="border-t border-slate-800 p-3 space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold font-display shrink-0">
                {getInitials(currentUser?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{currentUser?.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={15} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

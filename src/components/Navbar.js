// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Menu, X, LogOut, User, LayoutDashboard,
  ChevronDown, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getInitials } from '../utils/helpers';

const Navbar = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
              <Building2 size={16} className="text-slate-900" />
            </div>
            <span className="font-display font-bold text-lg text-slate-100">
              Hall<span className="text-amber-400">Book</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/halls" className="btn-ghost text-sm">Browse Halls</Link>
            {isAuthenticated && (
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-ghost text-sm">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Search shortcut */}
            <Link to="/halls" className="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-all border border-slate-700">
              <Search size={14} />
              <span>Search halls…</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-1.5 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold font-display">
                    {getInitials(currentUser?.name)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-300 max-w-[100px] truncate">
                    {currentUser?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-sm font-semibold text-slate-200 truncate">{currentUser?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                      {isAdmin && (
                        <span className="mt-1 inline-block badge bg-amber-500/15 text-amber-400 border border-amber-500/20 text-[10px]">Admin</span>
                      )}
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all"
                      >
                        <User size={14} className="text-slate-500" /> Profile Settings
                      </Link>
                      <Link
                        to={isAdmin ? '/admin' : '/dashboard'}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all"
                      >
                        <LayoutDashboard size={14} className="text-slate-500" /> Dashboard
                      </Link>
                    </div>
                    <div className="p-1.5 border-t border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden btn-ghost p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 animate-fade-in">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link to="/halls" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start">Browse Halls</Link>
            {isAuthenticated && (
              <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)} className="btn-ghost justify-start">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Click-outside for profile */}
      {profileOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setProfileOpen(false)} />}
    </nav>
  );
};

export default Navbar;

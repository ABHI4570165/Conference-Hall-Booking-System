// src/pages/UserDashboard.js
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, CheckCircle, XCircle, Building2, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { formatCurrency, formatDate, getStatusBadge, isUpcoming } from '../utils/helpers';

const StatCard = ({ icon: Icon, label, value, color = 'amber' }) => {
  const colors = {
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-slate-100">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { getUserBookings } = useBookings();

  const myBookings = getUserBookings(currentUser?.id);

  const stats = useMemo(() => ({
    total: myBookings.length,
    upcoming: myBookings.filter(isUpcoming).length,
    approved: myBookings.filter((b) => b.status === 'Approved').length,
    cancelled: myBookings.filter((b) => b.status === 'Cancelled' || b.status === 'Rejected').length,
  }), [myBookings]);

  const upcomingBookings = myBookings
    .filter(isUpcoming)
    .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))
    .slice(0, 5);

  const recentBookings = [...myBookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const totalSpent = myBookings
    .filter((b) => b.status === 'Approved')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-title">
            Welcome back, {currentUser?.name?.split(' ')[0]} 👋
          </h1>
          <p className="section-subtitle">Here's an overview of your bookings</p>
        </div>
        <Link to="/halls" className="btn-primary text-sm shrink-0">
          <Building2 size={15} /> Book a Hall
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Total Bookings" value={stats.total} color="amber" />
        <StatCard icon={Clock} label="Upcoming" value={stats.upcoming} color="blue" />
        <StatCard icon={CheckCircle} label="Approved" value={stats.approved} color="emerald" />
        <StatCard icon={XCircle} label="Cancelled/Rejected" value={stats.cancelled} color="red" />
      </div>

      {/* Total spent */}
      <div className="card bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border-amber-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Total Amount Spent</p>
            <p className="font-display font-extrabold text-3xl text-amber-400">{formatCurrency(totalSpent)}</p>
            <p className="text-xs text-slate-600 mt-1">Across {stats.approved} approved booking{stats.approved !== 1 ? 's' : ''}</p>
          </div>
          <TrendingUp size={32} className="text-amber-500/30" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-slate-100">Upcoming Bookings</h2>
            <Link to="/dashboard/bookings" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No upcoming bookings</p>
              <Link to="/halls" className="text-xs text-amber-400 hover:text-amber-300 mt-2 inline-block">
                Book a hall →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-lg flex flex-col items-center justify-center shrink-0">
                    <p className="text-[10px] text-amber-500 font-semibold leading-none">
                      {new Date(b.bookingDate).toLocaleString('en', { month: 'short' }).toUpperCase()}
                    </p>
                    <p className="text-base font-display font-bold text-amber-400 leading-none">
                      {new Date(b.bookingDate).getDate()}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{b.hallName}</p>
                    <p className="text-xs text-slate-500">{b.startTime} – {b.endTime}</p>
                  </div>
                  <span className={getStatusBadge(b.status)}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-slate-100">Recent Bookings</h2>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No booking history</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="min-w-0 mr-3">
                    <p className="text-sm font-medium text-slate-200 truncate">{b.hallName}</p>
                    <p className="text-xs text-slate-500">{formatDate(b.bookingDate)} · {formatCurrency(b.totalAmount)}</p>
                  </div>
                  <span className={`${getStatusBadge(b.status)} shrink-0`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

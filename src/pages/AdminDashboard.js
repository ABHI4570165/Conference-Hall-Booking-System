// src/pages/AdminDashboard.js
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Users, CalendarDays, TrendingUp, Star,
  AlertTriangle, ArrowRight
} from 'lucide-react';
import { useHalls } from '../context/HallContext';
import { useBookings } from '../context/BookingContext';
import { getUsers } from '../utils/localStorage';
import { formatCurrency, formatDate, getStatusBadge, getMostBookedHall } from '../utils/helpers';

const AdminDashboard = () => {
  const { halls } = useHalls();
  const { bookings } = useBookings();
  const users = getUsers().filter((u) => u.role === 'user');

  const stats = useMemo(() => ({
    totalHalls: halls.length,
    totalUsers: users.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === 'Pending').length,
    approvedBookings: bookings.filter((b) => b.status === 'Approved').length,
    revenue: bookings.filter((b) => b.status === 'Approved').reduce((s, b) => s + b.totalAmount, 0),
    availableHalls: halls.filter((h) => h.availabilityStatus === 'Available').length,
  }), [halls, bookings, users]);

  const mostBooked = getMostBookedHall(bookings, halls);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  // Hall utilization
  const hallUtilization = useMemo(() => {
    return halls.map((h) => {
      const count = bookings.filter(
        (b) => b.hallId === h.id && b.status !== 'Cancelled' && b.status !== 'Rejected'
      ).length;
      return { ...h, bookingCount: count };
    }).sort((a, b) => b.bookingCount - a.bookingCount);
  }, [halls, bookings]);

  const StatCard = ({ icon: Icon, label, value, sub, color = 'amber', to }) => {
    const Wrapper = to ? Link : 'div';
    const colors = {
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      red: 'bg-red-500/10 text-red-400 border-red-500/20',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
    return (
      <Wrapper to={to} className={`card flex items-center gap-4 ${to ? 'hover:border-slate-600 transition-colors cursor-pointer' : ''}`}>
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-slate-100">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
          {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
        </div>
      </Wrapper>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle">System overview and analytics</p>
        </div>
        <Link to="/admin/halls" className="btn-primary text-sm">
          <Building2 size={15} /> Add Hall
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Total Halls" value={stats.totalHalls} sub={`${stats.availableHalls} available`} color="amber" to="/admin/halls" />
        <StatCard icon={Users} label="Registered Users" value={stats.totalUsers} color="blue" to="/admin/users" />
        <StatCard icon={CalendarDays} label="Total Bookings" value={stats.totalBookings} sub={`${stats.pendingBookings} pending`} color="purple" to="/admin/bookings" />
        <StatCard icon={TrendingUp} label="Total Revenue" value={formatCurrency(stats.revenue)} sub="approved bookings" color="emerald" />
      </div>

      {/* Pending alert */}
      {stats.pendingBookings > 0 && (
        <Link to="/admin/bookings" className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3.5 hover:bg-amber-500/15 transition-colors">
          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          <p className="text-sm font-medium text-amber-300">
            {stats.pendingBookings} booking{stats.pendingBookings > 1 ? 's' : ''} awaiting your approval
          </p>
          <ArrowRight size={15} className="text-amber-500 ml-auto" />
        </Link>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-slate-100">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Manage all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="table-header text-left">Hall</th>
                  <th className="table-header text-left">User</th>
                  <th className="table-header text-left">Date</th>
                  <th className="table-header text-left">Amount</th>
                  <th className="table-header text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={5} className="table-cell text-center text-slate-600 py-8">No bookings yet</td></tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="table-cell font-medium text-slate-200 truncate max-w-[120px]">{b.hallName}</td>
                      <td className="table-cell text-slate-400 truncate max-w-[100px]">{b.userName}</td>
                      <td className="table-cell text-slate-400">{formatDate(b.bookingDate)}</td>
                      <td className="table-cell text-amber-400 font-medium">{formatCurrency(b.totalAmount)}</td>
                      <td className="table-cell"><span className={getStatusBadge(b.status)}>{b.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Most Booked */}
          {mostBooked && (
            <div className="card border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center gap-2 mb-3">
                <Star size={15} className="text-amber-400" />
                <h3 className="font-display font-semibold text-slate-200 text-sm">Most Booked Hall</h3>
              </div>
              <img
                src={mostBooked.hall.image}
                alt={mostBooked.hall.hallName}
                className="w-full h-28 object-cover rounded-xl mb-3 border border-slate-700"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80'; }}
              />
              <p className="font-display font-bold text-slate-100">{mostBooked.hall.hallName}</p>
              <p className="text-xs text-slate-500 mt-0.5">{mostBooked.count} booking{mostBooked.count > 1 ? 's' : ''}</p>
            </div>
          )}

          {/* Hall Utilization */}
          <div className="card">
            <h3 className="font-display font-semibold text-slate-200 mb-3 text-sm">Hall Utilization</h3>
            <div className="space-y-3">
              {hallUtilization.slice(0, 5).map((h) => {
                const max = hallUtilization[0]?.bookingCount || 1;
                const pct = max > 0 ? (h.bookingCount / max) * 100 : 0;
                return (
                  <div key={h.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 truncate max-w-[140px]">{h.hallName}</span>
                      <span className="text-slate-500 shrink-0">{h.bookingCount}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking status breakdown */}
          <div className="card">
            <h3 className="font-display font-semibold text-slate-200 mb-3 text-sm">Booking Status</h3>
            <div className="space-y-2">
              {[
                { label: 'Pending', value: bookings.filter((b) => b.status === 'Pending').length, color: 'text-blue-400' },
                { label: 'Approved', value: bookings.filter((b) => b.status === 'Approved').length, color: 'text-emerald-400' },
                { label: 'Rejected', value: bookings.filter((b) => b.status === 'Rejected').length, color: 'text-red-400' },
                { label: 'Cancelled', value: bookings.filter((b) => b.status === 'Cancelled').length, color: 'text-slate-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className={`font-display font-bold text-lg ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

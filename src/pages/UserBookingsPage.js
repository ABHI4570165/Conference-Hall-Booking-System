// src/pages/UserBookingsPage.js
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Search, X, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, getStatusBadge } from '../utils/helpers';

const UserBookingsPage = () => {
  const { currentUser } = useAuth();
  const { getUserBookings, cancelBooking } = useBookings();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const myBookings = getUserBookings(currentUser?.id);

  const filtered = useMemo(() => {
    return myBookings
      .filter((b) => {
        if (search && !b.hallName.toLowerCase().includes(search.toLowerCase())) return false;
        if (statusFilter && b.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [myBookings, search, statusFilter]);

  const handleCancel = (id) => {
    setCancellingId(id);
    setTimeout(() => {
      const result = cancelBooking(id, currentUser.id);
      if (result.success) toast.success('Booking cancelled successfully.');
      else toast.error(result.message);
      setCancellingId(null);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="section-title">My Bookings</h1>
          <p className="section-subtitle">{myBookings.length} total booking{myBookings.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/halls" className="btn-primary text-sm">
          <Building2 size={15} /> New Booking
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search size={14} className="text-slate-500 shrink-0" />
          <input
            className="bg-transparent flex-1 outline-none text-sm text-slate-200 placeholder-slate-600"
            placeholder="Search by hall name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')} className="text-slate-500 hover:text-slate-300"><X size={12} /></button>}
        </div>
        <select
          className="input w-auto text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {['Pending', 'Approved', 'Rejected', 'Cancelled'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Bookings */}
      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <CalendarDays size={40} className="text-slate-700 mb-4" />
          <h3 className="font-display font-bold text-slate-300 mb-2">No bookings found</h3>
          <p className="text-sm text-slate-500 mb-5">
            {myBookings.length === 0 ? "You haven't made any bookings yet." : "No bookings match your filters."}
          </p>
          <Link to="/halls" className="btn-primary text-sm">Browse Halls</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div key={booking.id} className="card border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Date block */}
                  <div className="w-14 shrink-0 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-center">
                    <p className="text-[10px] text-amber-500 font-bold uppercase">
                      {new Date(booking.bookingDate).toLocaleString('en', { month: 'short' })}
                    </p>
                    <p className="text-xl font-display font-extrabold text-amber-400 leading-tight">
                      {new Date(booking.bookingDate).getDate()}
                    </p>
                    <p className="text-[9px] text-slate-500">
                      {new Date(booking.bookingDate).toLocaleString('en', { weekday: 'short' })}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-slate-100">{booking.hallName}</h3>
                      <span className={getStatusBadge(booking.status)}>{booking.status}</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-1">
                      {booking.startTime} – {booking.endTime} · {booking.duration}h
                    </p>
                    {booking.purpose && (
                      <p className="text-xs text-slate-500 italic">"{booking.purpose}"</p>
                    )}
                    <p className="text-xs text-slate-600 mt-1">
                      Booked on {formatDate(booking.createdAt)} · ID: <span className="font-mono text-amber-600">{booking.id.slice(-8)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <div className="text-right">
                    <p className="font-display font-bold text-lg text-amber-400">{formatCurrency(booking.totalAmount)}</p>
                    <p className="text-xs text-slate-600">{formatCurrency(booking.totalAmount / booking.duration)}/hr</p>
                  </div>
                  {(booking.status === 'Pending' || booking.status === 'Approved') && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="btn-danger text-sm py-1.5 px-3 disabled:opacity-60"
                    >
                      {cancellingId === booking.id ? (
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <X size={13} />
                      )}
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;

// src/pages/ManageBookingsPage.js
import React, { useState, useMemo } from 'react';
import { Check, X, Search, Filter, Eye } from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, getStatusBadge } from '../utils/helpers';

const ManageBookingsPage = () => {
  const { bookings, updateBookingStatus } = useBookings();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => {
        const q = search.toLowerCase();
        if (q && !b.hallName.toLowerCase().includes(q) && !b.userName.toLowerCase().includes(q)) return false;
        if (statusFilter && b.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bookings, search, statusFilter]);

  const handleAction = (id, action) => {
    setProcessingId(id);
    setTimeout(() => {
      updateBookingStatus(id, action);
      toast.success(`Booking ${action.toLowerCase()} successfully.`);
      setProcessingId(null);
      if (selectedBooking?.id === id) setSelectedBooking((b) => ({ ...b, status: action }));
    }, 400);
  };

  const statusCounts = useMemo(() => ({
    all: bookings.length,
    Pending: bookings.filter((b) => b.status === 'Pending').length,
    Approved: bookings.filter((b) => b.status === 'Approved').length,
    Rejected: bookings.filter((b) => b.status === 'Rejected').length,
    Cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
  }), [bookings]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Manage Bookings</h1>
        <p className="section-subtitle">Review and approve booking requests</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'All', value: '', count: statusCounts.all },
          { label: 'Pending', value: 'Pending', count: statusCounts.Pending },
          { label: 'Approved', value: 'Approved', count: statusCounts.Approved },
          { label: 'Rejected', value: 'Rejected', count: statusCounts.Rejected },
          { label: 'Cancelled', value: 'Cancelled', count: statusCounts.Cancelled },
        ].map(({ label, value, count }) => (
          <button
            key={label}
            onClick={() => setStatusFilter(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${statusFilter === value
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === value ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-500'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
        <Search size={14} className="text-slate-500" />
        <input
          className="bg-transparent flex-1 outline-none text-sm text-slate-200 placeholder-slate-600"
          placeholder="Search by hall name or user…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              {['Booking', 'User', 'Date & Time', 'Duration', 'Amount', 'Status', 'Actions'].map((h) => (
                <th key={h} className="table-header text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="table-cell text-center py-10 text-slate-600">No bookings found</td></tr>
            ) : filtered.map((b) => (
              <tr key={b.id} className="bg-slate-900 hover:bg-slate-800/50 transition-colors">
                <td className="table-cell">
                  <div>
                    <p className="font-semibold text-slate-200">{b.hallName}</p>
                    <p className="text-xs text-slate-500 font-mono">{b.id.slice(-8)}</p>
                  </div>
                </td>
                <td className="table-cell">
                  <p className="text-slate-300">{b.userName}</p>
                  <p className="text-xs text-slate-500">{b.userEmail}</p>
                </td>
                <td className="table-cell">
                  <p className="text-slate-300">{formatDate(b.bookingDate)}</p>
                  <p className="text-xs text-slate-500">{b.startTime} – {b.endTime}</p>
                </td>
                <td className="table-cell text-slate-400">{b.duration}h</td>
                <td className="table-cell text-amber-400 font-medium">{formatCurrency(b.totalAmount)}</td>
                <td className="table-cell"><span className={getStatusBadge(b.status)}>{b.status}</span></td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    {/* Details */}
                    <button onClick={() => setSelectedBooking(b)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-slate-700 transition-all"
                      title="View details">
                      <Eye size={13} />
                    </button>
                    {/* Approve */}
                    {b.status === 'Pending' && (
                      <button
                        onClick={() => handleAction(b.id, 'Approved')}
                        disabled={processingId === b.id}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-slate-700 transition-all disabled:opacity-60"
                        title="Approve">
                        {processingId === b.id ? <span className="w-3 h-3 border border-slate-600 border-t-emerald-400 rounded-full animate-spin block" /> : <Check size={13} />}
                      </button>
                    )}
                    {/* Reject */}
                    {(b.status === 'Pending' || b.status === 'Approved') && (
                      <button
                        onClick={() => handleAction(b.id, 'Rejected')}
                        disabled={processingId === b.id}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-700 transition-all disabled:opacity-60"
                        title="Reject">
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="font-display font-bold text-slate-100">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-500 hover:text-slate-300 p-1.5 hover:bg-slate-800 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-3 text-sm">
              {[
                ['Booking ID', <span className="font-mono text-amber-400">{selectedBooking.id}</span>],
                ['Hall', selectedBooking.hallName],
                ['User', selectedBooking.userName],
                ['Email', selectedBooking.userEmail],
                ['Date', formatDate(selectedBooking.bookingDate)],
                ['Time', `${selectedBooking.startTime} – ${selectedBooking.endTime}`],
                ['Duration', `${selectedBooking.duration} hour(s)`],
                ['Amount', formatCurrency(selectedBooking.totalAmount)],
                ['Purpose', selectedBooking.purpose || '—'],
                ['Status', <span className={getStatusBadge(selectedBooking.status)}>{selectedBooking.status}</span>],
                ['Created', formatDate(selectedBooking.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5 border-b border-slate-800/50 last:border-0">
                  <span className="text-slate-500 shrink-0">{k}</span>
                  <span className="text-slate-300 text-right">{v}</span>
                </div>
              ))}
            </div>
            {selectedBooking.status === 'Pending' && (
              <div className="px-6 pb-6 flex gap-3">
                <button onClick={() => { handleAction(selectedBooking.id, 'Rejected'); setSelectedBooking(null); }} className="btn-danger flex-1 text-sm">
                  <X size={14} /> Reject
                </button>
                <button onClick={() => { handleAction(selectedBooking.id, 'Approved'); setSelectedBooking(null); }} className="btn-primary flex-1 text-sm">
                  <Check size={14} /> Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookingsPage;

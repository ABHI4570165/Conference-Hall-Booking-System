// src/components/BookingModal.js
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { calcDuration, formatCurrency, getTimeSlots, todayStr } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ hall, onClose }) => {
  const { createBooking, checkAvailability } = useBookings();
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bookingDate: todayStr(),
    startTime: '09:00',
    endTime: '11:00',
    purpose: '',
  });
  const [available, setAvailable] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = confirm

  const timeSlots = getTimeSlots();
  const duration = calcDuration(form.startTime, form.endTime);
  const totalAmount = duration * hall.pricePerHour;

  // Check availability whenever date/time changes
  useEffect(() => {
    if (form.bookingDate && form.startTime && form.endTime && form.startTime < form.endTime) {
      const isAvail = checkAvailability(hall.id, form.bookingDate, form.startTime, form.endTime);
      setAvailable(isAvail);
    } else {
      setAvailable(null);
    }
  }, [form.bookingDate, form.startTime, form.endTime]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book a hall.');
      navigate('/login');
      return;
    }
    if (!form.purpose.trim()) {
      toast.error('Please enter the purpose of booking.');
      return;
    }
    if (duration <= 0) {
      toast.error('End time must be after start time.');
      return;
    }

    setSubmitting(true);
    const result = createBooking({
      hallId: hall.id,
      hallName: hall.hallName,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      bookingDate: form.bookingDate,
      startTime: form.startTime,
      endTime: form.endTime,
      purpose: form.purpose,
      pricePerHour: hall.pricePerHour,
    });

    setSubmitting(false);

    if (result.success) {
      onClose();
      navigate('/booking-success', { state: { booking: result.booking, hall } });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm modal-backdrop">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl modal-content overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="font-display font-bold text-slate-100">Book {hall.hallName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{hall.hallType} · {formatCurrency(hall.pricePerHour)}/hr</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 hover:bg-slate-800 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Date */}
          <div>
            <label className="label flex items-center gap-1.5"><Calendar size={13} /> Booking Date</label>
            <input
              type="date"
              className="input"
              value={form.bookingDate}
              min={todayStr()}
              onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label flex items-center gap-1.5"><Clock size={13} /> Start Time</label>
              <select className="input" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}>
                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">End Time</label>
              <select className="input" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}>
                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Availability indicator */}
          {available !== null && (
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${available
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              {available ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
              {available ? 'Slot is available' : 'This slot conflicts with an existing booking'}
            </div>
          )}

          {/* Purpose */}
          <div>
            <label className="label">Purpose of Booking</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="e.g. Quarterly review meeting, Product launch…"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
          </div>

          {/* Cost summary */}
          {duration > 0 && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Duration</span>
                <span className="text-slate-200 font-medium">{duration} hr{duration > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Rate</span>
                <span className="text-slate-200 font-medium">{formatCurrency(hall.pricePerHour)}/hr</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-2">
                <span className="font-semibold text-slate-200">Total</span>
                <span className="font-bold text-lg font-display text-amber-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={submitting || available === false || duration <= 0}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-700 border-t-slate-900 rounded-full animate-spin" />
                Processing…
              </span>
            ) : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

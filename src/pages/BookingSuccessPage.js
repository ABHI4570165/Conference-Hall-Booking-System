// src/pages/BookingSuccessPage.js
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Users, DollarSign, ArrowRight, LayoutDashboard } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../utils/helpers';
import Navbar from '../components/Navbar';

const BookingSuccessPage = () => {
  const location = useLocation();
  const { booking, hall } = location.state || {};

  if (!booking) return <Navigate to="/halls" replace />;

  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar />
      <div className="pt-16 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-lg w-full">
          {/* Success animation */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5 animate-scale-in">
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
            <h1 className="font-display font-extrabold text-3xl text-slate-100 mb-2">Booking Submitted!</h1>
            <p className="text-slate-400">
              Your booking request has been received and is pending admin approval.
            </p>
          </div>

          {/* Booking details card */}
          <div className="card border-slate-700 mb-5">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Booking ID</p>
                <p className="font-mono text-sm text-amber-400 font-semibold">{booking.id}</p>
              </div>
              <span className="badge badge-pending">⏳ Pending Approval</span>
            </div>

            {/* Hall image */}
            {hall && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
                <img
                  src={hall.image}
                  alt={hall.hallName}
                  className="w-14 h-14 object-cover rounded-xl border border-slate-700"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80'; }}
                />
                <div>
                  <p className="font-display font-bold text-slate-100">{booking.hallName}</p>
                  <p className="text-xs text-slate-500">{hall?.hallType}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: 'Date', value: formatDate(booking.bookingDate) },
                { icon: Clock, label: 'Time', value: `${booking.startTime} – ${booking.endTime}` },
                { icon: Users, label: 'Duration', value: `${booking.duration} hour${booking.duration > 1 ? 's' : ''}` },
                { icon: DollarSign, label: 'Total Amount', value: formatCurrency(booking.totalAmount) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} className="text-slate-500" />
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                  <p className={`text-sm font-semibold ${label === 'Total Amount' ? 'text-amber-400' : 'text-slate-200'}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {booking.purpose && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Purpose</p>
                <p className="text-sm text-slate-300">{booking.purpose}</p>
              </div>
            )}
          </div>

          {/* Status info */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-300 font-medium mb-1">What happens next?</p>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Your booking is pending admin review</li>
              <li>• You'll be notified once it's approved or rejected</li>
              <li>• Check your dashboard for real-time status updates</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Link to="/dashboard/bookings" className="btn-secondary flex-1">
              <LayoutDashboard size={15} /> My Bookings
            </Link>
            <Link to="/halls" className="btn-primary flex-1">
              Browse More <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;

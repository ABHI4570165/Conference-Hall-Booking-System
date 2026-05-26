// src/pages/HallDetailsPage.js
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Users, Clock, ArrowLeft, Calendar,
  CheckCircle, AlertCircle, Zap
} from 'lucide-react';
import { useHalls } from '../context/HallContext';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getStatusBadge, getFacilityIcon, formatDate } from '../utils/helpers';
import BookingModal from '../components/BookingModal';
import Navbar from '../components/Navbar';

const HallDetailsPage = () => {
  const { id } = useParams();
  const { getHallById } = useHalls();
  const { getHallBookings } = useBookings();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const hall = getHallById(id);
  const [showBooking, setShowBooking] = useState(false);

  if (!hall) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <AlertCircle size={40} className="text-slate-600" />
      <h2 className="font-display font-bold text-xl text-slate-300">Hall not found</h2>
      <Link to="/halls" className="btn-secondary">Back to Halls</Link>
    </div>
  );

  const recentBookings = getHallBookings(hall.id)
    .filter((b) => b.status !== 'Cancelled' && b.status !== 'Rejected')
    .slice(0, 5);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/halls/${id}` } } });
      return;
    }
    setShowBooking(true);
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/halls" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-400 transition-colors">
            <ArrowLeft size={14} /> Back to Halls
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero image */}
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
                <img
                  src={hall.image}
                  alt={hall.hallName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="badge bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs mb-2">{hall.hallType}</span>
                      <h1 className="font-display font-extrabold text-3xl text-white">{hall.hallName}</h1>
                    </div>
                    <span className={getStatusBadge(hall.availabilityStatus)}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {hall.availabilityStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: MapPin, label: 'Location', value: hall.location },
                  { icon: Users, label: 'Capacity', value: `${hall.capacity} persons` },
                  { icon: Clock, label: 'Rate', value: `${formatCurrency(hall.pricePerHour)}/hr` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="card text-center">
                    <Icon size={18} className="text-amber-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-slate-200 truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="card">
                <h2 className="font-display font-bold text-lg text-slate-100 mb-3">About this Space</h2>
                <p className="text-slate-400 leading-relaxed text-sm">{hall.description}</p>
              </div>

              {/* Facilities */}
              <div className="card">
                <h2 className="font-display font-bold text-lg text-slate-100 mb-4">Facilities & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hall.facilities.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-700">
                      <span className="text-base">{getFacilityIcon(f)}</span>
                      <span className="text-sm text-slate-300 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming bookings (dates blocked) */}
              {recentBookings.length > 0 && (
                <div className="card">
                  <h2 className="font-display font-bold text-lg text-slate-100 mb-4">Upcoming Bookings</h2>
                  <div className="space-y-2">
                    {recentBookings.map((b) => (
                      <div key={b.id} className="flex items-center justify-between py-2.5 px-3 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-3">
                          <Calendar size={14} className="text-amber-400 shrink-0" />
                          <div>
                            <p className="text-sm text-slate-300 font-medium">{formatDate(b.bookingDate)}</p>
                            <p className="text-xs text-slate-500">{b.startTime} – {b.endTime}</p>
                          </div>
                        </div>
                        <span className={getStatusBadge(b.status)}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column – Booking card */}
            <div className="lg:col-span-1">
              <div className="card border-slate-700 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-2xl font-display font-extrabold text-amber-400">
                      {formatCurrency(hall.pricePerHour)}
                    </p>
                    <p className="text-xs text-slate-500">per hour</p>
                  </div>
                  <span className={getStatusBadge(hall.availabilityStatus)}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {hall.availabilityStatus}
                  </span>
                </div>

                <div className="space-y-3 mb-5 text-sm">
                  {[
                    { icon: MapPin, text: hall.location },
                    { icon: Users, text: `Fits up to ${hall.capacity} people` },
                    { icon: Zap, text: `${hall.facilities.length} facilities included` },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-slate-400">
                      <Icon size={14} className="text-slate-600 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={hall.availabilityStatus !== 'Available'}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hall.availabilityStatus === 'Available' ? (
                    <><Calendar size={16} /> Book This Space</>
                  ) : hall.availabilityStatus === 'Under Maintenance' ? (
                    'Under Maintenance'
                  ) : (
                    'Currently Booked'
                  )}
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-slate-600 text-center mt-2.5">
                    <Link to="/login" className="text-amber-400 hover:text-amber-300">Sign in</Link> to book this space
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                    Instant booking confirmation
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                    Admin approval within 2 hours
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                    Free cancellation before booking date
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && <BookingModal hall={hall} onClose={() => setShowBooking(false)} />}
    </div>
  );
};

export default HallDetailsPage;

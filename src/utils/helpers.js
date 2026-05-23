// src/utils/helpers.js

/** Generate a unique ID */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
};

/** Format currency in INR */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/** Format a date string to readable form */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Format ISO string to time */
export const formatTime = (timeStr) => {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

/** Calculate duration in hours between two HH:MM strings */
export const calcDuration = (start, end) => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  return Math.max(0, (endMins - startMins) / 60);
};

/** Detect booking conflicts */
export const hasConflict = (bookings, hallId, date, startTime, endTime, excludeId = null) => {
  const relevantBookings = bookings.filter(
    (b) =>
      b.hallId === hallId &&
      b.bookingDate === date &&
      b.id !== excludeId &&
      b.status !== 'Cancelled' &&
      b.status !== 'Rejected'
  );
  const newStart = timeToMins(startTime);
  const newEnd = timeToMins(endTime);

  return relevantBookings.some((b) => {
    const bStart = timeToMins(b.startTime);
    const bEnd = timeToMins(b.endTime);
    return newStart < bEnd && newEnd > bStart;
  });
};

const timeToMins = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

/** Get initials from name */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/** Get badge class by status */
export const getStatusBadge = (status) => {
  const map = {
    Available: 'badge-available',
    Booked: 'badge-booked',
    'Under Maintenance': 'badge-maintenance',
    Pending: 'badge-pending',
    Approved: 'badge-approved',
    Rejected: 'badge-rejected',
    Cancelled: 'badge-cancelled',
  };
  return map[status] || 'badge';
};

/** Get facility icon */
export const getFacilityIcon = (facility) => {
  const icons = {
    AC: '❄️',
    WiFi: '📶',
    Projector: '📽️',
    'Smart Board': '🖥️',
    Parking: '🅿️',
    'Sound System': '🔊',
    CCTV: '📷',
    'Generator Backup': '⚡',
    'Video Conferencing': '📹',
    Whiteboard: '📋',
  };
  return icons[facility] || '✓';
};

/** Check if a booking date is upcoming */
export const isUpcoming = (booking) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bDate = new Date(booking.bookingDate);
  return bDate >= today && booking.status !== 'Cancelled' && booking.status !== 'Rejected';
};

/** Truncate text */
export const truncate = (str, n = 80) => {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
};

/** Most booked hall analytics */
export const getMostBookedHall = (bookings, halls) => {
  const counts = {};
  bookings.forEach((b) => {
    if (b.status !== 'Cancelled' && b.status !== 'Rejected') {
      counts[b.hallId] = (counts[b.hallId] || 0) + 1;
    }
  });
  const topId = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const hall = halls.find((h) => h.id === topId);
  return hall ? { hall, count: counts[topId] } : null;
};

/** Get time slots */
export const getTimeSlots = () => {
  const slots = [];
  for (let h = 6; h <= 22; h++) {
    ['00', '30'].forEach((m) => {
      const time = `${h.toString().padStart(2, '0')}:${m}`;
      slots.push(time);
    });
  }
  return slots;
};

/** Today's date string YYYY-MM-DD */
export const todayStr = () => new Date().toISOString().split('T')[0];

// src/pages/AdminUsersPage.js
import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import { getUsers } from '../utils/localStorage';
import { formatDate, getInitials } from '../utils/helpers';
import { useBookings } from '../context/BookingContext';

const AdminUsersPage = () => {
  const [search, setSearch] = useState('');
  const { bookings } = useBookings();
  const allUsers = getUsers();
  const users = allUsers.filter((u) => u.role === 'user');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const getUserBookingCount = (userId) =>
    bookings.filter((b) => b.userId === userId && b.status !== 'Cancelled').length;

  const getUserTotalSpent = (userId) =>
    bookings
      .filter((b) => b.userId === userId && b.status === 'Approved')
      .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Users</h1>
        <p className="section-subtitle">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
        <Search size={14} className="text-slate-500" />
        <input
          className="bg-transparent flex-1 outline-none text-sm text-slate-200 placeholder-slate-600"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: users.length },
          { label: 'Active Bookers', value: users.filter((u) => getUserBookingCount(u.id) > 0).length },
          { label: 'New This Month', value: users.filter((u) => new Date(u.createdAt).getMonth() === new Date().getMonth()).length },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center">
            <p className="text-2xl font-display font-bold text-slate-100">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Users Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">No users found</div>
        ) : filtered.map((user) => (
          <div key={user.id} className="card hover:border-slate-700 transition-colors">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold text-lg shrink-0">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-slate-100 truncate">{user.name}</p>
                <span className="badge bg-blue-500/15 text-blue-400 border-blue-500/20 text-[10px]">User</span>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={13} className="text-slate-600 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone size={13} className="text-slate-600 shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.department && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Briefcase size={13} className="text-slate-600 shrink-0" />
                  <span>{user.department}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={13} className="text-slate-600 shrink-0" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <div>
                <p className="text-slate-500">Bookings</p>
                <p className="font-bold text-slate-200">{getUserBookingCount(user.id)}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Total Spent</p>
                <p className="font-bold text-amber-400">
                  ₹{getUserTotalSpent(user.id).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;

// src/pages/HomePage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Users, CalendarCheck, Shield, Search,
  ArrowRight, Zap, Clock
} from 'lucide-react';
import { useHalls } from '../context/HallContext';
import HallCard from '../components/HallCard';
import { HALL_TYPES } from '../data/sampleData';

const STATS = [
  { icon: Building2, label: 'Conference Spaces', value: '7+' },
  { icon: Users, label: 'Happy Clients', value: '500+' },
  { icon: CalendarCheck, label: 'Bookings Made', value: '2,400+' },
  { icon: Shield, label: 'Uptime', value: '99.9%' },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'Reserve your hall in under 60 seconds. No paperwork, no back-and-forth emails.',
  },
  {
    icon: CalendarCheck,
    title: 'Real-time Availability',
    desc: 'See up-to-the-minute availability and conflict-free scheduling with smart detection.',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    desc: 'Book by the hour. Whether 1 hour or a full day, we accommodate every schedule.',
  },
  {
    icon: Shield,
    title: 'Admin Oversight',
    desc: 'Full admin controls for hall management, approval workflows, and usage analytics.',
  },
];

const HomePage = () => {
  const { halls } = useHalls();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/halls?search=${encodeURIComponent(searchQuery)}`);
  };

  const featuredHalls = halls.filter((h) => h.availabilityStatus === 'Available').slice(0, 3);

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
          {/* Login Button */}
        <div className="absolute top-6 left-6 z-50">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-700 hover:border-amber-500/40 text-slate-200 hover:text-amber-400 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg"
          >
            Login
            <ArrowRight size={16} />
          </Link>
        </div>
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[80vw] max-w-3xl h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 left-[10%] w-64 h-64 bg-amber-600/5 rounded-full blur-2xl" />
          <div className="absolute top-32 right-[10%] w-48 h-48 bg-amber-400/5 rounded-full blur-xl" />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 text-sm text-amber-400 font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse-slow" />
            Smart Conference Hall Booking System
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-slate-100 leading-[1.1] mb-6 animate-slide-up">
            Book Any Space,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              Anytime.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Reserve conference halls, auditoriums, meeting rooms and more — instantly.
            Conflict-free scheduling powered by smart availability detection.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 mb-10 animate-slide-up">
            <div className="flex-1 flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-amber-500 transition-colors">
              <Search size={18} className="text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Search halls, locations, types…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none text-slate-200 placeholder-slate-600 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary shrink-0">
              Search <ArrowRight size={16} />
            </button>
          </form>

          {/* Hall type quick filters */}
          <div className="flex flex-wrap justify-center gap-2 animate-fade-in">
            {HALL_TYPES.slice(0, 5).map((type) => (
              <Link
                key={type}
                to={`/halls?type=${encodeURIComponent(type)}`}
                className="text-xs font-medium text-slate-400 hover:text-amber-400 bg-slate-800/60 hover:bg-amber-500/10 border border-slate-700 hover:border-amber-500/30 px-3 py-1.5 rounded-full transition-all"
              >
                {type}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                <Icon size={18} className="text-amber-400" />
              </div>
              <p className="font-display font-bold text-3xl text-slate-100">{value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Halls ───────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">Available Now</p>
              <h2 className="font-display font-bold text-3xl text-slate-100">Featured Spaces</h2>
            </div>
            <Link to="/halls" className="btn-ghost text-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHalls.map((hall) => (
              <HallCard key={hall.id} hall={hall} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">Why HallBook</p>
            <h2 className="font-display font-bold text-3xl text-slate-100">Everything you need to book smarter</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-hover group">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <Icon size={18} className="text-amber-400" />
                </div>
                <h3 className="font-display font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 rounded-3xl p-10">
            <h2 className="font-display font-extrabold text-3xl text-slate-100 mb-3">
              Ready to book your space?
            </h2>
            <p className="text-slate-400 mb-8">
              Join hundreds of teams who use HallBook to manage their conference spaces effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="btn-primary">
                Get Started Free <ArrowRight size={16} />
              </Link>
              <Link to="/halls" className="btn-secondary">
                Browse Halls
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
              <Building2 size={13} className="text-slate-900" />
            </div>
            <span className="font-display font-bold text-slate-400">
              Hall<span className="text-amber-400">Book</span>
            </span>
          </div>
          <p className="text-sm text-slate-600">
            © 2025 HallBook. Smart Conference Hall Booking System.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

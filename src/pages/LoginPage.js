// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // Simulate async
    const result = login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`);
      if (from) navigate(from, { replace: true });
      else navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(result.message);
      setErrors({ general: result.message });
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@gmail.com', password: 'admin123' });
    else setForm({ email: 'arjun@gmail.com', password: 'user123' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-20">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[50%] translate-x-[-50%] w-[60vw] max-w-2xl h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Building2 size={18} className="text-slate-900" />
            </div>
            <span className="font-display font-bold text-xl text-slate-100">
              Hall<span className="text-amber-400">Book</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-slate-100">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage your bookings</p>
        </div>

        {/* Demo credentials */}
        <div className="flex gap-2 mb-6">
          {['admin', 'user'].map((role) => (
            <button
              key={role}
              onClick={() => fillDemo(role)}
              className="flex-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg transition-all"
            >
              Try {role === 'admin' ? '⚡ Admin' : '👤 User'} Demo
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="card border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  className={`input pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({}); }}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({}); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-slate-700 border-t-slate-900 rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

// src/pages/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Briefcase,
  UserPlus
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';


// FIELD COMPONENT OUTSIDE MAIN COMPONENT
const Field = ({
  label,
  icon: Icon,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  extra,
  showPw,
  setShowPw
}) => {
  return (
    <div>
      <label className="label">{label}</label>

      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
        )}

        <input
          id={id}
          type={type}
          className={`input ${Icon ? 'pl-10' : ''} ${
            extra ? 'pr-10' : ''
          } ${error ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        {extra && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
};


const RegisterPage = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPw: '',
    phone: '',
    department: '',
  });

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // FIXED CHANGE HANDLER
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }));
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = 'Full name is required.';
    }

    if (!form.email) {
      e.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email.';
    }

    if (!form.password) {
      e.password = 'Password is required.';
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters.';
    }

    if (form.password !== form.confirmPw) {
      e.confirmPw = 'Passwords do not match.';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    const result = register(form);

    setLoading(false);

    if (result.success) {
      toast.success(
        `Welcome to HallBook, ${result.user.name.split(' ')[0]}!`
      );

      navigate('/dashboard');
    } else {
      toast.error(result.message);

      setErrors({
        email: result.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-20">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[50%] translate-x-[-50%] w-[60vw] max-w-2xl h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* LOGO + HEADER */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 mb-6"
          >
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Building2
                size={18}
                className="text-slate-900"
              />
            </div>

            <span className="font-display font-bold text-xl text-slate-100">
              Hall<span className="text-amber-400">Book</span>
            </span>
          </Link>

          <h1 className="font-display font-bold text-2xl text-slate-100">
            Create your account
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Start booking conference spaces today
          </p>
        </div>

        {/* CARD */}
        <div className="card border-slate-700">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NAME */}
            <Field
              label="Full Name"
              icon={User}
              id="name"
              placeholder="John Smith"
              value={form.name}
              onChange={(e) =>
                handleChange('name', e.target.value)
              }
              error={errors.name}
            />

            {/* EMAIL */}
            <Field
              label="Email Address"
              icon={Mail}
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                handleChange('email', e.target.value)
              }
              error={errors.email}
            />

            {/* PHONE + DEPARTMENT */}
            <div className="grid grid-cols-2 gap-3">

              <Field
                label="Phone (Optional)"
                icon={Phone}
                id="phone"
                placeholder="9876543210"
                value={form.phone}
                onChange={(e) =>
                  handleChange('phone', e.target.value)
                }
              />

              <Field
                label="Department (Optional)"
                icon={Briefcase}
                id="department"
                placeholder="Engineering"
                value={form.department}
                onChange={(e) =>
                  handleChange('department', e.target.value)
                }
              />
            </div>

            {/* PASSWORD */}
            <Field
              label="Password"
              icon={Lock}
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) =>
                handleChange('password', e.target.value)
              }
              error={errors.password}
              extra
              showPw={showPw}
              setShowPw={setShowPw}
            />

            {/* CONFIRM PASSWORD */}
            <Field
              label="Confirm Password"
              icon={Lock}
              id="confirmPw"
              type={showPw ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={form.confirmPw}
              onChange={(e) =>
                handleChange('confirmPw', e.target.value)
              }
              error={errors.confirmPw}
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-slate-700 border-t-slate-900 rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>
        </div>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
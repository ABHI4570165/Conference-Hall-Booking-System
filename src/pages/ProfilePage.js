// src/pages/ProfilePage.js
import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, Lock, Save, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getInitials } from '../utils/helpers';
import { getUsers, saveUsers } from '../utils/localStorage';

const ProfilePage = () => {
  const { currentUser, updateProfile, isAdmin } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    department: currentUser?.department || '',
  });
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [errors, setErrors] = useState({});

  const handleProfileSave = async () => {
    if (!profile.name.trim()) {
      setErrors({ name: 'Name is required.' });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateProfile(profile);
    toast.success('Profile updated successfully.');
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    const e = {};
    const users = getUsers();
    const user = users.find((u) => u.id === currentUser.id);
    if (user?.password !== password.current) e.current = 'Current password is incorrect.';
    if (!password.next || password.next.length < 6) e.next = 'New password must be at least 6 characters.';
    if (password.next !== password.confirm) e.confirm = 'Passwords do not match.';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSavingPw(true);
    await new Promise((r) => setTimeout(r, 500));
    const idx = users.findIndex((u) => u.id === currentUser.id);
    users[idx].password = password.next;
    saveUsers(users);
    toast.success('Password changed successfully.');
    setPassword({ current: '', next: '', confirm: '' });
    setSavingPw(false);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="section-title">Profile Settings</h1>
        <p className="section-subtitle">Manage your account information</p>
      </div>

      {/* Avatar + role */}
      <div className="card flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-extrabold text-3xl shrink-0">
          {getInitials(currentUser?.name)}
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-slate-100">{currentUser?.name}</h2>
          <p className="text-slate-500 text-sm">{currentUser?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`badge text-xs ${isAdmin
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
              : 'bg-blue-500/15 text-blue-400 border-blue-500/20'}`}>
              {isAdmin ? '⚡ Administrator' : '👤 User'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <User size={16} className="text-amber-400" />
          <h2 className="font-display font-bold text-slate-100">Personal Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                value={profile.name}
                onChange={(e) => { setProfile((p) => ({ ...p, name: e.target.value })); setErrors({}); }}
              />
            </div>
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="input pl-10 opacity-60 cursor-not-allowed"
                value={currentUser?.email}
                disabled
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">Email cannot be changed.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="input pl-10"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="9876543210"
                />
              </div>
            </div>
            <div>
              <label className="label">Department</label>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="input pl-10"
                  value={profile.department}
                  onChange={(e) => setProfile((p) => ({ ...p, department: e.target.value }))}
                  placeholder="Engineering"
                />
              </div>
            </div>
          </div>

          <button onClick={handleProfileSave} disabled={saving} className="btn-primary w-full disabled:opacity-60">
            {saving ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-slate-700 border-t-slate-900 rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              <><Save size={15} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Password form */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={16} className="text-amber-400" />
          <h2 className="font-display font-bold text-slate-100">Change Password</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'current', label: 'Current Password', ph: '••••••••' },
            { key: 'next', label: 'New Password', ph: 'Min. 6 characters' },
            { key: 'confirm', label: 'Confirm New Password', ph: 'Re-enter new password' },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors[key] ? 'border-red-500' : ''}`}
                  value={password[key]}
                  placeholder={ph}
                  onChange={(e) => { setPassword((p) => ({ ...p, [key]: e.target.value })); setErrors({}); }}
                />
                {key === 'current' && (
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
              {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
            </div>
          ))}

          <button onClick={handlePasswordChange} disabled={savingPw} className="btn-secondary w-full disabled:opacity-60">
            {savingPw ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
                Updating…
              </span>
            ) : (
              <><Lock size={15} /> Update Password</>
            )}
          </button>
        </div>
      </div>

      {/* Security info */}
      <div className="card border-slate-800 bg-slate-800/30">
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-300">Account Security</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your data is stored securely in your browser's local storage. Use a strong password
              and avoid sharing your credentials with others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

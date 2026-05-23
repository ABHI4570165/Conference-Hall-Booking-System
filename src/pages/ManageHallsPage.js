// src/pages/ManageHallsPage.js
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, AlertTriangle } from 'lucide-react';
import { useHalls } from '../context/HallContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, getStatusBadge } from '../utils/helpers';
import { HALL_TYPES, FACILITIES_LIST, AVAILABILITY_STATUS } from '../data/sampleData';

const EMPTY_FORM = {
  hallName: '', hallType: 'Conference Hall', capacity: '', location: '',
  facilities: [], pricePerHour: '', image: '', availabilityStatus: 'Available', description: '',
};

const HallFormModal = ({ hall, onSave, onClose }) => {
  const [form, setForm] = useState(hall ? { ...hall } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })); };

  const toggleFacility = (f) => {
    const cur = form.facilities || [];
    set('facilities', cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]);
  };

  const validate = () => {
    const e = {};
    if (!form.hallName.trim()) e.hallName = 'Name required.';
    if (!form.capacity || form.capacity <= 0) e.capacity = 'Valid capacity required.';
    if (!form.location.trim()) e.location = 'Location required.';
    if (!form.pricePerHour || form.pricePerHour <= 0) e.pricePerHour = 'Valid price required.';
    if (!form.description.trim()) e.description = 'Description required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, capacity: Number(form.capacity), pricePerHour: Number(form.pricePerHour) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2 className="font-display font-bold text-slate-100">{hall ? 'Edit Hall' : 'Add New Hall'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1.5 hover:bg-slate-800 rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Hall Name *</label>
            <input className={`input ${errors.hallName ? 'border-red-500' : ''}`} value={form.hallName}
              onChange={(e) => set('hallName', e.target.value)} placeholder="Conference Hall A" />
            {errors.hallName && <p className="text-xs text-red-400 mt-1">{errors.hallName}</p>}
          </div>

          <div>
            <label className="label">Hall Type *</label>
            <select className="input" value={form.hallType} onChange={(e) => set('hallType', e.target.value)}>
              {HALL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Capacity *</label>
            <input type="number" className={`input ${errors.capacity ? 'border-red-500' : ''}`} value={form.capacity}
              onChange={(e) => set('capacity', e.target.value)} placeholder="50" min={1} />
            {errors.capacity && <p className="text-xs text-red-400 mt-1">{errors.capacity}</p>}
          </div>

          <div>
            <label className="label">Price Per Hour (₹) *</label>
            <input type="number" className={`input ${errors.pricePerHour ? 'border-red-500' : ''}`} value={form.pricePerHour}
              onChange={(e) => set('pricePerHour', e.target.value)} placeholder="1500" min={0} />
            {errors.pricePerHour && <p className="text-xs text-red-400 mt-1">{errors.pricePerHour}</p>}
          </div>

          <div className="col-span-2">
            <label className="label">Location *</label>
            <input className={`input ${errors.location ? 'border-red-500' : ''}`} value={form.location}
              onChange={(e) => set('location', e.target.value)} placeholder="Block A, Ground Floor" />
            {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
          </div>

          <div className="col-span-2">
            <label className="label">Image URL</label>
            <input className="input" value={form.image}
              onChange={(e) => set('image', e.target.value)} placeholder="https://images.unsplash.com/…" />
          </div>

          <div>
            <label className="label">Availability Status</label>
            <select className="input" value={form.availabilityStatus} onChange={(e) => set('availabilityStatus', e.target.value)}>
              {AVAILABILITY_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="label">Description *</label>
            <textarea className={`input resize-none ${errors.description ? 'border-red-500' : ''}`} rows={3}
              value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the hall, its features and ambience…" />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          <div className="col-span-2">
            <label className="label">Facilities</label>
            <div className="flex flex-wrap gap-2">
              {FACILITIES_LIST.map((f) => {
                const active = (form.facilities || []).includes(f);
                return (
                  <button key={f} type="button" onClick={() => toggleFacility(f)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${active
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-500/30'}`}>
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex-1">
            <Save size={15} /> {hall ? 'Update Hall' : 'Add Hall'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageHallsPage = () => {
  const { halls, addHall, updateHall, deleteHall, updateAvailability } = useHalls();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = halls.filter((h) =>
    h.hallName.toLowerCase().includes(search.toLowerCase()) ||
    h.hallType.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data) => {
    if (editingHall) {
      updateHall(editingHall.id, data);
      toast.success('Hall updated successfully.');
    } else {
      addHall(data);
      toast.success('New hall added successfully.');
    }
    setShowModal(false);
    setEditingHall(null);
  };

  const handleDelete = (id) => {
    if (deletingId === id) {
      deleteHall(id);
      toast.success('Hall deleted.');
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  const handleStatusChange = (id, status) => {
    updateAvailability(id, status);
    toast.success('Availability updated.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Manage Halls</h1>
          <p className="section-subtitle">{halls.length} conference spaces</p>
        </div>
        <button onClick={() => { setEditingHall(null); setShowModal(true); }} className="btn-primary text-sm">
          <Plus size={15} /> Add Hall
        </button>
      </div>

      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
        <input
          className="bg-transparent flex-1 outline-none text-sm text-slate-200 placeholder-slate-600"
          placeholder="Search halls…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              {['Hall', 'Type', 'Capacity', 'Price/Hr', 'Status', 'Availability', 'Actions'].map((h) => (
                <th key={h} className="table-header text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="table-cell text-center py-10 text-slate-600">No halls found</td></tr>
            ) : filtered.map((hall) => (
              <tr key={hall.id} className="bg-slate-900 hover:bg-slate-800/50 transition-colors">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <img src={hall.image} alt={hall.hallName}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&q=80'; }} />
                    <div>
                      <p className="font-semibold text-slate-200">{hall.hallName}</p>
                      <p className="text-xs text-slate-500">{hall.location}</p>
                    </div>
                  </div>
                </td>
                <td className="table-cell text-slate-400">{hall.hallType}</td>
                <td className="table-cell text-slate-400">{hall.capacity}</td>
                <td className="table-cell text-amber-400 font-medium">{formatCurrency(hall.pricePerHour)}</td>
                <td className="table-cell"><span className={getStatusBadge(hall.availabilityStatus)}>{hall.availabilityStatus}</span></td>
                <td className="table-cell">
                  <select
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none focus:border-amber-500"
                    value={hall.availabilityStatus}
                    onChange={(e) => handleStatusChange(hall.id, e.target.value)}
                  >
                    {AVAILABILITY_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingHall(hall); setShowModal(true); }}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all border border-slate-700">
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(hall.id)}
                      className={`p-1.5 rounded-lg border transition-all ${deletingId === hall.id
                        ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-slate-700'}`}
                      title={deletingId === hall.id ? 'Click again to confirm' : 'Delete'}
                    >
                      {deletingId === hall.id ? <AlertTriangle size={13} /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <HallFormModal
          hall={editingHall}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingHall(null); }}
        />
      )}
    </div>
  );
};

export default ManageHallsPage;

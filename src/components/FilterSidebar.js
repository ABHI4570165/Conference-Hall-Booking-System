// src/components/FilterSidebar.js
import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { HALL_TYPES, FACILITIES_LIST, AVAILABILITY_STATUS } from '../data/sampleData';

const FilterSidebar = ({ filters, onChange, onReset }) => {
  const handle = (key, value) => onChange({ ...filters, [key]: value });
  const toggleFacility = (f) => {
    const current = filters.facilities || [];
    const updated = current.includes(f)
      ? current.filter((x) => x !== f)
      : [...current, f];
    handle('facilities', updated);
  };

  const activeCount = [
    filters.hallType, filters.availability,
    filters.minCapacity, filters.maxPrice,
    (filters.facilities || []).length > 0 ? true : null,
  ].filter(Boolean).length;

  return (
    <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-amber-400" />
          <h3 className="font-display font-bold text-slate-100">Filters</h3>
          {activeCount > 0 && (
            <span className="badge bg-amber-500/15 text-amber-400 border-amber-500/20 text-[10px]">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors">
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-5">
        <label className="label">Search</label>
        <input
          className="input text-sm"
          placeholder="Hall name, type, location…"
          value={filters.search || ''}
          onChange={(e) => handle('search', e.target.value)}
        />
      </div>

      {/* Hall Type */}
      <div className="mb-5">
        <label className="label">Hall Type</label>
        <div className="space-y-1.5">
          {['', ...HALL_TYPES].map((t) => (
            <label key={t || 'all'} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${filters.hallType === t ? 'bg-amber-500 border-amber-500' : 'border-slate-600 group-hover:border-amber-500/50'}`}
                onClick={() => handle('hallType', t)}
              >
                {filters.hallType === t && <div className="w-2 h-2 rounded-sm bg-slate-900" />}
              </div>
              <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors select-none" onClick={() => handle('hallType', t)}>
                {t || 'All Types'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-5">
        <label className="label">Availability</label>
        <select
          className="input text-sm"
          value={filters.availability || ''}
          onChange={(e) => handle('availability', e.target.value)}
        >
          <option value="">All</option>
          {AVAILABILITY_STATUS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Capacity */}
      <div className="mb-5">
        <label className="label">Min. Capacity</label>
        <input
          type="number"
          className="input text-sm"
          placeholder="e.g. 50"
          value={filters.minCapacity || ''}
          onChange={(e) => handle('minCapacity', e.target.value ? Number(e.target.value) : '')}
          min={0}
        />
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <label className="label">Max Price / Hour</label>
        <input
          type="range"
          min={500}
          max={10000}
          step={500}
          value={filters.maxPrice || 10000}
          onChange={(e) => handle('maxPrice', Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>₹500</span>
          <span className="text-amber-400 font-semibold">₹{(filters.maxPrice || 10000).toLocaleString()}</span>
          <span>₹10,000</span>
        </div>
      </div>

      {/* Facilities */}
      <div>
        <label className="label">Facilities</label>
        <div className="flex flex-wrap gap-1.5">
          {FACILITIES_LIST.map((f) => {
            const active = (filters.facilities || []).includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFacility(f)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${active
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-500/30 hover:text-slate-200'}`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;

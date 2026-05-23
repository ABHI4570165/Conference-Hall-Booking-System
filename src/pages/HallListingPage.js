// src/pages/HallListingPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, LayoutGrid, List } from 'lucide-react';
import { useHalls } from '../context/HallContext';
import HallCard from '../components/HallCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

const DEFAULT_FILTERS = {
  search: '', hallType: '', availability: '',
  minCapacity: '', maxPrice: 10000, facilities: [],
};

const HallListingPage = () => {
  const { halls, loading } = useHalls();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [view, setView] = useState('grid');
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  // Apply URL query params on mount
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    setFilters((f) => ({ ...f, search, hallType: type }));
  }, [searchParams]);

  const filtered = useMemo(() => {
    return halls.filter((h) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !h.hallName.toLowerCase().includes(q) &&
          !h.hallType.toLowerCase().includes(q) &&
          !h.location.toLowerCase().includes(q)
        ) return false;
      }
      if (filters.hallType && h.hallType !== filters.hallType) return false;
      if (filters.availability && h.availabilityStatus !== filters.availability) return false;
      if (filters.minCapacity && h.capacity < Number(filters.minCapacity)) return false;
      if (filters.maxPrice && h.pricePerHour > filters.maxPrice) return false;
      if (filters.facilities?.length > 0) {
        const hasFacilities = filters.facilities.every((f) => h.facilities.includes(f));
        if (!hasFacilities) return false;
      }
      return true;
    });
  }, [halls, filters]);

  const resetFilters = () => setFilters({ ...DEFAULT_FILTERS });

  const activeFilterCount = [
    filters.search, filters.hallType, filters.availability,
    filters.minCapacity, filters.maxPrice < 10000 ? true : null,
    filters.facilities?.length > 0 ? true : null,
  ].filter(Boolean).length;

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading halls…" />
    </div>
  );

  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Page Header */}
        <div className="border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-slate-100">Conference Spaces</h1>
                <p className="text-sm text-slate-500 mt-1">
                  {filtered.length} of {halls.length} spaces available
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilterMobile(true)}
                  className="lg:hidden btn-secondary text-sm py-2"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="badge bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] ml-0.5">{activeFilterCount}</span>
                  )}
                </button>

                {/* View toggle */}
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1">
                  <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}>
                    <LayoutGrid size={15} />
                  </button>
                  <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}>
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filters display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {filters.search && (
                  <span className="badge bg-slate-700 text-slate-300 border-slate-600 gap-1.5">
                    "{filters.search}"
                    <button onClick={() => setFilters((f) => ({ ...f, search: '' }))}><X size={10} /></button>
                  </span>
                )}
                {filters.hallType && (
                  <span className="badge bg-slate-700 text-slate-300 border-slate-600 gap-1.5">
                    {filters.hallType}
                    <button onClick={() => setFilters((f) => ({ ...f, hallType: '' }))}><X size={10} /></button>
                  </span>
                )}
                {filters.availability && (
                  <span className="badge bg-slate-700 text-slate-300 border-slate-600 gap-1.5">
                    {filters.availability}
                    <button onClick={() => setFilters((f) => ({ ...f, availability: '' }))}><X size={10} /></button>
                  </span>
                )}
                <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex gap-6">
            {/* Filter sidebar (desktop) */}
            <div className="hidden lg:block w-72 shrink-0">
              <FilterSidebar filters={filters} onChange={setFilters} onReset={resetFilters} />
            </div>

            {/* Hall grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
                    <Search size={24} className="text-slate-600" />
                  </div>
                  <h3 className="font-display font-bold text-slate-300 mb-2">No halls found</h3>
                  <p className="text-slate-500 text-sm max-w-sm mb-5">
                    No conference spaces match your current filters. Try adjusting or resetting.
                  </p>
                  <button onClick={resetFilters} className="btn-secondary text-sm">
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={view === 'grid'
                  ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'}>
                  {filtered.map((hall) => (
                    <HallCard key={hall.id} hall={hall} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilterMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-80 max-w-[90vw] bg-slate-950 border-r border-slate-800 overflow-y-auto p-4 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-slate-100">Filters</h3>
              <button onClick={() => setShowFilterMobile(false)} className="text-slate-500 hover:text-slate-300">
                <X size={18} />
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={setFilters} onReset={resetFilters} />
            <button onClick={() => setShowFilterMobile(false)} className="btn-primary w-full mt-4">
              Show {filtered.length} Results
            </button>
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setShowFilterMobile(false)} />
        </div>
      )}
    </div>
  );
};

export default HallListingPage;

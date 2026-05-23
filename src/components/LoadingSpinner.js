// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-slate-700 border-t-amber-500`} />
      {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );
};

export const FullPageSpinner = () => (
  <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-amber-500" />
      <p className="text-slate-500 font-medium font-display">Loading…</p>
    </div>
  </div>
);

export default LoadingSpinner;

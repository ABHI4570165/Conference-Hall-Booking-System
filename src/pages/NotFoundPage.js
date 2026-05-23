// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
    {/* Background effect */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
    </div>

    <div className="relative">
      {/* Big 404 */}
      <p className="font-display font-extrabold text-[120px] sm:text-[180px] leading-none text-transparent bg-clip-text bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 select-none mb-0">
        404
      </p>

      <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto -mt-8 mb-6">
        <Building2 size={28} className="text-amber-400" />
      </div>

      <h1 className="font-display font-bold text-2xl text-slate-100 mb-2">
        Page Not Found
      </h1>
      <p className="text-slate-500 max-w-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => window.history.back()} className="btn-secondary">
          <ArrowLeft size={15} /> Go Back
        </button>
        <Link to="/" className="btn-primary">
          <Home size={15} /> Back to Home
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;

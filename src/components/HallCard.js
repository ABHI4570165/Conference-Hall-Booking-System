// src/components/HallCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { formatCurrency, getStatusBadge, getFacilityIcon, truncate } from '../utils/helpers';

const HallCard = ({ hall }) => {
  const badge = getStatusBadge(hall.availabilityStatus);

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={hall.image}
          alt={hall.hallName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={badge}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {hall.availabilityStatus}
          </span>
        </div>

        {/* Hall type badge */}
        <div className="absolute top-3 left-3">
          <span className="badge bg-slate-900/80 backdrop-blur-sm text-slate-300 border border-slate-700/50 text-[11px]">
            {hall.hallType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-bold text-lg text-slate-100 group-hover:text-amber-400 transition-colors leading-tight">
            {hall.hallName}
          </h3>
        </div>

        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          {truncate(hall.description, 80)}
        </p>

        {/* Info Row */}
        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-slate-500" /> {hall.location.split(',')[0]}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-slate-500" /> {hall.capacity}
          </span>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hall.facilities.slice(0, 4).map((f) => (
            <span key={f} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              {getFacilityIcon(f)} {f}
            </span>
          ))}
          {hall.facilities.length > 4 && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-500 border border-slate-700">
              +{hall.facilities.length - 4}
            </span>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div>
            <p className="text-lg font-bold font-display text-amber-400">
              {formatCurrency(hall.pricePerHour)}
            </p>
            <p className="text-xs text-slate-600">per hour</p>
          </div>
          <Link
            to={`/halls/${hall.id}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors group/link"
          >
            View Details
            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HallCard;

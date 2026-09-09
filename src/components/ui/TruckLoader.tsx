'use client';

import React from 'react';

interface Props {
  message?: string;
  subMessage?: string;
}

export default function TruckLoader({
  message = 'Loading Plotted Development...',
  subMessage = 'Fetching 3D layout, plot boundaries & real-time inventory'
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      {/* Truck Animation requested by user */}
      <div className="truck-loader">
        <div className="truckWrapper">
          {/* Lamp post on side */}
          <div className="lampPost">
            <svg viewBox="0 0 20 80" className="w-5 h-20 text-amber-300">
              <path d="M10 80 L10 15 Q10 5 18 5" fill="none" stroke="#64748b" strokeWidth="2" />
              <circle cx="18" cy="7" r="3" fill="#fbbf24" />
              <polygon points="15,10 21,10 24,25 12,25" fill="#fef08a" opacity="0.3" />
            </svg>
          </div>

          {/* Truck Body */}
          <div className="truckBody">
            <svg viewBox="0 0 130 50" className="w-full h-auto drop-shadow-md">
              {/* Truck cabin */}
              <path d="M70 12 L105 12 L120 28 L120 44 L70 44 Z" fill="#10b981" />
              {/* Window */}
              <path d="M85 16 L104 16 L114 28 L85 28 Z" fill="#38bdf8" opacity="0.85" />
              {/* Cargo Container */}
              <rect x="5" y="5" width="62" height="39" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              <line x1="20" y1="5" x2="20" y2="44" stroke="#1e293b" strokeWidth="2" />
              <line x1="36" y1="5" x2="36" y2="44" stroke="#1e293b" strokeWidth="2" />
              <line x1="52" y1="5" x2="52" y2="44" stroke="#1e293b" strokeWidth="2" />
              {/* Headlight */}
              <circle cx="120" cy="38" r="2.5" fill="#fef08a" />
              {/* Front bumper */}
              <rect x="118" y="40" width="6" height="4" rx="1" fill="#94a3b8" />
            </svg>
          </div>

          {/* Truck Tires */}
          <div className="truckTires">
            {/* Rear wheel */}
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="#94a3b8" />
            </svg>
            {/* Front wheel */}
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="#94a3b8" />
            </svg>
          </div>

          {/* Moving Road */}
          <div className="road" />
        </div>
      </div>

      {/* Loading message */}
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white tracking-wide uppercase">{message}</h4>
        <p className="text-xs text-slate-400 max-w-xs">{subMessage}</p>
      </div>
    </div>
  );
}

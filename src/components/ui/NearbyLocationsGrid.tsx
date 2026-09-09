'use client';

import React from 'react';
import {
  Train, Car, GraduationCap, Cross, Plane, Briefcase, ShoppingBag, Landmark as LandmarkIcon, Trophy
} from 'lucide-react';
import { PROJECT_SPECS } from '@/data/landmarks';

export default function NearbyLocationsGrid({ className = '' }: { className?: string }) {
  const locations = [
    {
      name: 'SH-57 State Highway',
      time: '2 mins (500 m)',
      icon: <Car className="w-5 h-5 text-white" />
    },
    {
      name: 'Sakrayapatna Town',
      time: '3 mins (1.2 km)',
      icon: <ShoppingBag className="w-5 h-5 text-white" />
    },
    {
      name: 'Kadur Junction Station',
      time: '15 mins (16 km)',
      icon: <Train className="w-5 h-5 text-white" />
    },
    {
      name: 'Community Hospital',
      time: '5 mins (2.5 km)',
      icon: <Cross className="w-5 h-5 text-white" />
    },
    {
      name: 'Morarji Desai School',
      time: '4 mins (2.0 km)',
      icon: <GraduationCap className="w-5 h-5 text-white" />
    },
    {
      name: 'Historic Ayyankere Lake',
      time: '12 mins (10 km)',
      icon: <Trophy className="w-5 h-5 text-white" />
    },
    {
      name: 'Chikkamagaluru City',
      time: '25 mins (28 km)',
      icon: <Briefcase className="w-5 h-5 text-white" />
    },
    {
      name: 'Birur Main Junction',
      time: '20 mins (21 km)',
      icon: <LandmarkIcon className="w-5 h-5 text-white" />
    },
    {
      name: 'Kadur Taluk Hub',
      time: '14 mins (15 km)',
      icon: <Car className="w-5 h-5 text-white" />
    }
  ];

  return (
    <div className={`locations-widget-container ${className}`}>
      {/* Background Gradient Aura */}
      <div className="locations-widget-back" />

      {/* Grid Container with Centered Title Overlay */}
      <div className="relative flex items-center justify-center">
        {/* 3x3 Expanding Grid */}
        <div className="locations-widget-main" title="Hover to inspect nearby landmarks">
          {locations.map((loc, idx) => (
            <a
              key={idx}
              href={PROJECT_SPECS.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="loc-card group"
              title={`${loc.name} • ${loc.time}`}
            >
              <div className="loc-icon">
                {loc.icon}
              </div>
              <span className="loc-tooltip">
                {loc.name}: {loc.time}
              </span>
            </a>
          ))}
        </div>

        {/* Centered Typography: Always dead center over middle tile */}
        <span className="center-text">NEARBY</span>
      </div>
    </div>
  );
}

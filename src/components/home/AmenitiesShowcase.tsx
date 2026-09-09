'use client';

import React from 'react';
import Link from 'next/link';
import { AMENITIES_DATA } from '@/data/amenities';
import {
  ShieldCheck, Zap, Droplets, Trees, Building2, Trophy, Leaf, Compass, ArrowRight, Check
} from 'lucide-react';

export default function AmenitiesShowcase() {
  const getIcon = (id: string) => {
    switch (id) {
      case 'roads': return <Compass className="w-5 h-5 text-amber-400" />;
      case 'underground': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'security': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'water': return <Droplets className="w-5 h-5 text-sky-400" />;
      case 'park': return <Trees className="w-5 h-5 text-emerald-400" />;
      case 'clubhouse': return <Building2 className="w-5 h-5 text-purple-400" />;
      case 'sports': return <Trophy className="w-5 h-5 text-orange-400" />;
      case 'eco': return <Leaf className="w-5 h-5 text-teal-400" />;
      default: return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section className="py-20 bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              World-Class Infrastructure
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated Layout Amenities & Utilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Engineered with sanctioned modern planning — concealed underground conduits, 9.0-meter wide asphalt avenues, central Civic Amenity zone, and a 48m botanical park buffer.
            </p>
          </div>

          <Link
            href="/amenities"
            className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 self-start md:self-end"
          >
            <span>Explore All Infrastructure Specs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Amenities Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AMENITIES_DATA.map(amenity => (
            <div
              key={amenity.id}
              className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform">
                    {getIcon(amenity.id)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full border border-slate-800">
                    {amenity.category}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base tracking-tight group-hover:text-emerald-300 transition-colors">
                  {amenity.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {amenity.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>{amenity.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

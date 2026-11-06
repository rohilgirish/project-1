'use client';

import React from 'react';
import Link from 'next/link';
import { AMENITIES_DATA } from '@/data/amenities';
import {
  Compass, Zap, ShieldCheck, Droplets, Trees, Building2, Trophy, Leaf,
  CheckCircle2, ArrowRight, Download, Sparkles
} from 'lucide-react';

export default function AmenitiesPage() {
  const getIcon = (id: string) => {
    switch (id) {
      case 'roads': return <Compass className="w-6 h-6 text-amber-400" />;
      case 'ca-site': return <Building2 className="w-6 h-6 text-purple-400" />;
      case 'park': return <Trees className="w-6 h-6 text-emerald-400" />;
      case 'underground': return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'water': return <Droplets className="w-6 h-6 text-sky-400" />;
      case 'security': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'highway': return <Compass className="w-6 h-6 text-teal-400" />;
      case 'eco': return <Leaf className="w-6 h-6 text-teal-400" />;
      default: return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Grama Panchayat & DC Converted Infrastructure
              </span>
              <span className="text-xs text-slate-500">• Ready for Immediate Construction</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated Amenities & Layout Specifications
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Engineered beyond conventional plotted layouts. Every avenue features concealed underground conduits, engineered rainwater drainage, and resort-style lifestyle facilities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/plots"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Inspect on 3D Masterplan</span>
            </Link>
          </div>
        </div>

        {/* Detailed Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {AMENITIES_DATA.map(amenity => (
            <div
              key={amenity.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                    {getIcon(amenity.id)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                    {amenity.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{amenity.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                    {amenity.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Standard Spec:</span>
                <span className="text-emerald-400 font-semibold bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  {amenity.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Infrastructure Checklist */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Civil & Architectural Engineering Specifications</span>
            </h2>
            <p className="text-xs text-slate-400">Strict adherence to DTCP & Gram Panchayat layout execution norms</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Concrete Curbs & Pavers</span>
                <span className="text-slate-400 text-[11px]">Interlocking concrete pavers on all pedestrian footpaths.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Underground Box Drains</span>
                <span className="text-slate-400 text-[11px]">Heavy storm water drains built to prevent monsoon flooding.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">LED Solar Street Lamps</span>
                <span className="text-slate-400 text-[11px]">Smart twilight sensor LED poles placed at regular 25ft intervals.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Solar Perimeter Fencing</span>
                <span className="text-slate-400 text-[11px]">7ft solid boundary wall topped with non-lethal solar security pulse.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Underground Sewage Lines</span>
                <span className="text-slate-400 text-[11px]">Direct hookups connected to computerized on-site STP plant.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Avenue Landscaping</span>
                <span className="text-slate-400 text-[11px]">Bougainvillea, Tabebuia Rosea, and Royal Palm tree plantations.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import GradientTiltCard from '@/components/ui/GradientTiltCard';
import NearbyLocationsGrid from '@/components/ui/NearbyLocationsGrid';
import { Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { getFeaturedAvailablePlots, getPlotCounts } from '@/data/plots';

export default function FeaturedDealsSection() {
  const featuredPlots = getFeaturedAvailablePlots(3);
  const counts = getPlotCounts();

  return (
    <section className="py-20 bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Live Allocation • {counts.available} Plots Open
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Available Villa Plots
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Verified available plots ready for immediate token allocation. Review dimensions, Vastu facings, and clear title documentation.
            </p>
          </div>

          <Link
            href="/plots"
            className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 self-start md:self-end"
          >
            <span>Explore All {counts.total} Plots ({counts.available} Available)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3D Tilting Gradient Cards Grid (Dynamically rendered from real available plots) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {featuredPlots.map((plot) => (
            <GradientTiltCard
              key={plot.id}
              title={`${plot.number} • ${plot.isCorner ? 'Corner Villa' : plot.isParkFacing ? 'Park-Facing Villa' : `${plot.facing} Villa`}`}
              subtitle={`${plot.size} ft (${plot.area} sq.ft)`}
              description={plot.description || 'DC Converted & Grama Panchayat approved residential villa plot in Anurag Enclave.'}
              badge={`Available • ₹${(plot.price / 100000).toFixed(1)} Lakhs`}
              linkText={`Inspect ${plot.number} Details`}
              linkHref="/plots"
            />
          ))}
        </div>

        {/* Connectivity & Nearby Matrix Teaser */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center lg:text-left max-w-lg">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full text-xs font-bold border border-sky-500/20">
              <Compass className="w-3.5 h-3.5" />
              <span>Chikkamagaluru & Kadur Highway Connectivity</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Rapid Transit & Key Destinations
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hover over the 3×3 matrix to explore travel times to SH-57 State Highway, Sakrayapatna town, Kadur Junction, and Chikkamagaluru city center.
            </p>
            <div className="pt-2">
              <Link
                href="/location"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <span>View Full Map & Commute Times</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </Link>
            </div>
          </div>

          <div className="shrink-0">
            <NearbyLocationsGrid />
          </div>
        </div>
      </div>
    </section>
  );
}

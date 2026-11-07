'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import StatusOverviewCards from '@/components/ui/StatusOverviewCards';
import { getPlotCounts } from '@/data/plots';

export default function StatsCounter() {
  const counts = getPlotCounts();

  return (
    <section className="py-14 bg-slate-900/90 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <TrendingUp className="w-4 h-4" />
              <span>Anurag Enclave Live Inventory • Sakrayapatna</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              2-Acre Plotted Layout Sales Status
            </h2>
            <p className="text-xs text-slate-400 max-w-md">
              Located at Sakrayapatna village, Kadur Taluk, Chikkamagaluru District. Green indicates {counts.available} available plots, Blue for {counts.reserved} booked, and Red for {counts.sold} sold out of {counts.total} total sanctioned plots.
            </p>
          </div>

          <StatusOverviewCards
            availableCount={counts.available}
            reservedCount={counts.reserved}
            soldCount={counts.sold}
          />
        </div>
      </div>
    </section>
  );
}

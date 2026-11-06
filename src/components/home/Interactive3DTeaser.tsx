'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { PLOTS_DATA } from '@/data/plots';
import PlotDetailModal from '@/components/plots/PlotDetailModal';
import { useShortlist } from '@/lib/useShortlist';
import { Plot } from '@/types';
import { Compass, Maximize2, Sparkles, ArrowRight, Layers, Eye } from 'lucide-react';

const Interactive3DLayout = dynamic(
  () => import('@/components/plots/Interactive3DLayout'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[450px] w-full rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
          <Layers className="w-6 h-6" />
        </div>
        <div className="text-sm font-bold text-white">Loading Masterplan View...</div>
        <div className="text-xs text-slate-400">Rendering interactive 3D layout canvas</div>
      </div>
    ),
  }
);

export default function Interactive3DTeaser() {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const { isShortlisted, togglePlot } = useShortlist();

  const dummyFilters = {
    search: '',
    size: 'all',
    facing: 'all',
    status: 'all',
    minPrice: 0,
    maxPrice: 30000000,
    cornerOnly: false,
    parkFacingOnly: false,
    mainBoulevardOnly: false
  };

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Compass className="w-3.5 h-3.5" />
              <span>Next-Gen WebGL Layout Map</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore the 3D Masterplan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Orbit 360°, inspect individual plot dimensions, observe sun trajectories, and click any plot to unlock detailed boundary views and price breakdowns.
            </p>
          </div>

          <Link
            href="/plots"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 self-start md:self-end"
          >
            <span>Open Dedicated 3D Explorer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3D Canvas Box */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <Interactive3DLayout
            plots={PLOTS_DATA}
            selectedPlot={selectedPlot}
            onSelectPlot={plot => setSelectedPlot(plot)}
            filters={dummyFilters}
          />

          {/* Quick Action Overlay */}
          <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-4 z-20 pointer-events-auto">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Click any plot mesh to view specs</span>
              </div>
              <p className="text-[11px] text-slate-400">Green = Available • Blue = Booked • Red = Sold</p>
            </div>

            <Link
              href="/plots"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline shrink-0"
            >
              Full Screen ➔
            </Link>
          </div>
        </div>

        {/* Detail Modal if clicked */}
        {selectedPlot && (
          <PlotDetailModal
            plot={selectedPlot}
            onClose={() => setSelectedPlot(null)}
            isShortlisted={isShortlisted(selectedPlot.id)}
            onToggleShortlist={togglePlot}
          />
        )}
      </div>
    </section>
  );
}

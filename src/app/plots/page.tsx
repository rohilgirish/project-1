'use client';

import React, { useState, useMemo } from 'react';
import { PLOTS_DATA } from '@/data/plots';
import { Plot, FilterState } from '@/types';
import Interactive3DLayout from '@/components/plots/Interactive3DLayout';
import PlotFilters from '@/components/plots/PlotFilters';
import PlotDetailModal from '@/components/plots/PlotDetailModal';
import PlotCard from '@/components/plots/PlotCard';
import PlotCompareModal from '@/components/plots/PlotCompareModal';
import SearchPlotLoader from '@/components/ui/SearchPlotLoader';
import { useShortlist } from '@/lib/useShortlist';
import {
  Layers, Grid3X3, ArrowUpDown, Sparkles, SlidersHorizontal, Scale, Download, Search
} from 'lucide-react';

export default function PlotExplorerPage() {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d');
  const [comparePlots, setComparePlots] = useState<Plot[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { isShortlisted, togglePlot } = useShortlist();

  const initialFilters: FilterState = {
    search: '',
    size: 'all',
    facing: 'all',
    status: 'all',
    minPrice: 1500000,
    maxPrice: 2000000,
    cornerOnly: false,
    parkFacingOnly: false,
    mainBoulevardOnly: false
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Filtered plots
  const filteredPlots = useMemo(() => {
    return PLOTS_DATA.filter(p => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.number.toLowerCase().includes(q) && !p.size.toLowerCase().includes(q)) return false;
      }
      if (filters.size !== 'all' && p.size !== filters.size) return false;
      if (filters.facing !== 'all' && !p.facing.toLowerCase().includes(filters.facing.toLowerCase())) return false;
      if (filters.status !== 'all' && p.status !== filters.status) return false;
      if (filters.cornerOnly && !p.isCorner) return false;
      if (filters.parkFacingOnly && !p.isParkFacing) return false;
      if (filters.mainBoulevardOnly && !p.isMainBoulevard) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      return true;
    });
  }, [filters]);

  // Compare handlers
  const handleToggleCompare = (plot: Plot) => {
    if (comparePlots.some(p => p.id === plot.id)) {
      setComparePlots(prev => prev.filter(p => p.id !== plot.id));
    } else {
      if (comparePlots.length >= 3) {
        alert('You can compare up to 3 plots at a time.');
        return;
      }
      setComparePlots(prev => [...prev, plot]);
    }
  };

  const availableCount = PLOTS_DATA.filter(p => p.status === 'available').length;
  const reservedCount = PLOTS_DATA.filter(p => p.status === 'reserved').length;
  const soldCount = PLOTS_DATA.filter(p => p.status === 'sold').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-28">
      {/* Top Banner & KPI Counters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Interactive WebGL 3D Experience
              </span>
              <span className="text-xs text-slate-500">• 2.0 Acres Gated Sanctioned Layout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Masterplan & 3D Plot Explorer
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Inspect 39 empty residential villa plots (30×40 ft / 9.14m × 12.19m) bordering 9.0m asphalt avenues, Civic Amenity site, and 48m botanical park zone. Orbit, zoom, and click any plot for instant specs and pricing.
            </p>
          </div>

          {/* Real-time Sales KPI Counters */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 min-w-[90px] text-center shadow-lg">
              <span className="text-2xl font-extrabold text-[#22c55e] block">{availableCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">Available</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 min-w-[90px] text-center shadow-lg">
              <span className="text-2xl font-extrabold text-[#3b82f6] block">{reservedCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-blue-300 font-semibold">Booked</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 min-w-[90px] text-center shadow-lg">
              <span className="text-2xl font-extrabold text-[#f43f5e] block">{soldCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-rose-300 font-semibold">Sold Out</span>
            </div>
          </div>
        </div>

        {/* View Switcher & Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === '3d'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>3D Site Plan</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Grid Catalog ({filteredPlots.length})</span>
              </button>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filters</span>
            </button>
          </div>

          {/* Compare bar pill */}
          <div className="flex items-center gap-2">
            {comparePlots.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs shadow-lg shadow-sky-500/20 transition-all animate-bounce"
              >
                <Scale className="w-4 h-4" />
                <span>Compare ({comparePlots.length}/3 Plots)</span>
              </button>
            )}

            <a
              href="/images/layout-plan.png"
              download="anurag-enclave-masterplan.png"
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Download CAD Masterplan</span>
            </a>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
          {/* Filter Sidebar (Desktop: 3 cols) */}
          <div className={`lg:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-28 space-y-4">
              <PlotFilters
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(initialFilters)}
                totalMatches={filteredPlots.length}
              />

              {/* Active Search Animation Feedback */}
              {filters.search && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                  <SearchPlotLoader keyword="SEARCHING" />
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Finding plots matching &quot;{filters.search}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Viewer / Grid View (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {viewMode === '3d' ? (
              <div className="space-y-4">
                <Interactive3DLayout
                  plots={PLOTS_DATA}
                  selectedPlot={selectedPlot}
                  onSelectPlot={plot => setSelectedPlot(plot)}
                  filters={filters}
                />

                {/* Sub-grid of currently visible matching plots */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Filtered Plots Quick Roster ({filteredPlots.length})</span>
                    </h3>
                    <button
                      onClick={() => setViewMode('grid')}
                      className="text-xs text-emerald-400 hover:underline font-medium cursor-pointer"
                    >
                      View All in Full Grid ➔
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {filteredPlots.slice(0, 6).map(plot => (
                      <PlotCard
                        key={plot.id}
                        plot={plot}
                        onSelect={setSelectedPlot}
                        isShortlisted={isShortlisted(plot.id)}
                        onToggleShortlist={togglePlot}
                        onAddToCompare={handleToggleCompare}
                        isComparing={comparePlots.some(p => p.id === plot.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Full Grid Catalog View */
              <div>
                <div className="flex items-center justify-between mb-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">
                    Showing <strong className="text-white">{filteredPlots.length}</strong> plots matching your criteria
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Sorted by Plot ID</span>
                  </div>
                </div>

                {filteredPlots.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
                    <SearchPlotLoader keyword="NO MATCH" />
                    <p className="text-lg font-bold text-white">No plots found matching current filters</p>
                    <p className="text-xs text-slate-400">Try resetting filters or adjusting budget & dimension sliders.</p>
                    <button
                      onClick={() => setFilters(initialFilters)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredPlots.map(plot => (
                      <PlotCard
                        key={plot.id}
                        plot={plot}
                        onSelect={setSelectedPlot}
                        isShortlisted={isShortlisted(plot.id)}
                        onToggleShortlist={togglePlot}
                        onAddToCompare={handleToggleCompare}
                        isComparing={comparePlots.some(p => p.id === plot.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plot Detail Modal */}
      {selectedPlot && (
        <PlotDetailModal
          plot={selectedPlot}
          onClose={() => setSelectedPlot(null)}
          isShortlisted={isShortlisted(selectedPlot.id)}
          onToggleShortlist={togglePlot}
          onAddToCompare={handleToggleCompare}
          isComparing={comparePlots.some(p => p.id === selectedPlot.id)}
        />
      )}

      {/* Compare Side-by-Side Modal */}
      {showCompareModal && (
        <PlotCompareModal
          comparePlots={comparePlots}
          onRemove={id => setComparePlots(prev => prev.filter(p => p.id !== id))}
          onClose={() => setShowCompareModal(false)}
          onSelectPlot={plot => {
            setShowCompareModal(false);
            setSelectedPlot(plot);
          }}
        />
      )}
    </div>
  );
}

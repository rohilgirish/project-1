'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PLOTS_DATA } from '@/data/plots';
import { useShortlist } from '@/lib/useShortlist';
import PlotCard from '@/components/plots/PlotCard';
import PlotDetailModal from '@/components/plots/PlotDetailModal';
import PlotCompareModal from '@/components/plots/PlotCompareModal';
import { Plot } from '@/types';
import { Heart, Share2, Trash2, ArrowRight, Compass, Scale, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ShortlistPage() {
  const { shortlist, isShortlisted, togglePlot, clearShortlist, count } = useShortlist();
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [comparePlots, setComparePlots] = useState<Plot[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const shortlistedPlots = PLOTS_DATA.filter(p => shortlist.includes(p.id));

  const handleShareShortlist = () => {
    const plotNumbers = shortlistedPlots.map(p => p.number).join(', ');
    const text = `Check out my shortlisted plots at Anurag Enclave (Sakrayapatna, Chikkamagaluru): ${plotNumbers}`;
    if (navigator.share) {
      navigator.share({ title: 'My Shortlisted Plots', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${text} - ${window.location.href}`);
      toast.success('Shortlist Link Copied', {
        description: 'Link copied to clipboard. Ready to share with family or your architect.',
        duration: 3500,
      });
    }
  };

  const handleToggleCompare = (plot: Plot) => {
    if (comparePlots.some(p => p.id === plot.id)) {
      setComparePlots(prev => prev.filter(p => p.id !== plot.id));
      toast.info(`Removed ${plot.number} from comparison`);
    } else {
      if (comparePlots.length >= 3) {
        toast.warning('Comparison Limit Reached', {
          description: 'You can compare up to 3 plots at a time.',
          duration: 3500,
        });
        return;
      }
      setComparePlots(prev => [...prev, plot]);
      toast.success(`Added ${plot.number} to Comparison`, {
        description: `${plot.width}×${plot.depth} ft, ${plot.facing} facing.`,
        duration: 3000,
      });
    }
  };

  const handleClearShortlist = () => {
    clearShortlist();
    toast.info('Shortlist Cleared', {
      description: 'All saved plots have been removed.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Heart className="w-4 h-4 fill-rose-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Saved Properties
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              My Saved Plots ({count})
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Review your favorite plot configurations, compare specifications, or share with your family.
            </p>
          </div>

          {count > 0 && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleShareShortlist}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95 duration-150 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Shortlist</span>
              </button>

              <button
                onClick={handleClearShortlist}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95 duration-150 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Shortlist Content */}
        {shortlistedPlots.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-16 text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No Plots Shortlisted Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse the 3D Masterplan or Plot Catalog and click the heart icon to bookmark plots for quick comparison and joint family review.
            </p>
            <Link
              href="/plots"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              <Compass className="w-4 h-4" />
              <span>Explore 3D Masterplan</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                You have saved <strong>{shortlistedPlots.length}</strong> plot(s) in this browser session.
              </span>

              {comparePlots.length > 0 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs transition-all animate-bounce"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compare ({comparePlots.length}/3)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {shortlistedPlots.map(plot => (
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
        )}
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

      {/* Compare Modal */}
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

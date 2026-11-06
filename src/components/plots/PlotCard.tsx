'use client';

import React from 'react';
import { Plot } from '@/types';
import { formatINR, formatNumberINR, getStatusColor, getWhatsAppLink } from '@/lib/utils';
import { Heart, Compass, Ruler, Maximize2, MessageSquare, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  plot: Plot;
  onSelect: (plot: Plot) => void;
  isShortlisted: boolean;
  onToggleShortlist: (id: number) => void;
  onAddToCompare?: (plot: Plot) => void;
  isComparing?: boolean;
}

export default function PlotCard({
  plot,
  onSelect,
  isShortlisted,
  onToggleShortlist,
  onAddToCompare,
  isComparing
}: Props) {
  const statusInfo = getStatusColor(plot.status);
  const whatsAppUrl = getWhatsAppLink(plot.number, plot.size, plot.facing);

  return (
    <div
      onClick={() => onSelect(plot)}
      className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-200 active:scale-[0.99] flex flex-col cursor-pointer"
    >
      {/* Card Image Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={plot.images[0]}
          alt={plot.number}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border} backdrop-blur-md`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Shortlist Heart Button (Emil Kowalski tactile feedback) */}
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleShortlist(plot.id);
            if (!isShortlisted) {
              toast.success(`Saved ${plot.number} to Shortlist`, {
                description: `${plot.width}×${plot.depth} ft (${plot.area} sq.ft), ${plot.facing} facing.`,
                duration: 2500,
              });
            } else {
              toast.info(`Removed ${plot.number} from Shortlist`);
            }
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all active:scale-75 duration-150 cursor-pointer ${
            isShortlisted
              ? 'bg-rose-500/30 text-rose-400 border border-rose-500/50 shadow-md shadow-rose-500/20'
              : 'bg-black/50 text-slate-300 hover:text-white border border-white/10 hover:border-white/30'
          }`}
          title={isShortlisted ? 'Remove from Shortlist' : 'Save Plot'}
        >
          <Heart className={`w-3.5 h-3.5 transition-transform ${isShortlisted ? 'fill-rose-500 scale-110' : ''}`} />
        </button>

        {/* Plot Number Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <h4 className="text-lg font-bold text-white tracking-wide drop-shadow-md">{plot.number}</h4>
          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-lg backdrop-blur-md">
            {plot.facing} Facing
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Dimensions</span>
            <span className="font-semibold text-white">{plot.width} × {plot.depth} ft</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Plot Area</span>
            <span className="font-semibold text-white">{plot.area.toLocaleString()} sq.ft</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 min-h-[22px]">
          {(plot.facing === 'East' || plot.facing === 'North') && (
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Vastu Prime
            </span>
          )}
          {plot.isCorner && (
            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/20">
              Corner
            </span>
          )}
          {plot.badges.slice(0, 1).map((b, i) => (
            <span
              key={i}
              className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
            >
              {b}
            </span>
          ))}
        </div>

        {/* Price & Action Bar */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
            <div className="text-base font-extrabold text-amber-400">{formatINR(plot.price)}</div>
          </div>

          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => onSelect(plot)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Plot } from '@/types';
import { formatINR, formatNumberINR, getStatusColor, getWhatsAppLink } from '@/lib/utils';
import { X, Check, Minus, MessageSquare, ArrowRight } from 'lucide-react';

interface Props {
  comparePlots: Plot[];
  onRemove: (plotId: number) => void;
  onClose: () => void;
  onSelectPlot: (plot: Plot) => void;
}

export default function PlotCompareModal({ comparePlots, onRemove, onClose, onSelectPlot }: Props) {
  if (comparePlots.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div>
            <h3 className="text-xl font-bold text-white">Compare Plots Side-by-Side</h3>
            <p className="text-xs text-slate-400">Evaluating specifications, pricing, and orientations</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-44">Parameters</th>
                {comparePlots.map(plot => (
                  <th key={plot.id} className="p-3 text-center min-w-[200px]">
                    <div className="relative inline-block text-left w-full bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <button
                        onClick={() => onRemove(plot.id)}
                        className="absolute top-2 right-2 p-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remove plot"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-lg text-white block">{plot.number}</span>
                      <span className="text-xs text-amber-400 font-bold block mt-0.5">{formatINR(plot.price)}</span>
                      <span
                        className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          getStatusColor(plot.status).bg
                        } ${getStatusColor(plot.status).text}`}
                      >
                        {plot.status.toUpperCase()}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              <tr>
                <td className="p-3 font-medium text-slate-400">Dimensions</td>
                {comparePlots.map(p => (
                  <td key={p.id} className="p-3 text-center font-semibold text-white">
                    {p.width} × {p.depth} ft ({p.size})
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-400">Plot Area</td>
                {comparePlots.map(p => (
                  <td key={p.id} className="p-3 text-center font-semibold text-emerald-400">
                    {p.area.toLocaleString()} sq.ft
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-400">Facing Direction</td>
                {comparePlots.map(p => (
                  <td key={p.id} className="p-3 text-center font-semibold text-white">
                    {p.facing} Facing
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-400">Rate per Sq.Ft</td>
                {comparePlots.map(p => (
                  <td key={p.id} className="p-3 text-center font-semibold text-white">
                    ₹{formatNumberINR(p.pricePerSqft)} / sq.ft
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-400">Corner Plot</td>
                {comparePlots.map(p => (
                  <td key={p.id} className="p-3 text-center">
                    {p.isCorner ? (
                      <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Yes (Dual Road)
                      </span>
                    ) : (
                      <span className="text-slate-500">Standard</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-400">Park Facing</td>
                {comparePlots.map(p => (
                  <td key={p.id} className="p-3 text-center">
                    {p.isParkFacing ? (
                      <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Yes (Zen Park)
                      </span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                ))}
              </tr>


              <tr>
                <td className="p-3 font-medium text-slate-400">Action</td>
                {comparePlots.map(p => (
                  <td key={p.id} className="p-3 text-center">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPlot(p);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md inline-flex items-center gap-1.5"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

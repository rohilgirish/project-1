'use client';

import React from 'react';
import { FilterState } from '@/types';
import { formatINR } from '@/lib/utils';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalMatches: number;
}

export default function PlotFilters({ filters, onChange, onReset, totalMatches }: Props) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-800 px-2.5 py-0.5 rounded-full font-medium text-emerald-400">
            {totalMatches} matching
          </span>
          <button
            onClick={onReset}
            className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search Plot # (e.g. 42, Plot 15)..."
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Plot Size */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Plot Dimension
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'All Dimensions', value: 'all' },
            { label: '30×40 ft (1,200 sq.ft)', value: '30x40' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, size: opt.value })}
              className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all ${
                filters.size === opt.value
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facing Direction */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Orientation / Facing
        </label>
        <div className="flex flex-wrap gap-1.5">
          {['all', 'North', 'East', 'South', 'West'].map(facing => (
            <button
              key={facing}
              onClick={() => onChange({ ...filters, facing })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.facing === facing
                  ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {facing === 'all' ? 'All Facings' : `${facing}`}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Status with User's Color Code: Green, Blue, Red */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Availability Status
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'All Statuses', value: 'all', dot: 'bg-slate-400' },
            { label: 'Available (Green)', value: 'available', dot: 'bg-[#22c55e]' },
            { label: 'Booked (Blue)', value: 'reserved', dot: 'bg-[#3b82f6]' },
            { label: 'Sold Out (Red)', value: 'sold', dot: 'bg-[#f43f5e]' }
          ].map(st => (
            <button
              key={st.value}
              onClick={() => onChange({ ...filters, status: st.value })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                filters.status === st.value
                  ? 'bg-slate-800 border-slate-600 text-white shadow-sm'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
              <span>{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Special Highlights Checkboxes */}
      <div className="space-y-2 pt-1 border-t border-slate-800">
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Special Preferences
        </label>

        <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={filters.cornerOnly}
            onChange={e => onChange({ ...filters, cornerOnly: e.target.checked })}
            className="w-4 h-4 rounded border-slate-700 bg-slate-950 accent-emerald-500"
          />
          <span>Corner Plots Only</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={filters.parkFacingOnly}
            onChange={e => onChange({ ...filters, parkFacingOnly: e.target.checked })}
            className="w-4 h-4 rounded border-slate-700 bg-slate-950 accent-emerald-500"
          />
          <span>Park-Facing Plots</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={filters.mainBoulevardOnly}
            onChange={e => onChange({ ...filters, mainBoulevardOnly: e.target.checked })}
            className="w-4 h-4 rounded border-slate-700 bg-slate-950 accent-emerald-500"
          />
          <span>Main 9.0m Asphalt Road</span>
        </label>
      </div>

      {/* Budget Range Slider */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Max Budget</span>
          <span className="font-bold text-amber-400">{formatINR(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min="1500000"
          max="2000000"
          step="25000"
          value={filters.maxPrice}
          onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>₹15 Lakhs</span>
          <span>₹20 Lakhs</span>
        </div>
      </div>
    </div>
  );
}

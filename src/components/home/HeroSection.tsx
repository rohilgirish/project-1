'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, ShieldCheck, Download, Sparkles, MapPin, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { PROJECT_SPECS } from '@/data/landmarks';

export default function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-slate-950">
      {/* Background Aerial Landscape Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85"
          alt="Anurag Enclave Plotted Development"
          className="w-full h-full object-cover opacity-25 scale-105 transform motion-safe:animate-pulse duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950/60 to-slate-950" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-full px-4 py-1.5 shadow-xl backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping" />
          <span className="text-xs font-semibold text-slate-200">
            2 Acres Gated Layout • <strong className="text-emerald-400">22 Plots Available</strong> out of 39
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-amber-400 font-semibold">Sakrayapatna • Chikkamagaluru</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Own Your Villa Plot in{' '}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-400 bg-clip-text text-transparent">
              Anurag Enclave
            </span>{' '}
            Sakrayapatna, Chikkamagaluru
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Craft your family’s sanctuary with <strong className="text-white font-semibold">ANURAGH FOUNDATION</strong> — an exclusive 2-acre gated enclave of <strong className="text-amber-300 font-semibold">39 luxury villa plots</strong> (30×40 ft / 1,200 sq.ft) framed by serene landscapes right off the Chikkamagaluru–Kadur Highway. Featuring 9.0-meter wide grand asphalt avenues, a dedicated Civic Amenity site, a 48m lush botanical park belt, and 100% clear A-Khata titles poised for generational value.
          </p>
        </div>

        {/* Dual Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <Link
            href="/plots"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold px-7 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-slate-950" />
            <span>Explore 3D Layout (39 Plots)</span>
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-lg transition-all hover:border-slate-500 cursor-pointer"
          >
            <span>Book Site Visit at Sakrayapatna</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

        {/* Key Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 text-left">
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Prime Location</span>
            </div>
            <div className="text-xs text-slate-300 font-medium">Clear Title A-Khata</div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Sakrayapatna • Kadur Highway</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Standard Plot Size</span>
            </div>
            <div className="text-sm font-extrabold text-white">30 × 40 ft (1,200 sq.ft)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">9.14m × 12.19m CAD Sanction</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Highway Access</span>
            </div>
            <div className="text-xs text-slate-300 font-medium">Chikkamagaluru-Kadur SH-57</div>
            <div className="text-[10px] text-slate-500 mt-0.5">500 meters / 2 mins</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Starting Rate</span>
            </div>
            <div className="text-sm font-extrabold text-white">₹15.6 Lakhs Onwards</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">₹1,300 / sq.ft Launch Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}

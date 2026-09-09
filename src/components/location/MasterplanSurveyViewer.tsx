'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Maximize2, X, Download, MapPin, Compass, ShieldCheck,
  CheckCircle2, Layers, ZoomIn, Eye, Sparkles, Building2, Trees
} from 'lucide-react';
import { PROJECT_SPECS } from '@/data/landmarks';

export default function MasterplanSurveyViewer() {
  const [activeTab, setActiveTab] = useState<'cad' | 'survey' | 'split'>('split');
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  const openModal = (src: string, title: string) => {
    setModalImage(src);
    setModalTitle(title);
  };

  const closeModal = () => {
    setModalImage(null);
    setModalTitle('');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
      {/* Header with Brand Logo & Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Sakrayapatna • 2.00 Acres Gated Enclave
            </span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              DTCP & Panchayat Sanctioned
            </span>
            <span className="text-xs text-slate-400">
              Sakrayapatna, Kadur Taluk, Chikkamagaluru
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Official CAD Layout & Aerial Survey Sketch</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Compare the sanctioned CAD engineering plot layout with the official revenue survey sketch. Exactly 39 residential villa plots (30×40 ft), 9.0m wide asphalt avenues, central Civic Amenity zone, and 48m botanical green buffer.
          </p>
        </div>

        {/* Brand Badge */}
        <div className="flex items-center gap-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shrink-0 self-start lg:self-auto">
          <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-white/5 p-1 border border-amber-500/20 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Anuragh Foundation Official Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">Developer</span>
            <span className="font-black text-white text-sm">ANURAGH FOUNDATION</span>
            <span className="text-[11px] text-emerald-400 block font-semibold">ANURAG ENCLAVE</span>
          </div>
        </div>
      </div>

      {/* Quick Layout Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
          <span className="text-slate-400 text-[11px] block">Total Land Extent</span>
          <span className="font-extrabold text-white text-base">2.00 Acres</span>
          <span className="text-[10px] text-emerald-400 block font-medium">Sakrayapatna, Chikkamagaluru</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
          <span className="text-slate-400 text-[11px] block">Total Villa Plots</span>
          <span className="font-extrabold text-white text-base">39 Sanctioned</span>
          <span className="text-[10px] text-emerald-400 block font-medium">Standard 30 × 40 ft</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
          <span className="text-slate-400 text-[11px] block">Internal Road Width</span>
          <span className="font-extrabold text-white text-base">9.00 Meters</span>
          <span className="text-[10px] text-emerald-400 block font-medium">Wide Asphalt Boulevards</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
          <span className="text-slate-400 text-[11px] block">Civic Amenity (CA) Site</span>
          <span className="font-extrabold text-white text-base">27.0m × 18.17m</span>
          <span className="text-[10px] text-emerald-400 block font-medium">Plus 48m Park Zone</span>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('split')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'split'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Side-by-Side Dual View</span>
          </button>
          <button
            onClick={() => setActiveTab('cad')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cad'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>CAD Layout Blueprint</span>
          </button>
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'survey'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Aerial Survey Sketch</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Click any blueprint to zoom high-resolution</span>
        </div>
      </div>

      {/* Main Visual Display */}
      {activeTab === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CAD Layout Card */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden group relative flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">Sanctioned CAD Layout Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/images/layout-plan.png"
                  download="anurag-enclave-cad-layout.png"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Download CAD Layout"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => openModal('/images/layout-plan.png', 'ANURAG ENCLAVE — Sanctioned CAD Layout Plan (39 Plots, 9m Road, CA Site, Park)')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Zoom Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              className="relative aspect-[4/3] bg-slate-900/50 p-3 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => openModal('/images/layout-plan.png', 'ANURAG ENCLAVE — Sanctioned CAD Layout Plan')}
            >
              <Image
                src="/images/layout-plan.png"
                alt="Anurag Enclave Official CAD Layout Blueprint"
                width={800}
                height={600}
                className="object-contain max-h-full w-auto rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors flex items-center justify-center">
                <div className="bg-slate-950/80 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 backdrop-blur-md">
                  <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Click to Inspect High-Res</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400 space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Layout Highlights:</span>
                <span className="text-emerald-400">Plots 01 to 39</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Shows 9.0m internal roads, central 27.0m × 18.17m CA Site, and 48.17m landscaped park along eastern boundary.
              </p>
            </div>
          </div>

          {/* Aerial Survey Sketch Card */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden group relative flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">Official Aerial Survey Blueprint</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/images/survey-sketch.jpg"
                  download="anurag-enclave-survey-sketch.jpg"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Download Survey Sketch"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => openModal('/images/survey-sketch.jpg', 'ANURAG ENCLAVE — Official Aerial Land Survey Blueprint (Sakrayapatna, Chikkamagaluru)')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Zoom Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              className="relative aspect-[4/3] bg-slate-900/50 p-3 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => openModal('/images/survey-sketch.jpg', 'ANURAG ENCLAVE — Official Aerial Land Survey Sketch')}
            >
              <Image
                src="/images/survey-sketch.jpg"
                alt="Anurag Enclave Aerial Survey Sketch Map"
                width={800}
                height={600}
                className="object-contain max-h-full w-auto rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors flex items-center justify-center">
                <div className="bg-slate-950/80 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 backdrop-blur-md">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Click to Inspect Survey Sketch</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400 space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Survey Boundaries:</span>
                <span className="text-amber-400">Sakrayapatna Village</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Official revenue department survey sketch showing boundary coordinates, abutting roads, and direct access to Kadur Highway (SH-57).
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cad' && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">CAD Masterplan</span>
              <h3 className="text-xl font-black text-white mt-0.5">ANURAG ENCLAVE Layout Blueprint</h3>
              <p className="text-xs text-slate-400">Approved plotted development plan with plot dimensions and civic reservations</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/images/layout-plan.png"
                download="anurag-enclave-cad-layout.png"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Download CAD File</span>
              </a>
              <button
                onClick={() => openModal('/images/layout-plan.png', 'ANURAG ENCLAVE — Sanctioned CAD Layout Plan')}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>

          <div
            className="relative min-h-[500px] sm:min-h-[600px] flex items-center justify-center p-6 bg-slate-900/40 cursor-pointer"
            onClick={() => openModal('/images/layout-plan.png', 'ANURAG ENCLAVE — Sanctioned CAD Layout Plan')}
          >
            <Image
              src="/images/layout-plan.png"
              alt="Anurag Enclave Sanctioned CAD Blueprint"
              width={1400}
              height={900}
              className="object-contain max-h-[650px] w-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {activeTab === 'survey' && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Official Planning Documentation</span>
              <h3 className="text-xl font-black text-white mt-0.5">Aerial Land Layout Sketch</h3>
              <p className="text-xs text-slate-400">Official sanctioned delineation for Sakrayapatna, Kadur Taluk, Chikkamagaluru District</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/images/survey-sketch.jpg"
                download="anurag-enclave-survey-sketch.jpg"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Download Survey Sketch</span>
              </a>
              <button
                onClick={() => openModal('/images/survey-sketch.jpg', 'ANURAG ENCLAVE — Aerial Land Layout Sketch')}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>

          <div
            className="relative min-h-[500px] sm:min-h-[600px] flex items-center justify-center p-6 bg-slate-900/40 cursor-pointer"
            onClick={() => openModal('/images/survey-sketch.jpg', 'ANURAG ENCLAVE — Aerial Land Layout Sketch')}
          >
            <Image
              src="/images/survey-sketch.jpg"
              alt="Anurag Enclave Aerial Survey Sketch Map"
              width={1400}
              height={900}
              className="object-contain max-h-[650px] w-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Fullscreen High-Resolution Modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 sm:p-8 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative rounded-lg overflow-hidden bg-white/5 border border-amber-500/30 p-1 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">{modalTitle}</h4>
                <span className="text-xs text-emerald-400">Sakrayapatna Village • Kadur Taluk • Chikkamagaluru</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={modalImage}
                download
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Download Image"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div className="relative max-w-6xl w-full h-[80vh] flex items-center justify-center">
              <Image
                src={modalImage}
                alt={modalTitle}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

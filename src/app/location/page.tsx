'use client';

import React, { useState } from 'react';
import { LANDMARKS_DATA, PROJECT_SPECS } from '@/data/landmarks';
import NearbyLocationsGrid from '@/components/ui/NearbyLocationsGrid';
import MasterplanSurveyViewer from '@/components/location/MasterplanSurveyViewer';
import {
  MapPin, Train, Car, GraduationCap, Cross, Briefcase, ShoppingBag,
  Navigation, ArrowRight, ShieldCheck, CheckCircle2, Clock, Sparkles, Compass
} from 'lucide-react';

export default function LocationPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Transit', 'Education', 'Healthcare', 'Tech Parks', 'Shopping'];

  const filteredLandmarks = activeCategory === 'all'
    ? LANDMARKS_DATA
    : LANDMARKS_DATA.filter(l => l.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transit': return <Train className="w-4 h-4 text-sky-400" />;
      case 'Education': return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case 'Healthcare': return <Cross className="w-4 h-4 text-rose-400" />;
      case 'Tech Parks': return <Briefcase className="w-4 h-4 text-purple-400" />;
      case 'Shopping': return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      default: return <MapPin className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Strategic Chikkamagaluru - Kadur Highway Corridor
              </span>
              <span className="text-xs text-slate-500">• State Highway 57 Belt</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Location, Regional Connectivity & Access
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Situated at Sakrayapatna Village, Kadur Taluk, Chikkamagaluru District, Karnataka — just 500 meters off the Chikkamagaluru - Kadur State Highway (SH-57). 2.0 Acres of approved plotted land developed by <strong>ANURAGH FOUNDATION</strong>.
            </p>
          </div>

          <a
            href={PROJECT_SPECS.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all self-start md:self-auto cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps / Get Directions</span>
          </a>
        </div>

        {/* Masterplan & Aerial Survey Visualizer (Official CAD + Survey Sketch) */}
        <MasterplanSurveyViewer />

        {/* 3x3 Interactive Expanding Landmark Grid Widget */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-lg text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Nearby Destinations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              360° Neighborhood Access Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hover over the 3×3 matrix to expand individual landmark access points. Click any card to launch turn-by-turn navigation directly to Anurag Enclave.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start text-xs text-slate-400 font-medium">
              <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">🛣️ SH-57 Highway: 2m</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">🛍️ Sakrayapatna: 3m</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">🚆 Kadur Station: 15m</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">☕ Chikkamagaluru: 25m</span>
            </div>
          </div>

          <div className="shrink-0">
            <NearbyLocationsGrid />
          </div>
        </div>

        {/* Interactive Map Embed */}
        <div className="relative aspect-[21/9] min-h-[380px] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          <iframe
            src="https://maps.google.com/maps?q=13.431995391845703,75.91728210449219&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />

          {/* Floating Layout Pin Card */}
          <div className="absolute top-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-2xl max-w-xs sm:max-w-sm">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
              <MapPin className="w-4 h-4 fill-emerald-500" />
              <span>ANURAG ENCLAVE Site Office</span>
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {PROJECT_SPECS.location}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 mt-2 border-t border-slate-800">
              <span>Coordinates: 13.4320° N, 75.9173° E</span>
              <span className="text-emerald-400 font-bold">Sakrayapatna, Chikkamagaluru</span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Key Landmarks' : cat}
            </button>
          ))}
        </div>

        {/* Distance Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredLandmarks.map(landmark => (
            <div
              key={landmark.id}
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 group transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    {getCategoryIcon(landmark.category)}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                    {landmark.category}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm tracking-tight group-hover:text-emerald-300 transition-colors">
                  {landmark.name}
                </h3>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{landmark.distance}</span>
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{landmark.driveTime}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Regional Infrastructure Growth Corridor Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Chikkamagaluru - Kadur Corridor Infrastructure & Growth</h2>
            <p className="text-xs text-slate-400">Highways, railway logistics, and coffee eco-tourism catalyzing capital land valuation appreciation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">Highway Expansion</span>
              <h4 className="font-bold text-white text-sm">SH-57 4-Lane Highway Corridor</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct State Highway connecting Chikkamagaluru to Kadur & NH-206. Just 500m from Anurag Enclave, enabling smooth 15-min drives to Kadur Junction.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">Railway Connectivity</span>
              <h4 className="font-bold text-white text-sm">Kadur & Birur Double-Line Junctions</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Crucial South Western Railway junctions offering daily superfast and Vande Bharat trains connecting straight to Bengaluru, Hubballi, and Pune.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Tourism & Living</span>
              <h4 className="font-bold text-white text-sm">Chikkamagaluru Coffee Belt & Eco-Hub</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                World-renowned plantation belt with serene climate, pure water, scenic Ayyankere Lake, and rising demand for weekend homes and luxury villa residences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

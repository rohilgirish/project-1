import React from 'react';
import Link from 'next/link';
import { PROJECT_SPECS } from '@/data/landmarks';
import { Compass, MapPin, Phone, Mail, ShieldCheck, Award, FileText, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Developer Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-amber-500/30 p-1 flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="Anuragh Foundation Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">ANURAG ENCLAVE</span>
                <span className="text-[10px] text-amber-400 uppercase font-semibold">ANURAGH FOUNDATION</span>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-md text-xs">
              A bespoke 2.0-acre residential plotted sanctuary situated at Sakrayapatna village, Kadur Taluk, Chikkamagaluru District. Designed with 9.0m asphalt avenues, dedicated Civic Amenity site, and serene coffee-country nature.
            </p>

            {/* Trust Badges */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sanctioned Plotted Layout</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                Sakrayapatna Village • Kadur Taluk, Chikkamagaluru
              </div>
              <div className="text-[11px] text-amber-400 font-semibold">
                Close to Chikkamagaluru - Kadur State Highway (SH-57)
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">Overview</Link>
              </li>
              <li>
                <Link href="/plots" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>3D Layout (39 Plots)</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded">3D</span>
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-emerald-400 transition-colors">Location & Connectivity</Link>
              </li>
              <li>
                <Link href="/amenities" className="hover:text-emerald-400 transition-colors">Amenities & Infrastructure</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-400 transition-colors">Pricing & Plot Loan EMI</Link>
              </li>
              <li>
                <Link href="/shortlist" className="hover:text-emerald-400 transition-colors">My Shortlist</Link>
              </li>
            </ul>
          </div>

          {/* Plot Sizes & Layout Specs */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Layout Specifications</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center text-slate-300">
                <span>Total Plotted Land</span>
                <span className="text-amber-400 font-semibold">2.0 Acres</span>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>Standard Dimensions</span>
                <span className="text-emerald-400 font-semibold">30 × 40 ft (1,200 sq.ft)</span>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>Metric Measurement</span>
                <span className="text-white font-medium">9.14m × 12.19m</span>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>Internal Roads</span>
                <span className="text-emerald-400 font-semibold">9.0 Meter (30 ft) Wide</span>
              </li>
              <li className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Civic Amenity (CA) Site (27m × 18m) + Landscaped Park Zone
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Project Site Office</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{PROJECT_SPECS.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${PROJECT_SPECS.phone}`} className="hover:text-white">{PROJECT_SPECS.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${PROJECT_SPECS.email}`} className="hover:text-white">{PROJECT_SPECS.email}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-900 text-[11px] text-slate-400 space-y-2">
          <p className="leading-relaxed">
            Disclaimer: All visual 3D maps, dimensions (9.14m × 12.19m), roads, and civic amenity areas correspond directly to the Sanctioned Layout at Sakrayapatna Village, Kadur Taluk, Chikkamagaluru District. Plots are subject to live physical token reservation. Please review the official sanctioned blueprint at the site office.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-slate-400">
            <span>© {new Date().getFullYear()} {PROJECT_SPECS.developer} - {PROJECT_SPECS.name}. All rights reserved.</span>
            <span>Sakrayapatna, Kadur, Chikkamagaluru</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

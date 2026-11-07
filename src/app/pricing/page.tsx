'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatINR, formatNumberINR } from '@/lib/utils';
import EMICalculator from '@/components/pricing/EMICalculator';
import BrochureModal from '@/components/ui/BrochureModal';
import BuyingProcessGuide from '@/components/home/BuyingProcessGuide';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import {
  Download, CheckCircle2, ArrowRight, ShieldCheck, FileText, Sparkles
} from 'lucide-react';

export default function PricingPage() {
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  const pricingTiers = [
    {
      size: '30 × 40 ft (Standard)',
      filterSize: '30x40',
      area: 1200,
      areaYards: '133.3 sq.yds',
      baseRate: 1300,
      totalPrice: 1560000,
      bookingAmount: 50000,
      facing: 'North, East, South, West',
      popular: true,
      description: 'DTCP & Gram Panchayat approved villa plot (9.14m × 12.19m) bordering 9.0m asphalt road, ideal for immediate 3BHK duplex villa construction.'
    },
    {
      size: '30 × 40 ft (Corner Plot)',
      filterSize: '30x40',
      area: 1200,
      areaYards: '133.3 sq.yds',
      baseRate: 1400,
      totalPrice: 1680000,
      bookingAmount: 100000,
      facing: 'Dual Road / Corner',
      popular: false,
      description: 'High-visibility corner plots with dual 9.0m road access, enhanced natural sunlight, and wide architectural frontage.'
    },
    {
      size: 'Park & CA Boulevard Plot',
      filterSize: '30x40',
      area: 1200,
      areaYards: '133.3 sq.yds',
      baseRate: 1450,
      totalPrice: 1740000,
      bookingAmount: 100000,
      facing: 'East Facing / Park View',
      popular: false,
      description: 'Exclusive villa plots directly adjacent to the 48.17m botanical park buffer and 27m Civic Amenity boulevard zone.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                100% Transparent Pricing
              </span>
              <span className="text-xs text-slate-500">• Zero Hidden Escalations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Plot Pricing & Customized Payment Plans
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Competitive launch pricing starting at ₹1,300/sq.ft (from ₹15.6 Lakhs) with clear titles, DTCP approvals, and structured milestone-based payments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsBrochureOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-xl transition-all cursor-pointer self-start md:self-auto"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Masterplan & Cost Sheet</span>
          </button>
        </div>

        {/* Pricing Tiers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative bg-slate-900/80 border rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl ${
                tier.popular
                  ? 'border-emerald-500/60 shadow-emerald-500/10'
                  : 'border-slate-800'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
                  Most Preferred Configuration
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Configuration</span>
                  <h3 className="text-2xl font-black text-white mt-0.5">{tier.size}</h3>
                  <span className="text-xs text-emerald-400 font-semibold">{tier.area.toLocaleString()} sq.ft • {tier.areaYards}</span>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400 block">Total Investment</span>
                  <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
                    {formatINR(tier.totalPrice)}
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    ₹{formatNumberINR(tier.baseRate)} / sq.ft (All-Inclusive Base Price)
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {tier.description}
                </p>

                <div className="space-y-2 text-xs text-slate-300 pt-2">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Token Advance:</span>
                    <span className="font-bold text-white">{formatINR(tier.bookingAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Facings:</span>
                    <span className="font-semibold text-emerald-400">{tier.facing}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Title:</span>
                    <span className="font-semibold text-white">Freehold A-Khata</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/plots?size=${tier.filterSize}`}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95 duration-150"
              >
                <span>View Matching Available Plots</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Milestone Payment Schedule Table (Fixed token amounts harmonized with cards) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Standard Milestones Payment Schedule</h3>
              <p className="text-xs text-slate-400">Linked to legal verification, agreement, and registration</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Milestone-Based Escrow
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="p-3">Stage / Milestone</th>
                  <th className="p-3">Timeline</th>
                  <th className="p-3">Payment Amount / Percentage</th>
                  <th className="p-3">Deliverables</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Booking Token Advance</td>
                  <td className="p-3 text-slate-400">At plot selection</td>
                  <td className="p-3 font-bold text-emerald-400">₹50,000 (Standard) / ₹1,00,000 (Corner / Park)</td>
                  <td className="p-3">Official Plot Allotment Letter</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Agreement for Sale</td>
                  <td className="p-3 text-slate-400">Within 15 days of token</td>
                  <td className="p-3 font-bold text-emerald-400">20% (Less token advance paid)</td>
                  <td className="p-3">Registered Agreement + Legal Scrutiny Dossier</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Infrastructure & Demarcation</td>
                  <td className="p-3 text-slate-400">Within 30 days</td>
                  <td className="p-3 font-bold text-emerald-400">30% (Stage 2 Installment)</td>
                  <td className="p-3">Physical boundary stone inspection</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Registration & Possession</td>
                  <td className="p-3 text-slate-400">At final execution</td>
                  <td className="p-3 font-bold text-emerald-400">50% (Final Balance at Registration)</td>
                  <td className="p-3">Sale Deed Registration & A-Khata Transfer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Step-by-Step Buying Process Guide */}
        <BuyingProcessGuide />

        {/* Taste-133 Villa Plot Financing & EMI Affordability Suite */}
        <EMICalculator />

        {/* Comprehensive Buyer FAQ */}
        <PricingFAQ />

        {/* Direct Consultation & Site Visit Scheduling CTA */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Direct From Developer • Anuragh Foundation
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Ready to Secure Your Plot at Launch Prices?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Get detailed cost breakdowns, customized payment installments, and schedule your guided on-site visit at Sakrayapatna.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95 duration-150 flex items-center gap-2 cursor-pointer"
            >
              <span>Schedule On-Site Visit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/plots"
              className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Masterplan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Gated Brochure Modal */}
      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
      />
    </div>
  );
}

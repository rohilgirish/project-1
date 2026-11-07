import React from 'react';
import { ShieldCheck, Award, FileCheck2, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Testimonials() {
  const commitments = [
    {
      icon: ShieldCheck,
      title: 'Direct Landowner Allotment',
      badge: 'Zero Brokerage',
      description:
        'Purchase directly from Anuragh Foundation, the landowner and developer. No intermediaries, no hidden markups, and zero brokerage commission.',
    },
    {
      icon: MapPin,
      title: 'Physical Stone Demarcation',
      badge: 'Verified On-Site',
      description:
        'Every single plot boundary is physically demarcated on-ground with concrete survey stones in Sakrayapatna. Inspect your exact boundary in person.',
    },
    {
      icon: FileCheck2,
      title: 'Clear Title & Nil Encumbrance',
      badge: '100% Marketable',
      description:
        '15-year Nil Encumbrance Certificate (EC), DC conversion under Section 95, and sanctioned layout plan available for physical scrutiny at our site office.',
    },
    {
      icon: Award,
      title: 'Sub-Registrar Registration Escort',
      badge: 'Kadur Jurisdiction',
      description:
        'Our legal specialists manage document preparation, stamp duty computation, and escort you to the Kadur Sub-Registrar office for deed registration.',
    },
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Developer Commitment
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Anuragh Foundation Guarantees
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real estate buying built on verifiable legal documents, on-ground survey demarcation, and direct landowner transparency.
          </p>
        </div>

        {/* Commitment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-emerald-500/30 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      {c.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{c.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verifiable at Site Office</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verifiable Layout Metrics Strip */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block font-mono">2.0 Acres</span>
            <span className="text-xs text-slate-400 mt-1 block">Sanctioned Layout Area</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block font-mono">39 Plots</span>
            <span className="text-xs text-slate-400 mt-1 block">30×40 ft / 1,200 sq.ft</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block font-mono">9.0 Meters</span>
            <span className="text-xs text-slate-400 mt-1 block">Wide Main Avenue Asphalt Roads</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block font-mono">100%</span>
            <span className="text-xs text-slate-400 mt-1 block">Bank Loan Eligible Freehold Titles</span>
          </div>
        </div>
      </div>
    </section>
  );
}

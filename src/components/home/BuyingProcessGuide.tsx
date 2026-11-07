import React from 'react';
import { MapPin, FileCheck2, Landmark, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BuyingProcessGuide() {
  const steps = [
    {
      number: '01',
      title: 'Select Plot & Site Inspection',
      timeline: 'Day 1',
      description:
        'Explore our interactive 3D site plan, schedule a guided visit to Sakrayapatna, walk the 9.0m asphalt avenues, and verify physical boundary stones.',
      deliverable: 'Physical Plot Demarcation',
    },
    {
      number: '02',
      title: 'Token Advance & Allotment',
      timeline: 'Day 2 – 3',
      description:
        'Lock your preferred plot with a token advance (₹50,000 for Standard / ₹1,00,000 for Corner/Park). Receive your official Plot Allotment Letter.',
      deliverable: 'Official Allotment Letter',
    },
    {
      number: '03',
      title: 'Legal Scrutiny & Bank Sanction',
      timeline: 'Day 4 – 15',
      description:
        'Scrutinize the 15-year Nil Encumbrance Certificate, DC conversion order, and title deed. Avail up to 80% bank plot loan from partner nationalized banks.',
      deliverable: 'Legal Title Clearance & Loan Approval',
    },
    {
      number: '04',
      title: 'Registration & Possession',
      timeline: 'Day 15 – 30',
      description:
        'Pay the remaining balance. Our legal escort coordinates stamp duty and accompanies you to the Kadur Sub-Registrar office for registered sale deed execution.',
      deliverable: 'Registered Sale Deed & A-Khata',
    },
  ];

  return (
    <section className="py-16 bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Buying Works at Anurag Enclave
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A structured, 4-step buyer journey designed for 100% legal clarity, peace of mind, and smooth registration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-slate-950/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-amber-500/30 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-mono text-amber-400/90">{step.number}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    {step.timeline}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{step.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{step.deliverable}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-xl hover:brightness-110 transition-all cursor-pointer"
          >
            <span>Start Step 1: Schedule Your Free On-Site Inspection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

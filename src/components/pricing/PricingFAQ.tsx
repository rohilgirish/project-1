'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function PricingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What layout sanctions and legal approvals does Anurag Enclave possess?',
      a: 'Anurag Enclave is a 2.0-acre sanctioned residential plotted layout comprising 39 plots located at Sakrayapatna, Kadur Taluk, Chikkamagaluru District. The land is DC Converted under Section 95 of the Karnataka Land Revenue Act for residential use, carries Grama Panchayat layout approval, and has a 15-year nil encumbrance certificate (EC) with clear freehold marketable title.',
    },
    {
      q: 'What are the exact plot dimensions and internal road widths?',
      a: 'All standard plots measure 30 ft × 40 ft (9.14 m × 12.19 m), giving a net area of 1,200 sq.ft (133.3 sq.yards). The internal avenue network features 9.0-meter wide asphalt roads, planned underground stormwater drains, dedicated Civic Amenity (CA) site, and a 48-meter botanical park buffer.',
    },
    {
      q: 'Are bank loans available to finance the plot purchase?',
      a: 'Yes. Anurag Enclave plots are pre-approved by leading nationalized and private scheduled banks for plot purchase loans up to 75% – 80% of the sale value, with repayment tenures up to 15 to 20 years at competitive interest rates.',
    },
    {
      q: 'What is the token advance amount required to block a plot?',
      a: 'To reserve a standard 30×40 plot, the initial booking token advance is ₹50,000. For dual-road corner plots or park-facing boulevard plots, the token advance is ₹1,00,000. You immediately receive a formal Plot Allotment Letter locking in the launch price.',
    },
    {
      q: 'Where will the sale deed be registered, and what are the government charges?',
      a: 'Deed registration is executed at the Kadur Sub-Registrar Office (Chikkamagaluru District jurisdiction). Under Karnataka Kaveri 2.0 regulations, registration involves 5% basic stamp duty + 10% cess + 2% surcharge (~5.6% total duty) plus 2% registration fee based on the guidance value or consideration amount, whichever is higher.',
    },
    {
      q: 'Can I start villa construction immediately after registration?',
      a: 'Yes. Upon registration and issuance of the A-Khata transfer certificate, you can immediately obtain building plan sanction and commence duplex villa construction.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-12 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Frequently Asked Buyer Questions
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent answers regarding approvals, pricing, token advances, and Kadur Sub-Registrar registration.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen ? 'bg-slate-950 border-amber-500/30 shadow-lg' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
              >
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

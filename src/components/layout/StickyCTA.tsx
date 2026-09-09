'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Calendar, Download, Sparkles, X } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';
import { PROJECT_SPECS } from '@/data/landmarks';

export default function StickyCTA() {
  const [dismissed, setDismissed] = useState(false);
  const whatsAppUrl = getWhatsAppLink();

  if (dismissed) return null;

  return (
    <>
      {/* Mobile Bottom Fixed Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl flex items-center gap-2">
        <a
          href={`tel:${PROJECT_SPECS.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold active:bg-slate-800"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Call Now</span>
        </a>

        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-white" />
          <span>WhatsApp</span>
        </a>

        <Link
          href="/contact"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Site Visit</span>
        </Link>
      </div>

      {/* Desktop Floating Right Action Card */}
      <div className="hidden lg:block fixed bottom-8 right-6 z-40">
        <div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl w-64 space-y-3 text-white">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDismissed(true);
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer z-50 border border-slate-700/60"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 pr-6">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold tracking-wide uppercase text-emerald-400">
              Plots Selling Fast
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-tight">
            Only <strong>22 of 39</strong> villa plots available. Schedule your on-site walkthrough at Sakrayapatna.
          </p>

          <div className="space-y-1.5 pt-1">
            <Link
              href="/contact"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Site Visit</span>
            </Link>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

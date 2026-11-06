'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export default function FloatingWhatsAppCTA() {
  const whatsAppUrl = getWhatsAppLink(
    undefined,
    'Hello Anurag Enclave team, I would like to check plot availability and schedule a site visit at Sakrayapatna.'
  );

  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="hidden md:flex fixed bottom-6 left-6 z-40 items-center"
    >
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl backdrop-blur-xl transition-all duration-200 active:scale-95 cursor-pointer hover:shadow-emerald-500/10"
        title="Chat directly on WhatsApp with our site advisor"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
          <MessageSquare className="w-3.5 h-3.5 fill-current" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
            Chat on WhatsApp
          </div>
          <div className="text-[9px] text-emerald-400 font-mono leading-tight">
            Online • Instant Reply
          </div>
        </div>
      </a>
    </aside>
  );
}


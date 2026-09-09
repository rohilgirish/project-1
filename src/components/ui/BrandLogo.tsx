import React from 'react';

export default function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Anuragh Foundation Logo Image */}
      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-900/90 border border-amber-500/40 p-1 shadow-lg shadow-amber-500/15 flex items-center justify-center shrink-0">
        <img
          src="/images/logo-gold.png"
          alt="Anuragh Foundation Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(189,159,103,0.3)]"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-black text-base sm:text-lg tracking-tight text-white group-hover:text-amber-300 transition-colors">
            ANURAG ENCLAVE
          </span>
          <span className="text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded uppercase">
            Sakrayapatna
          </span>
        </div>
        <span className="hidden sm:block text-[9px] text-slate-400 tracking-wider uppercase font-semibold whitespace-nowrap">
          ANURAGH FOUNDATION • Chikkamagaluru
        </span>
      </div>
    </div>
  );
}

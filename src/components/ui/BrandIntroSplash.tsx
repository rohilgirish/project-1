'use client';

import React, { useState, useEffect } from 'react';
import LuxuryBrandIntroCard from './LuxuryBrandIntroCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function BrandIntroSplash() {
  const [stage, setStage] = useState<'intro' | 'revealed' | 'exiting' | 'hidden'>('hidden');

  useEffect(() => {
    // Only show once per user session
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('anurag_intro_seen')) {
        return; // Already seen in this session, stay hidden
      }
    } catch {
      // Continue if storage restricted
    }

    // Mark as seen immediately so clicking Overview or navigating never plays it again
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('anurag_intro_seen', 'true');
      }
    } catch {}

    setStage('intro');

    // Step 1: Reveal after 300ms (plays the rotation snap and seal expansion)
    const revealTimer = setTimeout(() => {
      setStage('revealed');
    }, 300);

    // Step 2: Begin exit fade-out after 3400ms
    const exitTimer = setTimeout(() => {
      setStage('exiting');
    }, 3400);

    // Step 3: Remove from DOM after 4100ms
    const hideTimer = setTimeout(() => {
      setStage('hidden');
    }, 4100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSkip = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('anurag_intro_seen', 'true');
      }
    } catch {}
    setStage('exiting');
    setTimeout(() => {
      setStage('hidden');
    }, 450);
  };

  if (stage === 'hidden') return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070d14] transition-all duration-700 ease-out select-none cursor-pointer ${
        stage === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Multi-layered cinematic gold atmospheric glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(189,159,103,0.25)_0%,_rgba(15,23,42,0.7)_55%,_rgba(3,7,18,0.98)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.12)_0%,_transparent_60%)] pointer-events-none" />

      {/* Decorative subtle light rays */}
      <div className="absolute w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none animate-pulse" />

      <div
        className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* The grand luxury intro card with size="large" */}
        <div
          className="cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
          onClick={handleSkip}
          title="Click to enter website"
        >
          <LuxuryBrandIntroCard
            size="large"
            isActive={stage === 'revealed' || stage === 'exiting'}
            subtitle="CHIKKAMAGALURU"
            badge="SAKRAYAPATNA • CHIKKAMAGALURU"
            className="shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(189,159,103,0.3)]"
          />
        </div>

        {/* Enter Site Button with polished luxury styling */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-2">
          <button
            onClick={handleSkip}
            className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500/25 via-slate-900/95 to-amber-500/25 hover:from-amber-500/40 hover:to-amber-500/40 border border-amber-500/60 hover:border-amber-400 text-amber-200 hover:text-amber-100 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-2xl shadow-black/70 hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400/80 animate-pulse" />
            <span>Enter Website</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-amber-400" />
          </button>
          <span className="text-[11px] text-amber-400/60 tracking-wider font-medium">
            Click anywhere or press Esc to enter
          </span>
        </div>
      </div>
    </div>
  );
}

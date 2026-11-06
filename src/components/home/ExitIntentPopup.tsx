'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitLead } from '@/lib/leads';

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // Check if previously dismissed in this session
    if (sessionStorage.getItem('horizon_exit_dismissed')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        setIsOpen(true);
        sessionStorage.setItem('horizon_exit_dismissed', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);

    try {
      const res = await submitLead({
        fullName: name,
        phone,
        email: '',
        type: 'exit_intent',
        website_url_check: honeypot
      });

      if (res.success) {
        setSubmitted(true);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <FileText className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Exclusive VIP Download
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Download Official Masterplan & Full Price Sheet PDF
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                Before you go, get instant access to the unreleased high-resolution layout map, exact plot numbering, and latest discounted price schedule.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complete 39-plot dimensions (30×40 ft) & facing chart</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Official Layout Sketch & DTCP sanctioned masterplan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transparent pricing starting from ₹15.6 Lakhs</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-2 relative">
              {/* Honeypot trap field (hidden from real users) */}
              <div className="absolute opacity-0 pointer-events-none -z-50 h-0 w-0 overflow-hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_url_check"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                />
              </div>

              <input
                type="text"
                required
                placeholder="Your Full Name *"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />

              <input
                type="tel"
                required
                placeholder="WhatsApp Phone Number *"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{submitting ? 'Preparing Plan...' : 'Download Free CAD Plan & Price List'}</span>
              </button>

              <p className="text-[10px] text-slate-500 text-center">
                🔒 Zero spam guarantee. We respect your privacy.
              </p>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Your Masterplan is Ready!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              We have dispatched the masterplan and price breakdown to your phone number. You can also download the CAD blueprint directly below.
            </p>
            <a
              href="/images/layout-plan.png"
              download="anurag-enclave-masterplan.png"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold py-3 px-6 rounded-xl text-xs shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download CAD Blueprint Directly</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

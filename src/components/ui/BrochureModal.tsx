'use client';

import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitLead } from '@/lib/leads';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrochureModal({ isOpen, onClose }: BrochureModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dpdpConsent, setDpdpConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !phone.trim()) {
      setErrorMessage('Please provide your name and phone number.');
      return;
    }

    if (!dpdpConsent) {
      setErrorMessage('Please acknowledge the DPDP consent to receive the masterplan.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitLead({
        fullName: name.trim(),
        phone: phone.trim(),
        email: '',
        type: 'blueprint_download',
        dpdpConsent: true,
        website_url_check: honeypot,
      });

      if (res.success) {
        setSubmitted(true);
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

        // Build authenticated download URL using the cryptographically signed downloadToken
        const authorizedUrl = res.downloadToken
          ? `/api/brochure/download?token=${encodeURIComponent(res.downloadToken)}`
          : '/api/brochure/download';

        setDownloadUrl(authorizedUrl);

        // Automatically trigger download with the authorized token
        const link = document.createElement('a');
        link.href = authorizedUrl;
        link.download = 'Anurag-Enclave-Masterplan-CAD.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setErrorMessage(res.error || 'Failed to authorize download. Please try again.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brochure-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close dialog"
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
                Official Project Blueprint
              </span>
            </div>

            <div>
              <h2 id="brochure-modal-title" className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Download Layout Plan & Price Guide
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                Enter your details to generate your authenticated download token for the high-resolution CAD masterplan with demarcated dimensions, roads, and pricing.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>39 plotted layout map with 9.0m wide asphalt avenue roads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Demarcated Civic Amenity & 48m botanical park belt</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transparent price breakdown from ₹15.6 Lakhs</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 pt-2 relative">
              {/* Honeypot anti-bot trap */}
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

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Kumar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  WhatsApp Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98860 XXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* DPDP Act 2023 Statutory Consent Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={dpdpConsent}
                  onChange={e => setDpdpConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                />
                <span className="text-[11px] text-slate-300 leading-snug">
                  I consent to Anurag Enclave contacting me via WhatsApp/phone with the layout masterplan and pricing schedule under the <strong>DPDP Act 2023</strong>.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>{submitting ? 'Authenticating Access...' : 'Generate Authorized Download Token'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>DPDP Act 2023 Compliant • No third-party marketing</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Download Authorized!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your one-time cryptographic download token has been generated. The CAD blueprint has started downloading to your device.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-amber-300/90 font-mono">
              ⏱️ Authorization token valid for 15 minutes
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={downloadUrl}
                download="Anurag-Enclave-Masterplan-CAD.png"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-6 rounded-xl text-xs shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Again (Token Active)</span>
              </a>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2, Trash2, Send, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PROJECT_SPECS } from '@/data/landmarks';

export default function PrivacyPolicyPage() {
  const [erasurePhone, setErasurePhone] = useState('');
  const [erasureName, setErasureName] = useState('');
  const [erasureReason, setErasureReason] = useState('');
  const [isSubmittingErasure, setIsSubmittingErasure] = useState(false);
  const [erasureSuccessMsg, setErasureSuccessMsg] = useState('');

  const handleErasureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!erasurePhone.trim()) {
      toast.error('Mobile number is required to locate and erase your records.');
      return;
    }

    setIsSubmittingErasure(true);
    setErasureSuccessMsg('');

    try {
      const res = await fetch('/api/privacy/erasure-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: erasurePhone,
          fullName: erasureName,
          reason: erasureReason,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setErasureSuccessMsg(data.message);
        setErasurePhone('');
        setErasureName('');
        setErasureReason('');
        toast.success('Erasure Request Registered', {
          description: 'Your request is recorded under DPDP Act 2023 with a 30-day SLA.',
        });
      } else {
        toast.error('Request Issue', { description: data.error || 'Failed to submit erasure request.' });
      }
    } catch {
      toast.error('Network Error', { description: 'Please call our site desk directly.' });
    } finally {
      setIsSubmittingErasure(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Anurag Enclave</span>
        </Link>

        <div className="space-y-2 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>Digital Personal Data Protection (DPDP Act 2023) Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy & Data Protection Notice
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: November 2026 • Anuragh Foundation, Sakrayapatna, Chikkamagaluru
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1. Information We Collect
            </h2>
            <p className="text-slate-400">
              When you interact with the Anurag Enclave website, schedule an on-site visit, or request title documentation, we collect the following personal identifiers:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li>Full Name and Mobile Phone Number (for WhatsApp / SMS appointment verification)</li>
              <li>Email Address (optional, for receiving cost sheets and layout blueprints)</li>
              <li>Preferred on-site visit dates and plot configuration preferences</li>
              <li>Network metadata (IP address, anonymized referral source for fraud detection and rate limiting)</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              2. Lawful Basis & Third-Party Data Processors
            </h2>
            <p className="text-slate-400">
              Under India’s Digital Personal Data Protection Act 2023, data is processed strictly on the basis of your affirmative consent for villa plot inquiries and guided site walkthroughs.
            </p>
            <p className="text-slate-400 font-semibold pt-1">
              Authorized Sub-Processors:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li><strong>Supabase Inc.</strong> — Secure, encrypted cloud database hosting customer leads with Row-Level Security.</li>
              <li><strong>Vercel Inc.</strong> — Edge computing and serverless application hosting with TLS 1.3 encryption in transit.</li>
              <li><strong>Telegram FZ-LLC / Slack Technologies</strong> — Instant notification processors forwarding sales notifications to our on-site relationship managers.</li>
            </ul>
            <p className="text-slate-400 pt-1">
              We NEVER sell, trade, or share your contact information with external telemarketers or third-party loan brokers.
            </p>
          </section>

          {/* Section 3: Retention Period */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              3. Data Retention & Auto-Archival Policy
            </h2>
            <p className="text-slate-400">
              Personal customer records are retained for an active period of <strong>24 months</strong> from the date of initial submission to facilitate customer service and property registration assistance. After 24 months of dormancy with no registered transaction, leads are automatically archived and scheduled for permanent database purging.
            </p>
          </section>

          {/* Section 4: Public Right to Erasure Form */}
          <section className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                4. Exercise Your Right to be Forgotten (Data Erasure Request)
              </h2>
              <p className="text-slate-400 mt-1">
                You possess the statutory right to request immediate erasure of your mobile number and contact details from our database. In accordance with the DPDP Act 2023, our Grievance Officer enforces a strict <strong>30-day statutory Service Level Agreement (SLA)</strong> for complete data purging.
              </p>
            </div>

            {erasureSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Erasure Request Acknowledged</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{erasureSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleErasureSubmit} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Registered Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98860 XXXXX"
                      value={erasurePhone}
                      onChange={e => setErasurePhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Chandra"
                      value={erasureName}
                      onChange={e => setErasureName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Reason for Deletion (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Already purchased elsewhere, or prefer no further contact"
                    value={erasureReason}
                    onChange={e => setErasureReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingErasure}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-200 hover:text-rose-400 border border-slate-700 hover:border-rose-800/40 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isSubmittingErasure ? 'Submitting Request...' : 'Submit Official Data Erasure Request (30-Day SLA)'}</span>
                </button>
              </form>
            )}
          </section>

          {/* Grievance Officer */}
          <section className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
            <h3 className="font-bold text-white">Grievance Officer Contact Details:</h3>
            <p>
              Inquiries regarding data rights, verification, or withdrawal under the DPDP Act 2023 may be addressed to our appointed Data Grievance Officer:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-0.5">
              <div><strong>Designation:</strong> Data Protection & Grievance Officer, Anurag Enclave</div>
              <div><strong>Email:</strong> {PROJECT_SPECS.email}</div>
              <div><strong>Phone Desk:</strong> {PROJECT_SPECS.phone}</div>
              <div><strong>Address:</strong> {PROJECT_SPECS.officeAddress}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

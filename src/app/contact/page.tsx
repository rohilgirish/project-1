'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PROJECT_SPECS } from '@/data/landmarks';
import { getWhatsAppLink } from '@/lib/utils';
import {
  Phone, Mail, MapPin, MessageSquare, Calendar, CheckCircle2, ArrowRight, ShieldCheck, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitLead } from '@/lib/leads';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    visitDate: '',
    plotSize: '30x40',
    notes: ''
  });
  const [honeypot, setHoneypot] = useState('');
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitting(true);

    try {
      const res = await submitLead({
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email,
        preferredDate: formData.visitDate,
        plotNumber: formData.plotSize,
        type: 'site_visit',
        dpdpConsent,
        website_url_check: honeypot
      });

      if (res.success) {
        setSubmitted(true);
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsAppUrl = getWhatsAppLink();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Dedicated Sales & Relationship Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Schedule Your Visit or Connect with Our Advisors
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Our Senior Land Specialists are available 7 days a week for in-person site walkthroughs, video consultations, and title deed verifications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white">Direct Communication Channels</h3>

              <div className="space-y-4 text-xs">
                <a
                  href={`tel:${PROJECT_SPECS.phone}`}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone Inquiry (Toll-Free)</span>
                    <span className="font-bold text-white text-sm">{PROJECT_SPECS.phone}</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Instant response 8 AM - 9 PM</span>
                  </div>
                </a>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">WhatsApp Concierge</span>
                    <span className="font-bold text-white text-sm">Direct Chat Support</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Share plot plan & brochure</span>
                  </div>
                </a>

                <a
                  href={`mailto:${PROJECT_SPECS.email}`}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email Desk</span>
                    <span className="font-bold text-white text-sm">{PROJECT_SPECS.email}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Official cost sheets & title documents</span>
                  </div>
                </a>
              </div>

              {/* Physical Office Address */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-start gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Project Experience Center</span>
                    <span className="text-slate-400 leading-relaxed text-[11px]">{PROJECT_SPECS.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300 pt-1">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-slate-400">Open 7 days a week: 9:00 AM – 6:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking & Enquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Schedule an On-Site Visit</h3>
              <p className="text-xs text-slate-400">
                Book a personalized on-site walkthrough with our land specialists at Sakrayapatna, Kadur Taluk, Chikkamagaluru.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <h4 className="text-2xl font-bold text-white">Site Visit Scheduled!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Our site office team will call you at{' '}
                  <strong>{formData.phone}</strong> shortly to confirm your visit time and share exact location coordinates.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative">
                {/* Honeypot trap field (hidden from real humans) */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98860 XXXXX"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                      Preferred Visit Date
                    </label>
                    <input
                      type="date"
                      value={formData.visitDate}
                      onChange={e => setFormData({ ...formData, visitDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                    Interested Plot Dimension
                  </label>
                  <select
                    value={formData.plotSize}
                    onChange={e => setFormData({ ...formData, plotSize: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="30x40">30 × 40 ft Standard Villa Plot (1,200 sq.ft) - From ₹15.6 Lakhs</option>
                    <option value="30x40-corner">30 × 40 ft Dual-Road Corner Plot - From ₹16.8 Lakhs</option>
                    <option value="30x40-park">30 × 40 ft Park & CA Boulevard Plot - From ₹17.4 Lakhs</option>
                    <option value="multiple">Multiple Plots / Investment Portfolio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                    Specific Questions / Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter any questions regarding plot facing, Vastu, registration process, or preferred meeting time..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="dpdp-consent"
                    checked={dpdpConsent}
                    onChange={e => setDpdpConsent(e.target.checked)}
                    className="mt-0.5 accent-amber-400 h-4 w-4 rounded cursor-pointer shrink-0"
                  />
                  <label htmlFor="dpdp-consent" className="text-[11px] text-slate-400 leading-tight cursor-pointer">
                    I consent to receiving project documentation, layout plans, and appointment confirmations via WhatsApp / Phone under the Digital Personal Data Protection (DPDP) Act 2023. <Link href="/privacy" className="text-amber-400 hover:underline">Privacy Policy</Link>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !dpdpConsent}
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50"
                >
                  <span>{submitting ? 'Confirming Appointment...' : 'Confirm Site Visit Appointment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-slate-500 text-center">
                  By submitting this form, you agree to receive official project updates via WhatsApp and phone.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

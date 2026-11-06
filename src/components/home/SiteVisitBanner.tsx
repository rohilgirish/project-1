'use client';

import React, { useState } from 'react';
import { Calendar, Phone, CheckCircle2, ArrowRight, ShieldCheck, Car, Compass, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitLead } from '@/lib/leads';

export default function SiteVisitBanner() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getUpcomingDate = (targetDay: number, weeksAhead = 0) => {
    const now = new Date();
    const result = new Date(now);
    const day = now.getDay();
    let diff = (targetDay + 7 - day) % 7;
    if (diff === 0 && weeksAhead === 0) diff = 7;
    result.setDate(now.getDate() + diff + (weeksAhead * 7));
    return result.toISOString().split('T')[0];
  };

  const saturdayDate = getUpcomingDate(6);
  const sundayDate = getUpcomingDate(0);
  const nextWeekendDate = getUpcomingDate(6, 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);

    try {
      const res = await submitLead({
        fullName: name,
        phone,
        email: '',
        preferredDate: date,
        type: 'site_visit',
        website_url_check: honeypot
      });

      if (res.success) {
        setSubmitted(true);
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text & Value Prop */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>Guided On-Site Walkthrough</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Schedule Your On-Site Visit at Sakrayapatna
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Step onto the actual layout at Sakrayapatna, walk the 9.0m avenues, inspect demarcated boundary stones, and review registered DTCP title deeds at our site experience lounge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated on-site land specialist assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Personal architectural & Vastu consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Physical verification of stone boundaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Complimentary legal title pack copy</span>
                </div>
              </div>
            </div>

            {/* Quick Booking Form */}
            <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-200">
              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Site Visit Scheduled!</h3>
                  <p className="text-xs text-slate-400">
                    Our site office team will contact you shortly to confirm your visit date and share Google Maps directions.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 relative">
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

                  <h3 className="text-base font-bold text-white tracking-tight">
                    Book Your On-Site Visit
                  </h3>

                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98860 XXXXX"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] text-slate-400 uppercase font-semibold">
                        Preferred Visit Date
                      </label>
                      <span className="text-[10px] text-amber-400/90 font-medium">Quick Select</span>
                    </div>

                    {/* Quick Date Chips (Emil Kowalski micro-interactions) */}
                    <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none">
                      <button
                        type="button"
                        onClick={() => setDate(saturdayDate)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                          date === saturdayDate
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        This Saturday
                      </button>

                      <button
                        type="button"
                        onClick={() => setDate(sundayDate)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                          date === sundayDate
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        This Sunday
                      </button>

                      <button
                        type="button"
                        onClick={() => setDate(nextWeekendDate)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                          date === nextWeekendDate
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        Next Weekend
                      </button>
                    </div>

                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                  >
                    <span>{submitting ? 'Confirming Appointment...' : 'Confirm Site Visit Appointment'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Micro Trust Indicators */}
                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                    <span>🔒 100% Privacy</span>
                    <span>•</span>
                    <span>No Spam Calls</span>
                    <span>•</span>
                    <span>Direct Developer</span>
                  </div>

                  {/* Google Maps site gate navigation */}
                  <div className="pt-1 text-center">
                    <a
                      href="https://maps.google.com/?q=Sakrayapatna,Chikkamagaluru,Karnataka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-300 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Get Driving Directions to Site Gate (Google Maps)</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

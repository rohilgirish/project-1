'use client';

import React, { useState } from 'react';
import { Plot } from '@/types';
import { formatINR, formatNumberINR, getStatusColor, getWhatsAppLink } from '@/lib/utils';
import {
  X, Heart, Share2, Compass, Download, MessageSquare, Phone, Calendar,
  CheckCircle2, ArrowRight, Shield, Ruler, Maximize2, Tag, Sparkles, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitLead } from '@/lib/leads';

interface Props {
  plot: Plot | null;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (id: number) => void;
  onAddToCompare?: (plot: Plot) => void;
  isComparing?: boolean;
}

export default function PlotDetailModal({
  plot,
  onClose,
  isShortlisted,
  onToggleShortlist,
  onAddToCompare,
  isComparing
}: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    visitDate: ''
  });

  if (!plot) return null;

  const statusInfo = getStatusColor(plot.status);
  const whatsAppUrl = getWhatsAppLink(plot.number, plot.size, plot.facing);

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
        plotNumber: plot.number,
        type: 'enquiry',
        website_url_check: honeypot
      });

      if (res.success) {
        setFormSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${plot.number} at Anurag Enclave`,
        text: `Check out ${plot.number} (${plot.size} ft, ${plot.facing}-facing) at Anurag Enclave by Anuragh Foundation, Sakrayapatna, Chikkamagaluru.`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="emil-spring-modal emil-drawer-responsive relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Grab Bar / Drag Handle (Emil Kowalski / Vaul pattern) */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-slate-950/80">
          <div className="w-12 h-1.5 rounded-full bg-slate-600/80" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{plot.number}</span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}
              >
                {statusInfo.label}
              </span>
            </h3>
            {plot.badges.map((b, i) => (
              <span
                key={i}
                className="hidden sm:inline-flex text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Shortlist Heart Button */}
            <button
              onClick={() => onToggleShortlist(plot.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isShortlisted
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
              title={isShortlisted ? 'Remove from Shortlist' : 'Save Plot'}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all"
              title="Share Plot"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-all"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Gallery & Primary Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery (Left 7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
                <img
                  src={plot.images[activeImageIndex] || plot.images[0]}
                  alt={`${plot.number} view`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Badge tags overlay */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg border border-white/10">
                    {activeImageIndex === 0 ? 'Boundary Demarcation' : activeImageIndex === 1 ? 'Street & Avenue View' : 'Drone Aerial'}
                  </span>
                </div>

                <a
                  href={plot.images[activeImageIndex] || plot.images[0]}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm border border-white/10 transition-colors"
                  title="View Full Resolution"
                >
                  <Maximize2 className="w-4 h-4" />
                </a>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2">
                {plot.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-emerald-500 scale-95 shadow-md shadow-emerald-500/20'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Pricing & Spec Summary (Right 5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <div>
                <span className="text-xs uppercase font-medium tracking-wider text-slate-400">Total Investment</span>
                <div className="text-3xl font-extrabold text-amber-400 tracking-tight mt-0.5">
                  {formatINR(plot.price)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  ₹{formatNumberINR(plot.pricePerSqft)} / sq.ft • All-inclusive Base Price
                </div>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Ruler className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dimensions</span>
                  </div>
                  <div className="font-bold text-white text-sm">{plot.width} × {plot.depth} ft</div>
                  <div className="text-[11px] text-slate-500">{plot.size}</div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Total Area</span>
                  </div>
                  <div className="font-bold text-white text-sm">{plot.area.toLocaleString()} sq.ft</div>
                  <div className="text-[11px] text-slate-500">{(plot.area / 9).toFixed(1)} sq.yards</div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Orientation</span>
                  </div>
                  <div className="font-bold text-emerald-400 text-sm">{plot.facing} Facing</div>
                  <div className="text-[11px] text-slate-500">100% Vastu Compliant</div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Approvals</span>
                  </div>
                  <div className="font-bold text-white text-sm">DTCP Sanctioned</div>
                  <div className="text-[11px] text-emerald-400">Clear A-Khata Title</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all text-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Instant WhatsApp Enquiry</span>
                </a>

                {onAddToCompare && (
                  <button
                    onClick={() => onAddToCompare(plot)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                      isComparing
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>{isComparing ? '✓ Added to Comparison' : '+ Compare with Another Plot'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Features & EMI Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Plot Highlights & Downloads */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Site Features & Clear Title Guarantee</span>
              </h4>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Demarcated stone pillars installed with clear geometric GPS coordinates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct underground conduit connections for water, electricity, and fiber broadband.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>DTCP & Gram Panchayat approved layout with clear survey demarcation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Freehold A-Khata ownership with zero encumbrance certificate.</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                <a
                  href="/images/layout-plan.png"
                  download="anurag-enclave-cad-layout.png"
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CAD Layout Plan</span>
                </a>
              </div>
            </div>

            {/* Location & Development Highlights */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Location & Value Advantages</span>
                </h4>
                <span className="text-[11px] text-amber-400/80 font-medium">Prime Enclave</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Direct ingress/egress off Chikkamagaluru–Kadur Highway.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>9.0m wide asphalt avenue frontages with street lighting and drainage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Walking proximity to the 48m Botanical Park and Civic Amenity site.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Immediate registration readiness with direct builder transparency.</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Sakrayapatna, Chikkamagaluru</span>
                <span className="text-emerald-400 font-semibold">Ready for Possession</span>
              </div>
            </div>
          </div>

          {/* Book Site Visit Form */}
          <div className="bg-gradient-to-br from-emerald-950/30 to-slate-950 p-6 rounded-2xl border border-emerald-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-white">Schedule an On-Site Visit to {plot.number}</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Inspect the physical demarcated boundary stones at Sakrayapatna and verify clear title deeds.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 w-fit">
                Priority Allocation
              </span>
            </div>

            {formSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                <h5 className="font-semibold text-emerald-300 text-sm">Site Visit Scheduled Successfully!</h5>
                <p className="text-xs text-slate-300">
                  Our Senior Relationship Manager will call you within 15 minutes with meeting details and confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
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
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />

                <input
                  type="tel"
                  required
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Confirming...' : 'Schedule Visit'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Star, ShieldCheck, Award, Users, CheckCircle } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Rajesh & Sneha Kulkarni',
      designation: 'Bangalore & Chikkamagaluru Resident',
      plot: 'Plot 12 (30×40 North-East Facing)',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      comment:
        'The interactive CAD site plan and survey sketch made selecting our plot effortless. The boundary stones in Sakrayapatna were physically marked, and our bank plot loan was sanctioned in just 6 business days with clean title documents.',
      rating: 5
    },
    {
      name: 'Dr. Anand Ramanathan',
      designation: 'Senior Medical Specialist',
      plot: 'Plot 15 (30×40 Park-Adjacent)',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      comment:
        'Finding a 100% sanctioned plotted layout with genuine 9.0-meter wide asphalt avenues, CA reservation, and eastern botanical park zone near Chikkamagaluru - Kadur Highway (SH-57) is outstanding.',
      rating: 5
    },
    {
      name: 'Vikram & Priya Malhotra',
      designation: 'NRI Investors (Singapore)',
      plot: 'Plot 03 & 04 (Dual 30×40 Plots)',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      comment:
        'Being overseas, transparency was our #1 priority. Anuragh Foundation provided clear DTCP approval documentation, registration assistance, and ground progress photos. Outstanding experience.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Trusted Plotted Community
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verified Plot Buyer Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Hear from families and investors who secured their dream plot at Anurag Enclave.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <img src={r.image} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                <div>
                  <h4 className="text-xs font-bold text-white">{r.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{r.designation}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold block">{r.plot}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Developer Trust Strip */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 p-6 rounded-3xl border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">500+</span>
            <span className="text-xs text-slate-400 mt-1 block">Plots Delivered On-Time</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block">100%</span>
            <span className="text-xs text-slate-400 mt-1 block">Clear Legal Titles</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block">4.9 / 5</span>
            <span className="text-xs text-slate-400 mt-1 block">Google Customer Rating</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-purple-400 block">15+ Yrs</span>
            <span className="text-xs text-slate-400 mt-1 block">Excellence in Plotted Realty</span>
          </div>
        </div>
      </div>
    </section>
  );
}

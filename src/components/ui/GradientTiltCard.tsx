'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  linkText?: string;
  linkHref?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function GradientTiltCard({
  title,
  subtitle,
  description,
  badge = 'Hot Deal',
  linkText = 'Explore Plot',
  linkHref = '/plots',
  icon,
  className = ''
}: Props) {
  return (
    <Link href={linkHref} className={`gradient-tilt-card group ${className}`}>
      {/* Default Front View: Icon + Subtle Badge */}
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
        {icon ? (
          icon
        ) : (
          <svg className="tilt-icon" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <span className="text-white font-black text-lg tracking-wide drop-shadow-md">
          {title}
        </span>
        {badge && (
          <span className="text-[10px] uppercase font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/30">
            {badge}
          </span>
        )}
      </div>

      {/* Hover Rotating Content Card (-45deg to 0deg) */}
      <div className="gradient-tilt-card__content">
        {subtitle && (
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            {subtitle}
          </span>
        )}
        <h4 className="gradient-tilt-card__title mt-0.5">{title}</h4>
        <p className="gradient-tilt-card__description">{description}</p>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
          <span>{linkText}</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShortlist } from '@/lib/useShortlist';
import BrandLogo from '@/components/ui/BrandLogo';
import SocialRedirectButtons from '@/components/ui/SocialRedirectButtons';
import MenuListButtons from '@/components/layout/MenuListButtons';
import { Heart, Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count: shortlistCount } = useShortlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full max-w-full overflow-x-clip transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-2.5'
          : 'bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-2 lg:gap-4 w-full">
          {/* Brand Logo with animated SVG */}
          <Link href="/" className="flex items-center group shrink-0">
            <BrandLogo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center">
            <MenuListButtons direction="row" />
          </nav>

          {/* Right Header Controls: Social Redirection + Shortlist + CTA */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Social / Phone / WhatsApp Redirection */}
            <SocialRedirectButtons className="!p-1 !gap-1 !bg-slate-900/90 border-slate-800" />

            {/* Shortlist Heart Button */}
            <Link
              href="/shortlist"
              className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
              title="View Shortlisted Plots"
            >
              <Heart className="w-4 h-4" />
              {shortlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md">
                  {shortlistCount}
                </span>
              )}
            </Link>

            {/* Book Site Visit CTA */}
            <Link
              href="/contact"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Site Visit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/shortlist"
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              <Heart className="w-4 h-4" />
              {shortlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                  {shortlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu with Animated Menu List Buttons */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-4 pb-6 space-y-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Navigation Menu
          </div>

          <MenuListButtons
            direction="col"
            className="w-full !gap-2 [&>.menu-btn]:!w-full [&>.menu-btn:hover>.icon]:!w-full"
            onItemClick={() => setMobileMenuOpen(false)}
          />

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            <SocialRedirectButtons className="w-full justify-center" />

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl text-sm shadow-lg shadow-emerald-500/20"
            >
              <span>Schedule an On-Site Visit</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

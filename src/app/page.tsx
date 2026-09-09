import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsCounter from '@/components/home/StatsCounter';
import Interactive3DTeaser from '@/components/home/Interactive3DTeaser';
import FeaturedDealsSection from '@/components/home/FeaturedDealsSection';
import AmenitiesShowcase from '@/components/home/AmenitiesShowcase';
import Testimonials from '@/components/home/Testimonials';
import SiteVisitBanner from '@/components/home/SiteVisitBanner';

import BrandIntroSplash from '@/components/ui/BrandIntroSplash';

export const metadata = {
  title: 'ANURAG ENCLAVE | Premium Villa Plots in Sakrayapatna, Chikkamagaluru by Anuragh Foundation',
  description: 'Sanctioned 39 residential villa plots (30x40 ft) across 2 Acres of land at Sakrayapatna, Kadur Taluk, close to Chikkamagaluru - Kadur Highway (SH-57).'
};

export default function HomePage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950">
      <BrandIntroSplash />
      <HeroSection />
      <StatsCounter />
      <Interactive3DTeaser />
      <FeaturedDealsSection />
      <AmenitiesShowcase />
      <Testimonials />
      <SiteVisitBanner />
    </main>
  );
}

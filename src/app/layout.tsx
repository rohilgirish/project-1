import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTA from '@/components/layout/StickyCTA';
import ExitIntentPopup from '@/components/home/ExitIntentPopup';
import ScrollToTop from '@/components/ui/ScrollToTop';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ANURAG ENCLAVE | Gated Villa Plots by Anuragh Foundation, Sakrayapatna, Chikkamagaluru',
  description: 'DTCP & Gram Panchayat approved residential plotted development in Sakrayapatna village, Kadur Taluk, Chikkamagaluru District. 2 Acres of land, 39 premium villa plots near Chikkamagaluru - Kadur Highway (SH-57).',
  keywords: [
    'Anurag Enclave',
    'Anuragh Foundation',
    'plots in sakrayapatna',
    'plots in kadur',
    'plots in chikkamagaluru',
    'luxury villa plots',
    '30x40 villa plots',
    'gated community karnataka'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased w-full max-w-full overflow-x-hidden`}>
      <body className="min-h-full w-full max-w-full overflow-x-hidden flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <div className="flex-1 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
        <Footer />
        <StickyCTA />
        <ExitIntentPopup />
        {/* Scroll To Top Button ("to goo to the top") */}
        <ScrollToTop />
      </body>
    </html>
  );
}

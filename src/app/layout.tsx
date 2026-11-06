import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTA from '@/components/layout/StickyCTA';
import ExitIntentPopup from '@/components/home/ExitIntentPopup';
import ScrollToTop from '@/components/ui/ScrollToTop';
import FloatingWhatsAppCTA from '@/components/ui/FloatingWhatsAppCTA';
import { Toaster } from 'sonner';


export const metadata: Metadata = {
  title: 'ANURAG ENCLAVE | Gated Villa Plots by Anuragh Foundation, Sakrayapatna, Chikkamagaluru',
  description: 'DC Converted & Grama Panchayat sanctioned residential plotted development in Sakrayapatna village, Kadur Taluk, Chikkamagaluru District. 2 Acres, 39 premium villa plots near SH-57 highway.',
  keywords: [
    'Anurag Enclave',
    'Anuragh Foundation',
    'plots in sakrayapatna',
    'plots in kadur',
    'plots in chikkamagaluru',
    'luxury villa plots',
    '30x40 villa plots',
    'gated community karnataka'
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://anuragenclave.com'),
  openGraph: {
    title: 'Anurag Enclave | Gated Villa Plots in Sakrayapatna, Chikkamagaluru',
    description: '39 Premium Villa Plots (30×40 ft) starting from ₹15.6 Lakhs. DC Converted & Grama Panchayat Sanctioned. 2 mins from SH-57.',
    url: 'https://anuragenclave.com',
    siteName: 'Anurag Enclave',
    images: [
      {
        url: '/images/layout-plan.png',
        width: 1200,
        height: 630,
        alt: 'Anurag Enclave Sakrayapatna Masterplan Layout',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anurag Enclave | Gated Villa Plots, Chikkamagaluru',
    description: '39 Premium Villa Plots from ₹15.6 Lakhs. DC Converted & Grama Panchayat Approved.',
    images: ['/images/layout-plan.png'],
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  name: 'Anurag Enclave Villa Plots',
  description: 'Gated residential plotted development with 39 villa plots (30x40 ft) in Sakrayapatna, Kadur Taluk, Chikkamagaluru District.',
  url: 'https://anuragenclave.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sakrayapatna Village, Near SH-57 Chikkamagaluru-Kadur Highway',
    addressLocality: 'Kadur Taluk',
    addressRegion: 'Karnataka',
    postalCode: '577135',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.431995,
    longitude: 75.917282,
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '1560000',
    highPrice: '1740000',
    offerCount: '39',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark antialiased w-full max-w-full overflow-x-hidden">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full w-full max-w-full overflow-x-hidden flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
        <Navbar />
        <div className="flex-1 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
        <Footer />
        <StickyCTA />
        <FloatingWhatsAppCTA />
        <ExitIntentPopup />
        {/* Scroll To Top Button */}
        <ScrollToTop />
        {/* Emil Kowalski's Sonner Toast Provider */}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#0f172a',
              border: '1px solid rgba(189, 159, 103, 0.3)',
              color: '#f8fafc',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            },
          }}
        />
      </body>
    </html>
  );
}

'use client';

import React from 'react';
import { Phone, MessageSquare, MapPin, Share2 } from 'lucide-react';
import { PROJECT_SPECS } from '@/data/landmarks';
import { getWhatsAppLink } from '@/lib/utils';

export default function SocialRedirectButtons({ className = '' }: { className?: string }) {
  const whatsAppUrl = getWhatsAppLink();

  return (
    <div className={`social-card ${className}`}>
      {/* Phone Call Redirection Button */}
      <a
        href={`tel:${PROJECT_SPECS.phone}`}
        className="socialBtn phone"
        title="Call Sales Desk Directly"
      >
        <div className="svgContainer">
          <Phone className="w-5 h-5 text-white" />
        </div>
        <div className="BG" />
      </a>

      {/* WhatsApp Redirection Button */}
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noreferrer"
        className="socialBtn whatsapp"
        title="Chat with Sales Concierge on WhatsApp"
      >
        <div className="svgContainer">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-10.416c-4.405 0-7.989 3.583-7.99 7.99 0 1.409.367 2.784 1.066 3.996l-1.134 4.143 4.241-1.113c1.172.64 2.496.978 3.818.978h.003c4.405 0 7.989-3.584 7.99-7.991.001-2.135-.828-4.141-2.339-5.654-1.512-1.512-3.518-2.343-5.655-2.343z" />
          </svg>
        </div>
        <div className="BG" />
      </a>

      {/* Location / Google Maps Redirection Button */}
      <a
        href={PROJECT_SPECS.googleMapsUrl}
        target="_blank"
        rel="noreferrer"
        className="socialBtn map"
        title="Get Directions on Google Maps"
      >
        <div className="svgContainer">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div className="BG" />
      </a>
    </div>
  );
}

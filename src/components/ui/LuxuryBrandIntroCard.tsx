'use client';

import React from 'react';

interface Props {
  className?: string;
  subtitle?: string;
  badge?: string;
  isActive?: boolean;
  size?: 'default' | 'large';
}

export default function LuxuryBrandIntroCard({
  className = '',
  subtitle = 'CHIKKAMAGALURU',
  badge = 'SAKRAYAPATNA • CHIKKAMAGALURU',
  isActive = false,
  size = 'default'
}: Props) {
  const isLarge = size === 'large';

  return (
    <div
      className={`luxury-intro-card ${isLarge ? 'card-lg' : ''} group ${
        isActive ? 'active' : ''
      } ${className}`}
    >
      {/* Animated Gold Border that snaps on hover */}
      <div className="card-border" />

      {/* Bottom Gold Label Over Border */}
      <div className="bottom-text">{badge}</div>

      {/* Centered Content with Official Logo & Typography Reveal */}
      <div className="content">
        <div className="logo">
          {/* Logo 1: Official Emblem */}
          <div className="logo1 flex items-center justify-center">
            <img
              src="/images/logo-gold.png"
              alt="Anuragh Foundation Crest"
              className={`${
                isLarge ? 'h-11 sm:h-16' : 'h-9'
              } w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(189,159,103,0.5)]`}
            />
          </div>

          {/* Logo 2: "ANURAG" Wordmark Typography revealed on expand */}
          <div className="logo2">
            <svg
              viewBox="0 0 130 33"
              className={isLarge ? 'w-40 sm:w-56 h-11 sm:h-16' : 'w-28 h-8'}
            >
              <text
                x="0"
                y="22"
                fill="#bd9f67"
                fontFamily="Georgia, serif"
                fontSize="17"
                fontWeight="bold"
                letterSpacing="2.5"
              >
                ANURAG
              </text>
            </svg>
          </div>

          {/* Golden sweep trail animation */}
          <div className="trail" />
        </div>

        {/* Subtitle that fades in and expands letter-spacing */}
        <div className="logo-bottom-text">
          ENCLAVE
        </div>
      </div>
    </div>
  );
}

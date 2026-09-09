'use client';

import React from 'react';

interface Props {
  keyword?: string;
  className?: string;
}

export default function SearchPlotLoader({ keyword = 'SEARCHING', className = '' }: Props) {
  const letters = (keyword || 'SEARCHING').split('');

  return (
    <div className={`search-loader-container ${className}`}>
      {/* Honeycomb Socket Grid */}
      <div className="honeycomb-socket">
        <div className="gel center-gel">
          <div className="hex-brick" />
          <div className="hex-brick h2" />
          <div className="hex-brick h3" />
        </div>
        <div className="gel c1 r1">
          <div className="hex-brick" />
          <div className="hex-brick h2" />
          <div className="hex-brick h3" />
        </div>
        <div className="gel c2 r1">
          <div className="hex-brick" />
          <div className="hex-brick h2" />
          <div className="hex-brick h3" />
        </div>
        <div className="gel c3 r2">
          <div className="hex-brick" />
          <div className="hex-brick h2" />
          <div className="hex-brick h3" />
        </div>
        <div className="gel c4 r2">
          <div className="hex-brick" />
          <div className="hex-brick h2" />
          <div className="hex-brick h3" />
        </div>
        <div className="gel c5 r3">
          <div className="hex-brick" />
          <div className="hex-brick h2" />
          <div className="hex-brick h3" />
        </div>
        <div className="gel c6 r3">
          <div className="hex-brick" />
          <div className="hex-brick h2" />
          <div className="hex-brick h3" />
        </div>
      </div>

      {/* Rotating Ring + Bouncing Wave Letters */}
      <div className="loader-wrapper">
        <div className="search-ring-loader" />
        <div className="letter-wrapper">
          {letters.map((char, i) => (
            <span key={i} className="loader-letter">
              {char}
            </span>
          ))}
          <span className="loader-letter">.</span>
          <span className="loader-letter">.</span>
          <span className="loader-letter">.</span>
        </div>
      </div>
    </div>
  );
}

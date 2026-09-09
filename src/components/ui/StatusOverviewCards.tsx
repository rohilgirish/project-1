'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  availableCount?: number;
  reservedCount?: number;
  soldCount?: number;
  onSelectStatus?: (status: 'available' | 'reserved' | 'sold') => void;
  className?: string;
}

export default function StatusOverviewCards({
  availableCount = 38,
  reservedCount = 14,
  soldCount = 68,
  onSelectStatus,
  className = ''
}: Props) {
  const router = useRouter();

  const handleClick = (status: 'available' | 'reserved' | 'sold') => {
    if (onSelectStatus) {
      onSelectStatus(status);
    } else {
      router.push(`/plots?status=${status}`);
    }
  };

  return (
    <div className={`status-cards ${className}`}>
      {/* Green = Available */}
      <div
        className="status-card green"
        onClick={() => handleClick('available')}
        title="Click to view all available plots"
      >
        <p className="tip">{availableCount} AVAILABLE</p>
        <p className="second-text">Ready for Immediate Booking</p>
      </div>

      {/* Blue = Booked / Reserved */}
      <div
        className="status-card blue"
        onClick={() => handleClick('reserved')}
        title="Click to view booked / reserved plots"
      >
        <p className="tip">{reservedCount} BOOKED</p>
        <p className="second-text">Token Advance Received</p>
      </div>

      {/* Red = Sold */}
      <div
        className="status-card red"
        onClick={() => handleClick('sold')}
        title="Click to view sold plots"
      >
        <p className="tip">{soldCount} SOLD OUT</p>
        <p className="second-text">Registered A-Khata Titles</p>
      </div>
    </div>
  );
}

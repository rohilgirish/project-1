import React from 'react';
import TruckLoader from '@/components/ui/TruckLoader';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
      <TruckLoader
        message="Loading Anurag Enclave Layout..."
        subMessage="Preparing real-time 3D models, Sakrayapatna CAD inventory & GPS coordinates"
      />
    </div>
  );
}

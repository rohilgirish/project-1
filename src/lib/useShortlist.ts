'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'horizon_shortlisted_plots';

export function useShortlist() {
  const [shortlist, setShortlist] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setShortlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load shortlist', e);
    }
    setIsLoaded(true);
  }, []);

  const togglePlot = (plotId: number) => {
    setShortlist(prev => {
      let updated: number[];
      if (prev.includes(plotId)) {
        updated = prev.filter(id => id !== plotId);
      } else {
        updated = [...prev, plotId];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const isShortlisted = (plotId: number) => shortlist.includes(plotId);

  const clearShortlist = () => {
    setShortlist([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    shortlist,
    isLoaded,
    togglePlot,
    isShortlisted,
    clearShortlist,
    count: shortlist.length
  };
}

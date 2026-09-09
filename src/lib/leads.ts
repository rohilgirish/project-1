import { Lead } from '@/types';

export async function submitLead(leadData: Omit<Lead, 'id' | 'createdAt'>): Promise<{ success: boolean; lead: Lead }> {
  const lead: Lead = {
    id: Date.now().toString(),
    ...leadData,
    createdAt: new Date().toISOString()
  };

  // 1. Always save to localStorage as immediate backup & local UI state
  try {
    if (typeof window !== 'undefined') {
      const existing: Lead[] = JSON.parse(localStorage.getItem('horizon_leads') || '[]');
      existing.unshift(lead);
      localStorage.setItem('horizon_leads', JSON.stringify(existing));
    }
  } catch (err) {
    console.warn('LocalStorage save skipped:', err);
  }

  // 2. Post to /api/leads to persist into Supabase cloud database
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, lead: data.lead || lead };
    }
  } catch (err) {
    console.warn('Cloud database sync error (saved locally):', err);
  }

  return { success: true, lead };
}

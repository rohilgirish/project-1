import { Lead } from '@/types';
import { toast } from 'sonner';

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
      toast.success('Inquiry Recorded Successfully', {
        description: `Thank you ${lead.fullName}! Our land specialist has received your request.`,
        duration: 4000,
      });
      return { success: true, lead: data.lead || lead };
    }
  } catch (err) {
    console.warn('Cloud database sync error (saved locally):', err);
  }

  toast.success('Request Received', {
    description: `Thank you ${lead.fullName}! We will contact you at ${lead.phone}.`,
    duration: 4000,
  });

  return { success: true, lead };
}

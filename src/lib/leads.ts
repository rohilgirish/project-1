import { Lead } from '@/types';
import { toast } from 'sonner';
import { isValidPhone, isValidEmail } from './security';

export interface SubmitLeadOptions extends Omit<Lead, 'id' | 'createdAt'> {
  website_url_check?: string; // Honeypot trap field
  turnstileToken?: string;
}

export async function submitLead(
  leadData: SubmitLeadOptions
): Promise<{ success: boolean; lead: Lead; downloadToken?: string; error?: string }> {
  // Client-side quick validation guard
  if (!isValidPhone(leadData.phone)) {
    toast.error('Invalid Phone Number', {
      description: 'Please enter a valid 10-digit mobile number.',
      duration: 4000,
    });
    return {
      success: false,
      lead: { id: '', ...leadData, createdAt: new Date().toISOString() },
      error: 'Invalid phone number',
    };
  }

  if (leadData.email && !isValidEmail(leadData.email)) {
    toast.error('Invalid Email Address', {
      description: 'Please enter a valid email address or leave blank.',
      duration: 4000,
    });
    return {
      success: false,
      lead: { id: '', ...leadData, createdAt: new Date().toISOString() },
      error: 'Invalid email',
    };
  }

  // Auto-capture UTM from URL / sessionStorage if available
  let autoUtm = leadData.utmSource || '';
  if (!autoUtm && typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      autoUtm = urlParams.get('utm_source') || sessionStorage.getItem('anurag_utm_source') || '';
    } catch {
      // ignore
    }
  }

  const lead: Lead = {
    id: Date.now().toString(),
    fullName: leadData.fullName,
    phone: leadData.phone,
    email: leadData.email || '',
    preferredDate: leadData.preferredDate || '',
    plotNumber: leadData.plotNumber || '',
    type: leadData.type || 'enquiry',
    budget: leadData.budget || '',
    utmSource: autoUtm,
    dpdpConsent: leadData.dpdpConsent === true,
    createdAt: new Date().toISOString(),
  };

  // 1. Post to secure /api/leads endpoint
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...lead,
        website_url_check: leadData.website_url_check || '',
        turnstileToken: leadData.turnstileToken || '',
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 429) {
        toast.error('Rate Limit Reached', {
          description: data.error || 'Too many submissions. Please wait a few moments.',
          duration: 5000,
        });
        return { success: false, lead, error: data.error || 'Rate limit reached' };
      }

      if (res.status === 503) {
        toast.error('Database Sync Issue', {
          description: data.error || 'Inquiry could not be saved to our CRM. Please message our sales desk directly on WhatsApp at +91 98860 12345.',
          duration: 6000,
        });
        return { success: false, lead, error: data.error || 'Service unavailable' };
      }

      toast.error('Submission Error', {
        description: data.error || 'Unable to record your inquiry. Please reach our sales desk directly on WhatsApp at +91 98860 12345.',
        duration: 5000,
      });
      return { success: false, lead, error: data.error || 'Submission failed' };
    }

    // 2. Save to client localStorage as fast session cache
    try {
      if (typeof window !== 'undefined') {
        const existing: Lead[] = JSON.parse(localStorage.getItem('anurag_leads') || '[]');
        existing.unshift(data.lead || lead);
        localStorage.setItem('anurag_leads', JSON.stringify(existing.slice(0, 50)));
      }
    } catch (err) {
      console.warn('LocalStorage save skipped:', err);
    }

    toast.success('Inquiry Recorded Successfully', {
      description: `Thank you ${lead.fullName}! Our land specialist has received your request.`,
      duration: 4000,
    });

    return { success: true, lead: data.lead || lead, downloadToken: data.downloadToken };
  } catch (err) {
    console.error('Lead submission network failure:', err);

    toast.error('Unable to Save Inquiry', {
      description: 'Could not connect to the server. Please reach us directly on WhatsApp at +91 98860 12345.',
      duration: 6000,
    });

    return {
      success: false,
      lead,
      error: 'Network connectivity error. Please connect directly via WhatsApp: +91 98860 12345.',
    };
  }
}

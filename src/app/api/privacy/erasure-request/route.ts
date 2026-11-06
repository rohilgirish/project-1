import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { sanitizeString, isValidPhone, validateRequestOrigin } from '@/lib/security';
import { getTrustedClientIp, checkRateLimitAsync } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    if (!validateRequestOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
    }

    const clientIp = getTrustedClientIp(request);
    const rateCheck = await checkRateLimitAsync(`erasure-req-${clientIp}`, 3, 60 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const phone = sanitizeString(body.phone, 20);
    const fullName = sanitizeString(body.fullName, 80);
    const reason = sanitizeString(body.reason, 500);

    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number associated with your inquiry.' },
        { status: 400 }
      );
    }

    console.info(`[Audit/DPDP] Public erasure request submitted for phone ${phone.slice(0, 4)}XXXX from IP: ${clientIp} at ${new Date().toISOString()}`);

    // If Supabase is configured, delete or mark the records associated with this phone
    const dbAdmin = getSupabaseAdmin();
    let recordsPurged = 0;

    if (dbAdmin && isSupabaseConfigured()) {
      const { data } = await dbAdmin.from('leads').select('id').eq('phone', phone);
      if (data && data.length > 0) {
        recordsPurged = data.length;
        await dbAdmin.from('leads').delete().eq('phone', phone);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your personal data erasure request has been processed under the Digital Personal Data Protection (DPDP) Act 2023. Our Grievance Officer will confirm full purging within our 30-day statutory SLA.',
      recordsPurged,
    });
  } catch (error) {
    console.error('[Privacy/Erasure] Error processing erasure request:', error);
    return NextResponse.json(
      { error: 'Unable to process erasure request at this moment. Please try again shortly.' },
      { status: 500 }
    );
  }
}


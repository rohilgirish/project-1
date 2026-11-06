import { NextResponse, after } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import {
  sanitizeString,
  isValidPhone,
  isValidEmail,
  isHoneypotTriggered,
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
  validateRequestOrigin,
  verifyTurnstileToken,
  generateBlueprintDownloadToken,
} from '@/lib/security';
import { getTrustedClientIp, checkRateLimitAsync } from '@/lib/rate-limit';

const IS_PROD = process.env.NODE_ENV === 'production';

// Admin auth: signed, expiring session cookie only. The static Bearer token path is removed.
function checkAdminAuth(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`));
  if (!match) return false;
  try {
    return verifyAdminSessionToken(decodeURIComponent(match[1]));
  } catch {
    return false;
  }
}

// Keep the last 10 digits so "+91 98860 12345", "098860 12345" and "9886012345" match.
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

type AlertLead = {
  fullName: string;
  phone: string;
  plotNumber?: string;
  preferredDate?: string;
  type?: string;
  inquiryCount?: number;
  dbSaved: boolean;
};

// Plain text on purpose: Telegram's Markdown mode rejects names containing * _ ` and returns 400.
async function sendInstantLeadAlert(lead: AlertLead) {
  const webhookUrl = process.env.LEAD_ALERT_WEBHOOK_URL;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!webhookUrl && (!botToken || !chatId)) return;

  const text = [
    lead.dbSaved ? 'New Anurag Enclave lead' : 'LEAD NOT SAVED TO DATABASE - follow up manually',
    `Name: ${lead.fullName}`,
    `Phone: ${lead.phone}`,
    `Plot: ${lead.plotNumber || 'General layout'}`,
    `Visit: ${lead.preferredDate || 'Not specified'}`,
    `Source: ${lead.type || 'enquiry'}`,
    `Submissions: ${lead.inquiryCount || 1}`,
  ].join('\n');

  const post = async (label: string, url: string, payload: unknown) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000),
      });
      // fetch does not throw on 4xx/5xx, so check explicitly.
      if (!res.ok) console.error(`[Alert/${label}] failed with status ${res.status}`);
    } catch (err) {
      console.error(`[Alert/${label}] request error:`, err);
    }
  };

  if (webhookUrl) await post('webhook', webhookUrl, { text, content: text });
  if (botToken && chatId) {
    await post('telegram', `https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text,
    });
  }
}

export async function POST(request: Request) {
  try {
    if (!validateRequestOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
    }

    const clientIp = getTrustedClientIp(request);
    const rate = await checkRateLimitAsync(`lead-post-${clientIp}`, 5, 10 * 60 * 1000);
    if (!rate.success) {
      return NextResponse.json(
        { error: `Too many submissions. Please wait ${rate.resetSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rate.resetSeconds) } }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const turnstileToken = body['cf-turnstile-response'] || body.turnstileToken;
    if (!(await verifyTurnstileToken(turnstileToken, clientIp))) {
      return NextResponse.json(
        { error: 'Security challenge failed. Please refresh and try again.' },
        { status: 403 }
      );
    }

    // Honeypot: pretend success, save nothing, alert nobody.
    if (isHoneypotTriggered(body as Record<string, unknown>)) {
      return NextResponse.json({ success: true, supabaseSynced: false }, { status: 201 });
    }

    // Consent must be an explicit true. A missing field is NOT consent.
    if (body.dpdpConsent !== true) {
      return NextResponse.json(
        { error: 'Please accept the privacy consent to continue under DPDP Act 2023.' },
        { status: 400 }
      );
    }

    if (IS_PROD && !isSupabaseConfigured()) {
      console.error('[CRITICAL] Lead blocked: Supabase is not configured in production.');
      return NextResponse.json(
        { error: 'We could not save your request. Please contact our sales desk on WhatsApp or phone.' },
        { status: 503 }
      );
    }

    const fullName = sanitizeString(body.fullName || body.name, 80);
    const phone = normalizePhone(sanitizeString(body.phone, 20) || '');
    const email = sanitizeString(body.email, 120);
    const preferredDate = sanitizeString(body.preferredDate || body.visitDate, 30);
    const plotNumber = sanitizeString(body.plotNumber || body.plotSize, 30);
    const type = sanitizeString(body.type || 'enquiry', 30);
    const budget = sanitizeString(body.budget, 50);
    const utmSource = sanitizeString(body.utmSource || body.utm_source, 60);

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: 'Please enter a valid full name.' }, { status: 400 });
    }
    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    let dbSaved = false;
    let inquiryCount = 1;
    const now = new Date().toISOString();

    const db = getSupabaseAdmin();
    if (db) {
      try {
        // Insert first. The unique index on phone makes this race-safe: if two requests
        // arrive together, one insert wins and the other falls into the update branch.
        const { error: insertError } = await db.from('leads').insert([
          {
            full_name: fullName,
            phone,
            email: email || '',
            preferred_date: preferredDate || '',
            plot_number: plotNumber || '',
            type,
            budget: budget || '',
            status: 'new',
            notes: '',
            utm_source: utmSource || '',
            inquiry_count: 1,
            dpdp_consent: true,
            created_at: now,
          },
        ]);

        if (!insertError) {
          dbSaved = true;
        } else if (insertError.code === '23505') {
          // Existing lead: bump the counter atomically in SQL (see leads-hardening.sql).
          const { data, error: rpcError } = await db.rpc('bump_lead_inquiry', {
            p_phone: phone,
            p_type: type,
            p_plot: plotNumber || null,
            p_date: preferredDate || null,
          });
          if (!rpcError) {
            dbSaved = true;
            inquiryCount = Number(data) || 2;
          } else {
            console.error('[DB] bump_lead_inquiry failed:', rpcError.message);
          }
        } else {
          console.error('[DB] insert failed:', insertError.message);
        }
      } catch (err) {
        console.error('[DB] Supabase error:', err);
      }
    }

    // Always alert, even when the save failed, so the sales team still sees the lead.
    after(async () => {
      await sendInstantLeadAlert({ fullName, phone, plotNumber, preferredDate, type, inquiryCount, dbSaved });
    });

    // In production a failed write must not look like success.
    if (IS_PROD && !dbSaved) {
      return NextResponse.json(
        { error: 'We could not save your request. Please contact our sales desk on WhatsApp or phone.' },
        { status: 503 }
      );
    }

    const downloadToken =
      type === 'blueprint_download' || type === 'brochure'
        ? generateBlueprintDownloadToken(phone)
        : undefined;

    // Minimal response: no lead id, no counts, so nobody can probe whether a number is in the CRM.
    return NextResponse.json({ success: true, downloadToken }, { status: 201 });
  } catch (error) {
    console.error('[API] Unexpected error in POST /api/leads:', error);
    return NextResponse.json(
      { error: 'Unable to process your request right now. Please try again shortly.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const clientIp = getTrustedClientIp(request);

    // 1. Rate limiting on GET to prevent data-scraping probes
    const rateCheck = await checkRateLimitAsync(`lead-get-${clientIp}`, 40, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    // 2. Authentication Check: Require valid signed session cookie
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Valid administrative session required to access customer leads.'
        },
        { status: 401 }
      );
    }

    // 3. Authorized access granted - fetch leads with privileged service-role key
    const dbAdmin = getSupabaseAdmin();
    if (dbAdmin && isSupabaseConfigured()) {
      const { data, error } = await dbAdmin
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Security/DB] Supabase fetch error:', error.message);
        return NextResponse.json(
          { success: false, error: 'Database service unavailable' },
          { status: 500 }
        );
      }

      // Format and sanitize snake_case from Postgres to camelCase for the frontend
      const mapped = (data || []).map((row: Record<string, unknown>) => ({
        id: String(row.id || ''),
        fullName: sanitizeString(row.full_name || row.fullName || '', 80),
        phone: sanitizeString(row.phone || '', 20),
        email: sanitizeString(row.email || '', 120),
        preferredDate: sanitizeString(row.preferred_date || row.preferredDate || '', 30),
        plotNumber: sanitizeString(row.plot_number || row.plotNumber || '', 30),
        type: sanitizeString(row.type || 'enquiry', 30),
        budget: sanitizeString(row.budget || '', 50),
        status: (sanitizeString(row.status || 'new', 20) || 'new') as any,
        notes: sanitizeString(row.notes || '', 1000),
        utmSource: sanitizeString(row.utm_source || row.utmSource || '', 60),
        inquiryCount: typeof row.inquiry_count === 'number' ? row.inquiry_count : 1,
        followUpDate: sanitizeString(row.follow_up_date || '', 30),
        dpdpConsent: row.dpdp_consent !== false,
        createdAt: String(row.created_at || row.createdAt || new Date().toISOString())
      }));

      return NextResponse.json({
        success: true,
        source: 'supabase',
        leads: mapped
      });
    }

    return NextResponse.json({
      success: true,
      source: 'local_mode',
      leads: [],
      message: 'Supabase credentials not configured; falling back to local storage.'
    });
  } catch (error) {
    console.error('[Security/API] Unexpected error in GET /api/leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!validateRequestOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
    }

    const clientIp = getTrustedClientIp(request);
    const rateCheck = await checkRateLimitAsync(`lead-patch-${clientIp}`, 40, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many updates.' }, { status: 429 });
    }

    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Lead id is required' }, { status: 400 });
    }

    const id = String(body.id);
    const status = sanitizeString(body.status, 25);
    const notes = sanitizeString(body.notes, 1000);
    const followUpDate = sanitizeString(body.followUpDate, 30);

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (status) updatePayload.status = status;
    if (typeof body.notes === 'string') updatePayload.notes = notes;
    if (typeof body.followUpDate === 'string') updatePayload.follow_up_date = followUpDate;

    const dbAdmin = getSupabaseAdmin();
    if (dbAdmin && isSupabaseConfigured()) {
      const { error } = await dbAdmin
        .from('leads')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        console.error('[Security/DB] Supabase lead update error:', error.message);
        return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
      }
    }

    console.info(`[Audit/CRM] Lead ${id} updated by Admin IP: ${clientIp} at ${new Date().toISOString()}`);

    return NextResponse.json({ success: true, updated: { id, ...updatePayload } });
  } catch (error) {
    console.error('[Security/API] Error in PATCH /api/leads:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!validateRequestOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
    }

    const clientIp = getTrustedClientIp(request);
    const rateCheck = await checkRateLimitAsync(`lead-delete-${clientIp}`, 20, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many delete requests.' }, { status: 429 });
    }

    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Lead id is required' }, { status: 400 });
    }

    const id = String(body.id);
    const dbAdmin = getSupabaseAdmin();

    if (dbAdmin && isSupabaseConfigured()) {
      const { error } = await dbAdmin
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Security/DB] Supabase lead deletion error:', error.message);
        return NextResponse.json({ success: false, error: 'Database deletion failed' }, { status: 500 });
      }
    }

    console.info(`[Audit/CRM] Lead ${id} permanently deleted by Admin IP: ${clientIp} at ${new Date().toISOString()}`);

    return NextResponse.json({ success: true, deleted: id });
  } catch (error) {
    console.error('[Security/API] Error in DELETE /api/leads:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}

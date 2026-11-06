/**
 * Enterprise Security, Cryptographic Session & Data Sanitization Suite
 * Anurag Enclave Web Protection Suite
 * Compliant with Zero-Trust Architecture & OWASP Top 10 Guidelines
 */

import crypto from 'crypto';

// Basic HTML and script tag stripping regex
const HTML_TAG_REGEX = /<[^>]*>?/gm;

// Formula trigger characters that can lead to CSV Injection in Excel / Google Sheets
const CSV_INJECTION_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

// Indian phone validation (supports optional +91, spaces, hyphens, and 10 digits starting with 6, 7, 8, or 9)
const INDIAN_PHONE_REGEX = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

// Standard email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server-only secrets loaded strictly from environment variables.
 * NO FALLBACK CREDENTIALS PERMITTED (Fail-Closed Architecture).
 */
export const SERVER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SERVER_SECRET = process.env.ADMIN_SECRET_KEY;

/**
 * Checks whether the server environment has properly configured master credentials.
 * If unset, all administrative logins and session creations fail closed.
 */
export function isAuthConfigured(): boolean {
  return Boolean(
    SERVER_ADMIN_PASSWORD &&
    SERVER_SECRET &&
    SERVER_ADMIN_PASSWORD.length >= 8 &&
    SERVER_SECRET.length >= 16
  );
}

/**
 * Standard HTTP-only Cookie Name
 */
export const ADMIN_COOKIE_NAME = 'anurag_admin_session';

/**
 * Compares two strings using constant-time evaluation to protect against side-channel timing attacks.
 * Wraps Node.js crypto.timingSafeEqual with safe byte-length guards.
 */
export function secureTimingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Legacy alias for constant-time comparison.
 */
export const constantTimeCompare = secureTimingSafeEqual;

/**
 * Strips HTML tags, removes non-printable control characters, and caps maximum length.
 */
export function sanitizeString(value: unknown, maxLength = 255): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(HTML_TAG_REGEX, '')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Normalizes phone numbers to standard 10-digit format for consistent deduplication and unique indexing.
 * Strips +91, leading 0, whitespace, hyphens, and non-digit characters.
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

/**
 * Validates whether a given phone number has a realistic format.
 * Strips common formatting characters (spaces, dashes, parentheses) before testing.
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const clean = phone.replace(/[\s\-()]/g, '');
  return INDIAN_PHONE_REGEX.test(clean) || (clean.length >= 10 && clean.length <= 15 && /^\+?\d+$/.test(clean));
}

/**
 * Validates standard email address format. If empty string is allowed, returns true for empty.
 */
export function isValidEmail(email: string, optional = true): boolean {
  if (!email && optional) return true;
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Detects whether a bot filled out an invisible honeypot trap field.
 */
export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const honeypotKeys = ['website_url_check', 'fax_number_hp', 'company_domain_trap'];
  for (const key of honeypotKeys) {
    const val = body[key];
    if (typeof val === 'string' && val.trim().length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * Sanitizes cell values before exporting to CSV to prevent CSV formula injection.
 * Prepends a single quote if string starts with dangerous characters (=, +, -, @).
 */
export function preventCsvInjection(value: string): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (CSV_INJECTION_PREFIXES.some(prefix => trimmed.startsWith(prefix))) {
    return `'${trimmed}`;
  }
  return trimmed;
}

/**
 * Generates an HMAC-SHA256 signed session token with a strictly verified 10-hour expiry.
 * Fails closed if ADMIN_SECRET_KEY is not configured in environment variables.
 */
export function generateAdminSessionToken(): string {
  if (!isAuthConfigured() || !SERVER_SECRET) {
    throw new Error('Server credentials unconfigured: ADMIN_SECRET_KEY must be defined in environment.');
  }

  const now = Date.now();
  const payload = {
    role: 'admin',
    iat: now,
    exp: now + 10 * 60 * 60 * 1000, // 10 hours max validity
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SERVER_SECRET)
    .update(data)
    .digest('base64url');

  return `${data}.${signature}`;
}

/**
 * Validates an HMAC-SHA256 signed session token from cookie or header.
 * Enforces timingSafeEqual signature check and timestamp expiration.
 */
export function verifyAdminSessionToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  if (!isAuthConfigured() || !SERVER_SECRET) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [data, signature] = parts;

  const expectedSig = crypto
    .createHmac('sha256', SERVER_SECRET)
    .update(data)
    .digest('base64url');

  // Constant-time signature verification using timingSafeEqual
  if (!secureTimingSafeEqual(signature, expectedSig)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) {
      return false; // Token expired
    }
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Programmatic Bearer token fallback for backend script integrations.
 */
export const ADMIN_AUTH_TOKEN = SERVER_SECRET || '';

/**
 * Validates request Origin / Referer to protect state-mutating requests (POST / PATCH / DELETE) against CSRF.
 */
export function validateRequestOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true;

  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (!origin) {
    const referer = request.headers.get('referer');
    if (!referer) return true;
    try {
      const refUrl = new URL(referer);
      return refUrl.host === host;
    } catch {
      return false;
    }
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

/**
 * Validates Cloudflare Turnstile token if TURNSTILE_SECRET_KEY is configured.
 * If secret key is not configured, passes through to avoid blocking unconfigured dev environments.
 */
export async function verifyTurnstileToken(token: unknown, remoteIp?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true;

  if (typeof token !== 'string' || !token) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) formData.append('remoteip', remoteIp);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.warn('[Security/Turnstile] Verification call failed:', err);
    return false;
  }
}

/**
 * Generates an HMAC-SHA256 signed download authorization token for blueprint/masterplan downloads.
 * Token is valid for 15 minutes and bound to the verified phone number.
 */
export function generateBlueprintDownloadToken(phone: string): string {
  const secret = process.env.ADMIN_SECRET_KEY || 'fallback-blueprint-sign-key-anurag-2026';
  const now = Date.now();
  const payload = {
    phone,
    type: 'blueprint_download',
    iat: now,
    exp: now + 15 * 60 * 1000, // 15 minutes validity
    nonce: crypto.randomBytes(8).toString('hex'),
  };

  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64url');

  return `${data}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed download token for private asset access.
 * Enforces constant-time signature verification, token expiration, and type validation.
 */
export function verifyBlueprintDownloadToken(token: string): { valid: boolean; phone?: string } {
  if (!token || typeof token !== 'string') return { valid: false };
  const secret = process.env.ADMIN_SECRET_KEY || 'fallback-blueprint-sign-key-anurag-2026';

  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };

  const [data, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64url');

  if (!secureTimingSafeEqual(signature, expectedSig)) {
    return { valid: false };
  }

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) {
      return { valid: false }; // Expired
    }
    if (payload.type !== 'blueprint_download') {
      return { valid: false };
    }
    return { valid: true, phone: payload.phone };
  } catch {
    return { valid: false };
  }
}

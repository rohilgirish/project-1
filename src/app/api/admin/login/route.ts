import { NextResponse } from 'next/server';
import {
  constantTimeCompare,
  generateAdminSessionToken,
  ADMIN_COOKIE_NAME,
  SERVER_ADMIN_PASSWORD,
  isAuthConfigured,
  validateRequestOrigin,
} from '@/lib/security';
import { getTrustedClientIp, checkRateLimitAsync } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // 1. CSRF Origin Verification
    if (!validateRequestOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
    }

    const clientIp = getTrustedClientIp(request);

    // 2. Fail Closed: If environment variables are unset, refuse all logins immediately
    if (!isAuthConfigured() || !SERVER_ADMIN_PASSWORD) {
      console.error(`[Audit/Auth] Login rejected: ADMIN_PASSWORD or ADMIN_SECRET_KEY unset in environment. Failing closed.`);
      return NextResponse.json(
        {
          success: false,
          error: 'Administrative authentication is disabled. The server administrator must configure ADMIN_PASSWORD and ADMIN_SECRET_KEY in the server environment.',
        },
        { status: 503 }
      );
    }

    // 3. Distributed Rate Limiting: 5 login attempts per 15 minutes per IP (Fails closed if Redis configured but down)
    const rateCheck = await checkRateLimitAsync(`admin-login-${clientIp}`, 5, 15 * 60 * 1000, {
      failClosedOnRedisError: true,
    });
    if (!rateCheck.success) {
      console.warn(`[Audit/Auth] Rate limit triggered for IP ${clientIp}. Remaining wait: ${rateCheck.resetSeconds}s`);
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please wait ${rateCheck.resetSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.resetSeconds) },
        }
      );
    }

    const body = await request.json().catch(() => null);
    const password = typeof body?.password === 'string' ? body.password.trim() : '';

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Master administrative passcode is required.' },
        { status: 400 }
      );
    }

    // 4. Constant-time signature comparison against server password
    const isPasswordValid = constantTimeCompare(password, SERVER_ADMIN_PASSWORD);

    if (!isPasswordValid) {
      console.warn(`[Audit/Auth] Failed admin authentication attempt from IP: ${clientIp} at ${new Date().toISOString()}`);
      return NextResponse.json(
        { success: false, error: 'Invalid master passcode. Access denied.' },
        { status: 401 }
      );
    }

    // 5. Generate signed HMAC-SHA256 session token with verified 10-hour expiry
    const sessionToken = generateAdminSessionToken();

    console.info(`[Audit/Auth] Successful admin session established from IP: ${clientIp} at ${new Date().toISOString()}`);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin console authenticated successfully.',
        token: sessionToken,
      },
      { status: 200 }
    );

    // Set secure httpOnly cookie (unreachable via JavaScript document.cookie)
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 10 * 60 * 60, // 10 hours
    });

    return response;
  } catch (error) {
    console.error('[Admin/Auth] Error during login:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service temporarily unavailable.' },
      { status: 500 }
    );
  }
}

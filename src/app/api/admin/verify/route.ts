import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  verifyAdminSessionToken,
  ADMIN_COOKIE_NAME,
  constantTimeCompare,
  ADMIN_AUTH_TOKEN
} from '@/lib/security';

export async function GET(request: Request) {
  try {
    // 1. Check httpOnly cookie
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (cookieToken && verifyAdminSessionToken(cookieToken)) {
      return NextResponse.json({ authenticated: true, method: 'cookie' });
    }

    // 2. Fallback check Authorization header (Bearer)
    const authHeader = request.headers.get('authorization') || '';
    const headerToken = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (headerToken) {
      if (verifyAdminSessionToken(headerToken) || constantTimeCompare(headerToken, ADMIN_AUTH_TOKEN)) {
        return NextResponse.json({ authenticated: true, method: 'header' });
      }
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}


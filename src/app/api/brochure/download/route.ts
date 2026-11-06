// src/app/api/brochure/download/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifyBlueprintDownloadToken } from '@/lib/security';
import { getTrustedClientIp, checkRateLimitAsync } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Put your real brochure PDF here (pricing, specs, approvals). Keep it OUTSIDE public/.
const FILE_NAME = 'anurag-enclave-masterplan-cad.png';
const DOWNLOAD_NAME = 'Anurag-Enclave-Masterplan.png';

export async function GET(request: Request) {
  try {
    const clientIp = getTrustedClientIp(request);
    const rate = await checkRateLimitAsync(`brochure-download-${clientIp}`, 10, 5 * 60 * 1000);
    if (!rate.success) {
      return NextResponse.json({ error: 'Too many download requests. Try again in a few minutes.' }, { status: 429 });
    }

    const token = new URL(request.url).searchParams.get('token');
    if (!token || !verifyBlueprintDownloadToken(token).valid) {
      return NextResponse.json(
        { error: 'Download link missing or expired. Please request a new one.' },
        { status: 403 }
      );
    }

    // No public fallback: if the protected file is missing we fail loudly instead of
    // silently serving a different (public) file and hiding a deployment problem.
    const filePath = path.join(process.cwd(), 'protected-assets', FILE_NAME);
    let file: Buffer;
    try {
      file = await fs.readFile(filePath);
    } catch (err) {
      console.error('[CRITICAL/Download] Protected asset missing. Check outputFileTracingIncludes:', err);
      return NextResponse.json(
        { error: 'The file is temporarily unavailable. Please contact our site office.' },
        { status: 500 }
      );
    }

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${DOWNLOAD_NAME}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[Download] Unexpected error:', error);
    return NextResponse.json({ error: 'Unable to download right now.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { PLOTS_DATA } from '@/data/plots';
import { getSupabaseAdmin, isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  ADMIN_COOKIE_NAME,
  ADMIN_AUTH_TOKEN,
  verifyAdminSessionToken,
  constantTimeCompare,
  validateRequestOrigin
} from '@/lib/security';
import { getTrustedClientIp } from '@/lib/rate-limit';
import { Plot } from '@/types';

function checkAdminAuth(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader
      .split(';')
      .map(c => c.trim().split('='))
      .filter(([k]) => Boolean(k))
      .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
  );

  const cookieToken = cookies[ADMIN_COOKIE_NAME];
  if (cookieToken && verifyAdminSessionToken(cookieToken)) {
    return true;
  }

  const authHeader = request.headers.get('authorization') || '';
  const headerToken = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (headerToken && verifyAdminSessionToken(headerToken)) {
    return true;
  }

  return false;
}

export async function GET() {
  try {
    // 1. Check if Supabase has live plot inventory overrides
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('plots')
        .select('id, number, size, width, depth, area, facing, status, price, price_per_sqft, is_corner, is_park_facing, is_main_boulevard, row, col, badges, images, description')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        // Map database records to Plot interface
        const livePlots: Plot[] = data.map((row: any) => ({
          id: row.id,
          number: row.number,
          size: row.size,
          width: Number(row.width),
          depth: Number(row.depth),
          area: Number(row.area),
          facing: row.facing,
          status: row.status,
          price: Number(row.price),
          pricePerSqft: Number(row.price_per_sqft),
          isCorner: Boolean(row.is_corner),
          isParkFacing: Boolean(row.is_park_facing),
          isMainBoulevard: Boolean(row.is_main_boulevard),
          row: row.row,
          col: row.col,
          pos3D: [row.col * 2.2, 0, row.row * 2.8],
          dim3D: [2.0, 0.4, 2.6],
          badges: row.badges || [],
          images: row.images || ['/images/plots/plot-1.jpg'],
          description: row.description || '',
        }));

        return NextResponse.json(
          {
            success: true,
            source: 'supabase',
            plots: livePlots,
          },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15',
            },
          }
        );
      }
    }

    // 2. Baseline fallback: return default 39 plots from PLOTS_DATA
    return NextResponse.json(
      {
        success: true,
        source: 'static_baseline',
        plots: PLOTS_DATA,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15',
        },
      }
    );
  } catch (error) {
    console.error('[API/Plots] Error fetching plots:', error);
    return NextResponse.json({ success: true, source: 'fallback', plots: PLOTS_DATA });
  }
}

export async function PATCH(request: Request) {
  try {
    // 1. CSRF Origin Verification
    if (!validateRequestOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
    }

    // 2. Admin Authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized. Admin credentials required to modify inventory.' }, { status: 401 });
    }

    const clientIp = getTrustedClientIp(request);
    const body = await request.json().catch(() => null);
    if (!body || typeof body.id !== 'number') {
      return NextResponse.json({ error: 'Plot id is required.' }, { status: 400 });
    }

    const plotId = body.id;
    const status = body.status;
    const price = body.price;

    const dbAdmin = getSupabaseAdmin();
    if (dbAdmin && isSupabaseConfigured()) {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (status) updateData.status = status;
      if (price) updateData.price = price;

      // Upsert into plots table
      const { error } = await dbAdmin
        .from('plots')
        .update(updateData)
        .eq('id', plotId);

      if (error) {
        // If row doesn't exist yet, insert full plot baseline first
        const basePlot = PLOTS_DATA.find(p => p.id === plotId);
        if (basePlot) {
          await dbAdmin.from('plots').upsert({
            id: basePlot.id,
            number: basePlot.number,
            size: basePlot.size,
            width: basePlot.width,
            depth: basePlot.depth,
            area: basePlot.area,
            facing: basePlot.facing,
            status: status || basePlot.status,
            price: price || basePlot.price,
            price_per_sqft: basePlot.pricePerSqft,
            is_corner: basePlot.isCorner,
            is_park_facing: basePlot.isParkFacing,
            is_main_boulevard: basePlot.isMainBoulevard,
            row: basePlot.row,
            col: basePlot.col,
            badges: basePlot.badges,
            images: basePlot.images,
            description: basePlot.description || '',
          });
        }
      }

      // Purge Next.js static / edge cache
      try {
        revalidatePath('/plots');
        revalidatePath('/api/plots');
      } catch (cacheErr) {
        console.warn('Cache revalidation skipped:', cacheErr);
      }

      console.info(`[Audit/Plots] Plot ${plotId} status changed to '${status}' by Admin IP: ${clientIp} at ${new Date().toISOString()}`);
    }

    return NextResponse.json({
      success: true,
      message: `Plot ${plotId} status updated successfully.`,
      plot: { id: plotId, status, price },
    });
  } catch (error) {
    console.error('[API/Plots] Error updating plot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

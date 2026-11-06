import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  const uptime = process.uptime();
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptime),
    database: {
      supabaseConfigured: isSupabaseConfigured(),
    },
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
}


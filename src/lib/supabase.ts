import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const isSupabaseAdminConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseServiceRoleKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseServiceRoleKey.includes('your-service-role-key')
  );
};

/**
 * Public client instance for anonymous submissions (subject to RLS insert-only rules).
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Server-only administrative client using the privileged service-role key.
 * Used exclusively in server routes (GET /api/leads, PATCH /api/leads, PATCH /api/plots).
 * NEVER exposed to the browser or prefixed with NEXT_PUBLIC_.
 */
export const getSupabaseAdmin = (): SupabaseClient | null => {
  if (isSupabaseAdminConfigured()) {
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  // Fallback to standard client if service-role key is not configured yet
  return supabase;
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl      = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey   = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('[supabaseAdmin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

// Server-side only — uses the service role key.
// Never import this in client components.
// Placeholder fallback prevents build-time crash when env vars are absent.
export const supabaseAdmin = createClient(
  supabaseUrl    || 'https://placeholder.supabase.co',
  serviceRoleKey || 'placeholder-service-role-key',
  { auth: { autoRefreshToken: false, persistSession: false } },
);

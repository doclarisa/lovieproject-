import { createClient } from '@supabase/supabase-js';

// Server-side only — uses the service role key.
// Never import this in client components.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()     ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()    ?? '',
  { auth: { autoRefreshToken: false, persistSession: false } },
);

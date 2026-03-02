import { supabaseAdmin } from '@/lib/supabaseAdmin';
import AdminPanel from '@/components/AdminPanel';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('id, name, tagline, bio, city, country, tags, photo_url, status, created_at, email')
    .order('created_at', { ascending: false });

  return (
    <AdminPanel
      initialProfiles={profiles ?? []}
      fetchError={!!error}
    />
  );
}

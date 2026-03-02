import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  const sessionCookie = request.cookies.get('lp_session');
  if (sessionCookie?.value !== 'granted') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, email } = await request.json();
    if (!id || !email) {
      return NextResponse.json({ error: 'Missing id or email' }, { status: 400 });
    }

    // Fetch the profile to verify ownership
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('id', id)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const matches = profile.email?.toLowerCase().trim() === email.toLowerCase().trim();
    if (!matches) {
      return NextResponse.json({ error: 'Email does not match this profile' }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

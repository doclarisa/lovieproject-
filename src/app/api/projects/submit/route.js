import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  // Verify site session — only logged-in users can post projects
  const sessionCookie = request.cookies.get('lp_session');
  if (sessionCookie?.value !== 'granted') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projectData = await request.json();

    // Service role bypasses RLS entirely
    const { error } = await supabaseAdmin
      .from('projects')
      .insert([{ ...projectData, status: 'approved' }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

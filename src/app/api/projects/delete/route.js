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

    // Check admin cookie — admins can delete any project
    const adminCookie = request.cookies.get('lp_admin');
    const isAdmin = adminCookie?.value === 'granted';

    // Fetch the project to verify ownership
    const { data: project, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('id, contact_email')
      .eq('id', id)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Non-admins must provide the correct contact email
    if (!isAdmin) {
      const matches = project.contact_email?.toLowerCase().trim() === email.toLowerCase().trim();
      if (!matches) {
        return NextResponse.json({ error: 'Email does not match project owner' }, { status: 403 });
      }
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

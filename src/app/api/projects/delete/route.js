import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  const sessionCookie = request.cookies.get('lp_session');
  if (sessionCookie?.value !== 'granted') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, value } = await request.json();
    if (!id || !value) {
      return NextResponse.json({ error: 'Missing id or verification value' }, { status: 400 });
    }

    // Admins can delete any project
    const adminCookie = request.cookies.get('lp_admin');
    if (adminCookie?.value === 'granted') {
      const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Fetch the project to verify ownership
    const { data: project, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('id, contact_email, contact_name')
      .eq('id', id)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const v = value.toLowerCase().trim();

    // Match against email if project has one, otherwise match against name
    const hasEmail = !!project.contact_email?.trim();
    const matches = hasEmail
      ? project.contact_email.toLowerCase().trim() === v
      : project.contact_name?.toLowerCase().trim() === v;

    if (!matches) {
      const hint = hasEmail ? 'email' : 'name';
      return NextResponse.json(
        { error: `The ${hint} you entered does not match this project` },
        { status: 403 },
      );
    }

    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

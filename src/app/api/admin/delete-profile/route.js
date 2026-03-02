import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  const adminCookie = request.cookies.get('lp_admin');
  if (adminCookie?.value !== 'granted') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { data: deleted, error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) throw error;

    if (!deleted || deleted.length === 0) {
      throw new Error(`Profile not found or could not be deleted (id: ${id})`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  // Verify admin cookie
  const adminCookie = request.cookies.get('lp_admin');
  if (adminCookie?.value !== 'granted') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, rejection_note } = await request.json();

    if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const updateData = { status };
    if (rejection_note !== undefined) {
      updateData.rejection_note = rejection_note;
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', id);

    if (error) {
      // If rejection_note column doesn't exist, retry with status only
      if (error.message?.includes('rejection_note')) {
        const { error: retryErr } = await supabaseAdmin
          .from('profiles')
          .update({ status })
          .eq('id', id);
        if (retryErr) throw retryErr;
      } else {
        throw error;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

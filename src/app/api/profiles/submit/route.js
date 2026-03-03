import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  // Verify site session
  const sessionCookie = request.cookies.get('lp_session');
  if (sessionCookie?.value !== 'granted') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const fd = await request.formData();
    const photoFile = fd.get('photo');
    console.log('[profiles/submit] photo received:', photoFile?.name, 'size:', photoFile?.size);
    let photoUrl = null;

    if (photoFile && photoFile.size > 0) {
      const ext = photoFile.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await photoFile.arrayBuffer());

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('profile-photos')
        .upload(filename, buffer, {
          contentType: photoFile.type,
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('profile-photos')
        .getPublicUrl(uploadData.path);
      photoUrl = publicUrl;
      console.log('[profiles/submit] photo_url:', photoUrl);
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .insert([{
        name:        fd.get('name')?.trim()        || null,
        tagline:     fd.get('tagline')?.trim()     || null,
        bio:         fd.get('bio')?.trim()         || null,
        city:        fd.get('city')?.trim()        || null,
        country:     fd.get('country')?.trim()     || null,
        email:       fd.get('email')?.trim()       || null,
        website_url: fd.get('website_url')?.trim() || null,
        instagram:   fd.get('instagram')?.trim()   || null,
        photo_url:   photoUrl,
        status:      'pending',
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

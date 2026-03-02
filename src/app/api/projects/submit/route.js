import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  // Verify site session
  const sessionCookie = request.cookies.get('lp_session');
  if (sessionCookie?.value !== 'granted') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let projectData;
    let photoUrl = null;

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload + form fields
      const fd = await request.formData();
      const photoFile = fd.get('photo');

      if (photoFile && photoFile.size > 0) {
        const ext = photoFile.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const buffer = Buffer.from(await photoFile.arrayBuffer());

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('project-images')
          .upload(filename, buffer, {
            contentType: photoFile.type,
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);

        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('project-images')
          .getPublicUrl(uploadData.path);
        photoUrl = publicUrl;
      }

      projectData = {
        title:            fd.get('title'),
        description:      fd.get('description'),
        category:         fd.get('category')         || null,
        date_start:       fd.get('date_start')       || null,
        date_end:         fd.get('date_end')         || null,
        location_city:    fd.get('location_city')    || null,
        location_country: fd.get('location_country') || null,
        contact_name:     fd.get('contact_name'),
        contact_email:    fd.get('contact_email')    || null,
        contact_phone:    fd.get('contact_phone')    || null,
        contact_instagram: fd.get('contact_instagram') || null,
        additional_info:  fd.get('additional_info')  || null,
        posted_by_name:   fd.get('contact_name'),
        profile_id:       fd.get('profile_id')       || null,
        photo_url:        photoUrl,
      };
    } else {
      // JSON fallback (no photo)
      projectData = await request.json();
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .insert([{ ...projectData, status: 'approved' }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

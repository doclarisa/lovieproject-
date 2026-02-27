import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const correct = process.env.ADMIN_PASSWORD?.trim();

    if (!correct) {
      return NextResponse.json({ success: false, error: 'Admin password not configured' }, { status: 500 });
    }

    if (password === correct) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('lp_admin', 'granted', {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 hours
      });
      return response;
    }

    return NextResponse.json({ success: false });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

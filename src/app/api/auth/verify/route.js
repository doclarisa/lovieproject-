import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('lp_session', 'granted', {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json({ success: false });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

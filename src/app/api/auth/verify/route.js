import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();

    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;

    console.log('=== PASSWORD VERIFICATION ===');
    console.log('Expected password:', correctPassword);
    console.log('Received password:', password);
    console.log('Match:', password === correctPassword);
    console.log('=============================');

    if (!correctPassword) {
      return NextResponse.json(
        { error: 'Password not configured' },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      // Set an HttpOnly cookie — middleware reads this for server-side protection
      response.cookies.set('siteAuthenticated', 'true', {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

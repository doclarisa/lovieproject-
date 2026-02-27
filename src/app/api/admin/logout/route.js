import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('lp_admin', '', {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Expire immediately
  });
  return response;
}

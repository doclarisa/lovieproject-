import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Always allow the password page and the auth API endpoint
  if (pathname === '/' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Check for the auth cookie set by /api/auth/verify
  const authCookie = request.cookies.get('siteAuthenticated');
  if (authCookie?.value === 'true') {
    return NextResponse.next();
  }

  // Not authenticated — send to password page
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    // Match everything except Next.js internals and public assets
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};

import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const session = request.cookies.get('lp_session');
  const isAuthenticated = session?.value === 'granted';

  // Redirect authenticated users away from the password page
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Protected routes: /home, /profile/:id, /submit
  const isProtected =
    pathname === '/home' ||
    pathname.startsWith('/home/') ||
    pathname === '/submit' ||
    pathname.startsWith('/profile/');

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon.ico|images/|api/).*)',
  ],
};

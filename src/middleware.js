import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── Site password gate ────────────────────────────────────────────────────
  const session        = request.cookies.get('lp_session');
  const isAuthenticated = session?.value === 'granted';

  // Redirect authenticated users away from password page
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Protected site routes: /home, /profile/:id, /submit, /projects
  const isSiteProtected =
    pathname === '/home'             ||
    pathname.startsWith('/home/')    ||
    pathname === '/submit'           ||
    pathname.startsWith('/profile/') ||
    pathname === '/projects'         ||
    pathname.startsWith('/projects/');

  if (isSiteProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ── Admin gate ────────────────────────────────────────────────────────────
  // /admin/login is always public; everything else under /admin needs lp_admin
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminSession = request.cookies.get('lp_admin');
    if (adminSession?.value !== 'granted') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // All routes except Next.js internals, static assets, and API routes
    '/((?!_next/static|_next/image|favicon.ico|images/|api/).*)',
  ],
};

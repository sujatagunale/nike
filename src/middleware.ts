import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('better-auth.session_token');
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard') && !sessionToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if ((pathname === '/sign-in' || pathname === '/sign-up') && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
};

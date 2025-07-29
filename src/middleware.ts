import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth/config';

const protectedRoutes = ['/dashboard', '/profile', '/orders'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (isAuthRoute && session?.session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isProtectedRoute && !session?.session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

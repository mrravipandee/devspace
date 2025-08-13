import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Private routes
  const privateRoutes = [
    '/home',
    '/project',
    '/blog',
    '/resume',
    '/setting',
    '/profile',
    '/tech',
    '/achivement',
    '/contributions'
  ];

  // Public routes
  const publicRoutes = [
    '/',
    '/signup',
    '/signin',
    '/about',
    '/faq',
    '/features',
    '/pricing',
  ];

  const { pathname } = req.nextUrl;

  // If user is going to a private route without token → redirect to signin
  if (privateRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If user is logged in and tries to go to signin/signup → send them to home
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
}

// Only match these paths
export const config = {
  matcher: [
    '/home/:path*',
    '/project/:path*',
    '/blog/:path*',
    '/resume/:path*',
    '/setting/:path*',
    '/profile/:path*',
    '/tech/:path*',
    '/achivement/:path*',
    '/signin',
    '/signup',
  ],
};
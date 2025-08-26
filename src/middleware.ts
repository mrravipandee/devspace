import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  // Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    
    // Allow requests from your production domain and localhost
    const allowedOrigins = [
      'https://www.devspacee.me',
      'https://devspacee.me',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    const origin = req.headers.get('origin');
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    
    // Set other CORS headers
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
    
    return response;
  }

  // If this is the API subdomain, only allow API routes
  if (hostname === 'api.devspacee.me') {
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('https://www.devspacee.me', req.url));
    }
    return NextResponse.next();
  }

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
    '/login',
    '/about',
    '/faq',
    '/features',
    '/pricing',
  ];

  // Skip middleware for dynamic username routes (public profiles)
  if (pathname !== '/' && !pathname.startsWith('/api') && !pathname.startsWith('/_next') && !privateRoutes.some(route => pathname.startsWith(route)) && !publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If user is going to a private route without token → redirect to signin
  if (privateRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If user is logged in and tries to go to login/signup → send them to home
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
}

// Only match these paths
export const config = {
  matcher: [
    '/api/:path*',
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
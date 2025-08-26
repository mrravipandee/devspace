import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  // Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    
    // Allow requests from your production domain and localhost
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [
          'https://www.devspacee.me',
          'https://api.devspacee.me',
          'https://devspacee.me',
        ]
      : [
          'https://www.devspacee.me',
          'https://api.devspacee.me',
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

  // Private routes that require authentication
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

  // Check if current path is a private route
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  
  // Check if current path is an auth route
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware Debug:', {
      pathname,
      hasToken: !!token,
      isPrivateRoute,
      isAuthRoute,
      hostname
    });
  }

  // If accessing private route without token → redirect to login
  if (isPrivateRoute && !token) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Redirecting to login: No token for private route', pathname);
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If accessing auth route with token → redirect to home
  if (isAuthRoute && token) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Redirecting to home: User has token but accessing auth page', pathname);
    }
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
    '/contributions/:path*',
    '/login',
    '/signup',
    '/',
  ],
};
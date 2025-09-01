import { NextRequest, NextResponse } from 'next/server';

// Function to track API analytics
async function trackApiAnalytics(request: NextRequest, response: NextResponse, username: string) {
  try {
    const startTime = Date.now();
    
    // Extract request details
    const url = new URL(request.url);
    const endpoint = url.pathname.replace(`/api/${username}`, '') || '/';
    const method = request.method;
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Extract website from referer
    let website = null;
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        website = refererUrl.hostname;
      } catch {
        // Invalid referer URL
      }
    }
    
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Prepare analytics data
    const analyticsData = {
      username,
      endpoint,
      method,
      ip,
      userAgent,
      referer,
      website,
      responseTime,
      statusCode: response.status
    };
    
    // Send analytics data to internal endpoint (non-blocking)
    fetch(`${url.origin}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Request': 'true'
      },
      body: JSON.stringify(analyticsData)
    }).catch(error => {
      console.error('Failed to track analytics:', error);
    });
    
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

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
    
    // Check if this is a public API endpoint (username-based)
    const apiMatch = pathname.match(/^\/api\/([^\/]+)\/(.+)$/);
    
    if (apiMatch) {
      const [, username, endpoint] = apiMatch;
      
      // List of public endpoints that don't require authentication
      const publicEndpoints = ['/profile', '/projects', '/blog', '/achievements', '/techstack', '/contributions', '/resume'];
      
      if (publicEndpoints.includes(`/${endpoint}`)) {
        // Track analytics for public API endpoints (non-blocking)
        trackApiAnalytics(req, response, username);
        return response;
      }
    }
    
    return response;
  }

  // If this is the API subdomain, handle API-only requests
  if (hostname === 'api.devspacee.me') {
    // Remove /api prefix for cleaner URLs like api.devspacee.me/username/profile
    if (pathname.startsWith('/api/')) {
      const newPath = pathname.replace('/api/', '/');
      const newUrl = new URL(newPath, req.url);
      return NextResponse.rewrite(newUrl);
    }
    
    // If it's not an API path, redirect to main site
    if (!pathname.startsWith('/api') && pathname !== '/') {
      return NextResponse.redirect(new URL('https://www.devspacee.me', req.url));
    }
    
    // For root path, redirect to main site
    if (pathname === '/') {
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
    '/contributions',
    '/api' // API documentation page
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
    '/api',
    '/login',
    '/signup',
    '/',
  ],
};
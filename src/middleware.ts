import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Function to track API analytics
async function trackApiAnalytics(request: NextRequest, response: NextResponse, username: string) {
  try {
    const startTime = Date.now();
    
    // Extract request details
    const url = new URL(request.url);
    const endpoint = url.pathname.replace(`/api/${username}`, '') || '/';
    const method = request.method;
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Extract website from referer
    let website = null;
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        website = refererUrl.hostname;
      } catch (e) {
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a public API endpoint (username-based)
  const apiMatch = pathname.match(/^\/api\/([^\/]+)\/(.+)$/);
  
  if (apiMatch) {
    const [, username, endpoint] = apiMatch;
    
    // List of public endpoints that don't require authentication
    const publicEndpoints = ['/profile', '/projects', '/blog', '/achievements', '/techstack', '/contributions', '/resume'];
    
    if (publicEndpoints.includes(`/${endpoint}`)) {
      // This is a public API endpoint, allow access
      const response = NextResponse.next();
      
      // Track analytics (non-blocking)
      trackApiAnalytics(request, response, username);
      
      return response;
    }
  }
  
  // For all other routes, continue with normal middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
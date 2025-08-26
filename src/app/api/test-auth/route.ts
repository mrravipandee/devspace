import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    console.log('Test auth endpoint called');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Check cookies
    const cookies = req.cookies.getAll();
    console.log('All cookies:', cookies.map(c => ({ name: c.name, value: c.value ? 'exists' : 'empty' })));
    
    const token = req.cookies.get('token');
    console.log('Token cookie exists:', !!token);
    
    if (token) {
      console.log('Token value length:', token.value.length);
    }
    
    const user = await getUserFromToken(req);
    
    return NextResponse.json({
      success: true,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      hasToken: !!token,
      hasUser: !!user,
      userEmail: user?.email || null,
      cookies: cookies.map(c => c.name)
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}

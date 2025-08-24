import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getUserFromToken } from '@/lib/auth';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reason } = await req.json();

    // Delete user from database
    await User.findByIdAndDelete(user._id);

    // Create response to clear cookies
    const res = NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });

    // Clear the authentication cookie
    res.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });

    return res;
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

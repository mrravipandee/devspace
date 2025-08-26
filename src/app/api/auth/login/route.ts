import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ msg: 'User not found' }, { status: 400 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ msg: 'Invalid credentials' }, { status: 400 });

    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return NextResponse.json({ msg: 'Server configuration error' }, { status: 500 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const res = NextResponse.json({ 
      user: { 
        fullName: user.fullName, 
        email: user.email, 
        username: user.username,
        profileCompleted: user.profileCompleted 
      } 
    });
    
    // Set cookie with proper configuration for production
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true, 
      path: '/', 
      maxAge: 86400,
      secure: isProduction, // Only use secure in production
      sameSite: isProduction ? 'strict' : 'lax' as const,
      domain: isProduction ? '.devspacee.me' : undefined // Use domain in production
    };
    
    res.cookies.set('token', token, cookieOptions);
    
    console.log('Login successful for user:', user.email, 'Environment:', process.env.NODE_ENV);
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ msg: 'Internal server error' }, { status: 500 });
  }
}
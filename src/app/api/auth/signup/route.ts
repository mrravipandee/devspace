import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  await dbConnect();

  const { username, email, password, fullName } = await req.json();

  // Check if user exists
  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ msg: 'User already exists' }, { status: 400 });
  }

  // Check if username exists
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return NextResponse.json({ msg: 'Username already taken' }, { status: 400 });
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({ 
    username, 
    email, 
    password: hashed,
    fullName: fullName || username // Use username as fallback if fullName not provided
  });

  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

  // Send response with cookie
  const res = NextResponse.json({
    msg: 'Signup successful',
    user: {
      username: user.username,
      email: user.email,
    },
  });

  res.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
}

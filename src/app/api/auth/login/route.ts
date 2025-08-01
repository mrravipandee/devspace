import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ msg: 'User not found' }, { status: 400 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ msg: 'Invalid credentials' }, { status: 400 });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  const res = NextResponse.json({ user: { name: user.name, email: user.email, username: user.username } });
  res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 86400 });
  return res;
}
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import User from '@/models/User';

export interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};

export const getUserFromToken = async (req: NextRequest) => {
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  try {
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch {
    return null;
  }
};

export const getUserFromTokenString = async (token: string) => {
  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  try {
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch {
    return null;
  }
};

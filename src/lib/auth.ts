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
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const getUserFromToken = async (req: NextRequest) => {
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    console.log('No token found in cookies');
    return null;
  }

  console.log('Token found, verifying...');
  const decoded = verifyToken(token);
  if (!decoded) {
    console.log('Token verification failed');
    return null;
  }

  try {
    console.log('Token verified, fetching user with ID:', decoded.id);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('User not found in database');
      return null;
    }
    console.log('User found:', user.email);
    return user;
  } catch (error) {
    console.error('Database error fetching user:', error);
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

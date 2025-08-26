import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getUserFromToken } from '@/lib/auth';
import ApiKey from '@/models/ApiKey';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await ApiKey.find({ userId: user._id, isActive: true })
      .select('-key') // Don't return the actual key for security
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      apiKeys: apiKeys.map(key => ({
        id: key._id,
        name: key.name,
        isActive: key.isActive,
        createdAt: key.createdAt,
        lastUsed: key.lastUsed,
        permissions: key.permissions,
        rateLimit: key.rateLimit
      }))
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      );
    }

    // Generate a secure API key
    const apiKey = `ds_${crypto.randomBytes(16).toString('hex')}_${Date.now().toString(36)}`;

    const newApiKey = new ApiKey({
      userId: user._id,
      name: name.trim(),
      key: apiKey,
      isActive: true,
      permissions: ['read'],
      rateLimit: 1000
    });

    await newApiKey.save();

    return NextResponse.json({
      success: true,
      message: 'API key generated successfully',
      apiKey: {
        id: newApiKey._id,
        name: newApiKey.name,
        key: apiKey, // Only return the key once during creation
        isActive: newApiKey.isActive,
        createdAt: newApiKey.createdAt,
        permissions: newApiKey.permissions,
        rateLimit: newApiKey.rateLimit
      }
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

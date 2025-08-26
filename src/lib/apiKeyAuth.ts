import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ApiKey from '@/models/ApiKey';
import User from '@/models/User';

export interface ApiKeyUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string;
  profileImage: string;
  location: string;
  availableForWork: boolean;
  socialHandles: Array<{ platform: string; url: string }>;
  usefulLinks: Array<{ title: string; url: string }>;
  profileCompleted: boolean;
}

export const authenticateApiKey = async (req: NextRequest): Promise<{ user: ApiKeyUser | null; error?: string }> => {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Missing or invalid authorization header' };
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Find the API key
    const keyDoc = await ApiKey.findOne({ key: apiKey, isActive: true });
    if (!keyDoc) {
      return { user: null, error: 'Invalid API key' };
    }

    // Update last used timestamp
    keyDoc.lastUsed = new Date();
    await keyDoc.save();

    // Get the user
    const user = await User.findById(keyDoc.userId).select('-password');
    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return {
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profileImage: user.profileImage,
        location: user.location,
        availableForWork: user.availableForWork,
        socialHandles: user.socialHandles,
        usefulLinks: user.usefulLinks,
        profileCompleted: user.profileCompleted
      }
    };
  } catch (error) {
    console.error('API key authentication error:', error);
    return { user: null, error: 'Authentication failed' };
  }
};

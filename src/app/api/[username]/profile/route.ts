import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await dbConnect();
    
    const { username } = params;
    
    // Find user by username
    const user = await User.findOne({ username }).select('-password -email');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return public profile data
    const profileData = {
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      social: user.social,
      location: user.location,
      website: user.website,
      company: user.company,
      jobTitle: user.jobTitle,
      skills: user.skills,
      createdAt: user.createdAt
    };
    
    return NextResponse.json({
      success: true,
      data: profileData
    });
    
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

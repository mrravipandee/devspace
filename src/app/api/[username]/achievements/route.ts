import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Achievement from '@/models/Achievement';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await dbConnect();
    
    const { username } = await params;
    
    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's achievements
    const achievements = await Achievement.find({ userId: user._id })
      .sort({ date: -1 })
      .lean();
    
    // Format achievements for public API
    const formattedAchievements = achievements.map(achievement => ({
      id: achievement._id,
      title: achievement.title,
      description: achievement.description,
      type: achievement.type,
      issuer: achievement.issuer,
      date: achievement.date,
      image: achievement.image,
      verificationUrl: achievement.verificationUrl,
      skills: achievement.skills,
      createdAt: achievement.createdAt,
      updatedAt: achievement.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedAchievements
    });
    
  } catch (error) {
    console.error('Achievements API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

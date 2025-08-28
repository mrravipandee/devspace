import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Achievement from '@/models/Achievement';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await dbConnect();

    const { username } = await params;
    
    // Find user by username
    const user = await User.findOne({ username }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const achievements = await Achievement.find({ userId: user._id })
      .sort({ date: -1 });
    
    return NextResponse.json({
      success: true,
      data: achievements.map(achievement => ({
        id: achievement._id,
        title: achievement.title,
        description: achievement.description,
        type: achievement.type,
        image: achievement.image,
        issuer: achievement.issuer,
        date: achievement.date,
        verificationUrl: achievement.verificationUrl,
        skills: achievement.skills,
        createdAt: achievement.createdAt
      }))
    });

  } catch (error) {
    console.error('Achievements API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

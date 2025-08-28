import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Achievement from '@/models/Achievement';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Verify authentication
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, type, image, issuer, date, verificationUrl, skills } = await req.json();

    // Validate required fields
    if (!title || !issuer || !verificationUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const achievement = new Achievement({
      userId: user._id,
      title,
      description: description || '',
      type,
      image: image || '',
      issuer,
      date: date || new Date(),
      verificationUrl,
      skills: skills || []
    });

    await achievement.save();

    return NextResponse.json({
      success: true,
      data: {
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
      }
    });

  } catch (error) {
    console.error('Create achievement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

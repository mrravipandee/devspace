import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Achievement from '@/models/Achievement';
import { getUserFromToken } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const { title, description, type, image, issuer, date, verificationUrl, skills } = await req.json();

    // Validate required fields
    if (!title || !issuer || !verificationUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find achievement and verify ownership
    const achievement = await Achievement.findOne({ _id: id, userId: user._id });
    if (!achievement) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      );
    }

    // Update achievement
    achievement.title = title;
    achievement.description = description || '';
    achievement.type = type;
    achievement.image = image || '';
    achievement.issuer = issuer;
    achievement.date = date || new Date();
    achievement.verificationUrl = verificationUrl;
    achievement.skills = skills || [];

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
    console.error('Update achievement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Find achievement and verify ownership
    const achievement = await Achievement.findOne({ _id: id, userId: user._id });
    if (!achievement) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      );
    }

    await Achievement.deleteOne({ _id: id });

    return NextResponse.json({
      success: true,
      message: 'Achievement deleted successfully'
    });

  } catch (error) {
    console.error('Delete achievement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import TechStack from '@/models/TechStack';

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

    const techStack = await TechStack.find({ userId: user._id })
      .sort({ lastUsed: -1 });
    
    return NextResponse.json({
      success: true,
      data: techStack.map(tech => ({
        id: tech._id,
        name: tech.name,
        category: tech.category,
        proficiency: tech.proficiency,
        icon: tech.icon,
        yearsOfExperience: tech.yearsOfExperience,
        lastUsed: tech.lastUsed,
        projects: tech.projects,
        description: tech.description,
        createdAt: tech.createdAt
      }))
    });

  } catch (error) {
    console.error('TechStack API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

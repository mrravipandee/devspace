import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import TechStack from '@/models/TechStack';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await dbConnect();
    
    const { username } = params;
    
    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's tech stack
    const techStack = await TechStack.find({ userId: user._id })
      .sort({ yearsOfExperience: -1 })
      .lean();
    
    // Format tech stack for public API
    const formattedTechStack = techStack.map(tech => ({
      id: tech._id,
      name: tech.name,
      category: tech.category,
      proficiency: tech.proficiency,
      yearsOfExperience: tech.yearsOfExperience,
      lastUsed: tech.lastUsed,
      icon: tech.icon,
      projects: tech.projects,
      description: tech.description,
      createdAt: tech.createdAt,
      updatedAt: tech.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedTechStack
    });
    
  } catch (error) {
    console.error('Tech Stack API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

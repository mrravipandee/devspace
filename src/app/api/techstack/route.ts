import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TechStack from '@/models/TechStack';
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

    const { name, category, proficiency, icon, yearsOfExperience, lastUsed, projects, description } = await req.json();

    // Validate required fields
    if (!name || !category || !proficiency || yearsOfExperience === undefined || !lastUsed) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const techStack = new TechStack({
      userId: user._id,
      name,
      category,
      proficiency,
      icon: icon || '',
      yearsOfExperience,
      lastUsed: new Date(lastUsed),
      projects: projects || [],
      description: description || ''
    });

    await techStack.save();

    return NextResponse.json({
      success: true,
      data: {
        id: techStack._id,
        name: techStack.name,
        category: techStack.category,
        proficiency: techStack.proficiency,
        icon: techStack.icon,
        yearsOfExperience: techStack.yearsOfExperience,
        lastUsed: techStack.lastUsed,
        projects: techStack.projects,
        description: techStack.description,
        createdAt: techStack.createdAt
      }
    });

  } catch (error) {
    console.error('Create techstack error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

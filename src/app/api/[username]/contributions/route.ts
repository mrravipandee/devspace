import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Contribution from '@/models/Contribution';

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
    
    // Get user's contributions
    const contributions = await Contribution.find({ userId: user._id })
      .sort({ date: -1 })
      .lean();
    
    // Format contributions for public API
    const formattedContributions = contributions.map(contribution => ({
      id: contribution._id,
      projectName: contribution.projectName,
      projectUrl: contribution.projectUrl,
      description: contribution.description,
      contributionType: contribution.contributionType,
      pullRequestUrl: contribution.pullRequestUrl,
      stars: contribution.stars,
      forks: contribution.forks,
      technologies: contribution.technologies,
      date: contribution.date,
      projectLogo: contribution.projectLogo,
      createdAt: contribution.createdAt,
      updatedAt: contribution.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedContributions
    });
    
  } catch (error) {
    console.error('Contributions API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

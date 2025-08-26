import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getUserFromToken } from '@/lib/auth';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profileImage: user.profileImage,
        profileImagePublicId: user.profileImagePublicId,
        location: user.location,
        availableForWork: user.availableForWork,
        socialHandles: user.socialHandles,
        usefulLinks: user.usefulLinks,
        profileCompleted: user.profileCompleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      username,
      bio,
      profileImage,
      profileImagePublicId,
      location,
      availableForWork,
      socialHandles,
      usefulLinks
    } = body;

    // Check if username is being changed and if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (profileImagePublicId !== undefined) updateData.profileImagePublicId = profileImagePublicId;
    if (location !== undefined) updateData.location = location;
    if (availableForWork !== undefined) updateData.availableForWork = availableForWork;
    if (socialHandles !== undefined) updateData.socialHandles = socialHandles;
    if (usefulLinks !== undefined) updateData.usefulLinks = usefulLinks;

    // Check if profile is complete (has essential fields)
    const hasEssentialFields = fullName && bio && fullName.trim() && bio.trim();
    if (hasEssentialFields && !user.profileCompleted) {
      updateData.profileCompleted = true;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage,
        profileImagePublicId: updatedUser.profileImagePublicId,
        location: updatedUser.location,
        availableForWork: updatedUser.availableForWork,
        socialHandles: updatedUser.socialHandles,
        usefulLinks: updatedUser.usefulLinks,
        profileCompleted: updatedUser.profileCompleted,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Resume from '@/models/Resume';

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
    
    // Get user's active resume
    const resume = await Resume.findOne({ 
      userId: user._id,
      isActive: true
    }).lean();
    
    if (!resume) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No active resume found'
      });
    }
    
    // Format resume for public API
    const formattedResume = {
      id: resume._id,
      fileName: resume.fileName,
      fileUrl: resume.fileUrl,
      fileSize: resume.fileSize,
      fileType: resume.fileType,
      uploadDate: resume.uploadDate,
      isActive: resume.isActive,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt
    };
    
    return NextResponse.json({
      success: true,
      data: formattedResume
    });
    
  } catch (error) {
    console.error('Resume API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

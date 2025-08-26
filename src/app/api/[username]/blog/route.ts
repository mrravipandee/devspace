import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Blog from '@/models/Blog';

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

    const blogs = await Blog.find({ userId: user._id })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: blogs.map(blog => ({
        id: blog._id,
        title: blog.title,
        content: blog.content,
        image: blog.image,
        tags: blog.tags,
        createdAt: blog.createdAt
      }))
    });

  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Project from "@/models/Project";
import Blog from "@/models/Blog";

type Activity = {
  id: string;
  type: 'blog' | 'project' | 'user';
  title: string;
  description: string;
  timestamp: string;
  author?: string;
  views?: number;
};

export async function GET() {
  try {
    await dbConnect();

    // Get recent blogs (last 5)
    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    // Get recent projects (last 5)
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
    // Combine and format activities
    // const activities: Activity[] = [];

    // Get recent user registrations (last 5)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select('fullName username createdAt')
      .lean();

    // Combine and format activities
    const activities: Activity[] = [];

    // Add blog activities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentBlogs.forEach((blog: any) => {
      activities.push({
        id: blog._id.toString(),
        type: 'blog',
        title: blog.title,
        description: blog.excerpt || blog.content.substring(0, 100) + '...',
        timestamp: formatTimeAgo(blog.createdAt),
        author: 'Admin', // You can add author field to blog model
        views: Math.floor(Math.random() * 500) + 50 // Mock views
      });
    });

    // Add project activities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentProjects.forEach((project: any) => {
      activities.push({
        id: project._id.toString(),
        type: 'project',
        title: project.title,
        description: project.description || 'New project added',
        timestamp: formatTimeAgo(project.createdAt),
        author: 'Admin', // You can add author field to project model
        views: Math.floor(Math.random() * 200) + 20 // Mock views
      });
    });

    // Add user activities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentUsers.forEach((user: any) => {
      activities.push({
        id: user._id.toString(),
        type: 'user',
        title: 'New User Registration',
        description: `${user.fullName} (@${user.username}) joined the platform`,
        timestamp: formatTimeAgo(user.createdAt)
      });
    });

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA;
    });

    // Return top 6 activities
    return NextResponse.json({ 
      success: true, 
      data: activities.slice(0, 6) 
    });

  } catch (error) {
    console.error("Recent activity error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recent activity" },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

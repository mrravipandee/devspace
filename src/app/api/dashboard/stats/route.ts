import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Project from "@/models/Project";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await dbConnect();

    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    // Get projects by status
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent blogs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentBlogs = await Blog.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get weekly data for charts
    const weeklyData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const blogsCount = await Blog.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });

      const projectsCount = await Project.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });

      weeklyData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        blogs: blogsCount,
        projects: projectsCount,
        visitors: Math.floor(Math.random() * 50) + 10 // Mock visitor data
      });
    }

    // Calculate engagement (mock data based on activity)
    const totalActivity = totalBlogs + totalProjects;
    const engagement = Math.min(100, Math.max(0, (totalActivity / 100) * 85 + Math.random() * 20));

    const stats = {
      visitors: {
        total: totalUsers * 3 + Math.floor(Math.random() * 500), // Mock total visitors
        weekly: weeklyData.map(d => ({ day: d.day, visitors: d.visitors }))
      },
      projects: {
        total: totalProjects,
        active: projectStats.find(p => p._id === "Ongoing")?.count || 0,
        completed: projectStats.find(p => p._id === "Completed")?.count || 0,
        planned: projectStats.find(p => p._id === "Planned")?.count || 0
      },
      blogs: {
        total: totalBlogs,
        recent: recentBlogs,
        weekly: weeklyData.map(d => ({ day: d.day, blogs: d.blogs }))
      },
      engagement: {
        percentage: Math.round(engagement),
        trend: engagement > 70 ? "increase" : "decrease"
      },
      weeklyData
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

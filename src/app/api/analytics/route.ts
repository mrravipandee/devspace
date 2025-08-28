import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ApiAnalytics from '@/models/ApiAnalytics';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get user from token
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get analytics data for the user
    const [
      totalRequests,
      uniqueVisitors,
      topEndpoints,
      recentActivity,
      websiteIntegrations
    ] = await Promise.all([
      // Total requests
      ApiAnalytics.countDocuments({
        username: user.username,
        timestamp: { $gte: startDate }
      }),
      
      // Unique visitors (unique IPs)
      ApiAnalytics.distinct('ip', {
        username: user.username,
        timestamp: { $gte: startDate }
      }).then(ips => ips.length),
      
      // Top endpoints
      ApiAnalytics.aggregate([
        {
          $match: {
            username: user.username,
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$endpoint',
            requests: { $sum: 1 }
          }
        },
        {
          $sort: { requests: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            endpoint: '$_id',
            requests: 1,
            _id: 0
          }
        }
      ]),
      
      // Recent activity
      ApiAnalytics.find({
        username: user.username,
        timestamp: { $gte: startDate }
      })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('endpoint timestamp ip')
      .lean(),
      
      // Website integrations
      ApiAnalytics.aggregate([
        {
          $match: {
            username: user.username,
            website: { $exists: true, $ne: null },
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$website',
            requests: { $sum: 1 },
            lastUsed: { $max: '$timestamp' }
          }
        },
        {
          $sort: { requests: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            website: '$_id',
            requests: 1,
            lastUsed: 1,
            _id: 0
          }
        }
      ])
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalRequests,
        uniqueVisitors,
        topEndpoints,
        recentActivity: recentActivity.map(activity => ({
          endpoint: activity.endpoint,
          timestamp: activity.timestamp,
          ip: activity.ip
        })),
        websiteIntegrations
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

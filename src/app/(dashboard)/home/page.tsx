import BlogArticleChart from "./_components/BlogArticleChart";
import SmallCards from "../../../components/SmallCards";
import VisitorsChart from "./_components/Visitors";
import RecentActivity from "./_components/RecentActivity";
import ProjectStatusChart from "./_components/ProjectStatusChart";
import QuickStats from "./_components/QuickStats";
import Notifications from "./_components/Notifications";
import EngagementMetrics from "./_components/EngagementMetrics";

export default function page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Quick Stats Overview */}
      <QuickStats />
      
      {/* Stats Cards */}
      <SmallCards />
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-2">
        <VisitorsChart />
        <BlogArticleChart />
      </div>
      
      {/* Additional Dashboard Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-2">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <ProjectStatusChart />
          <EngagementMetrics />
          <Notifications />
        </div>
      </div>
      
    </div>
  );
}

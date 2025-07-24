import BlogArticleChart from "./_components/BlogArticleChart";
import SmallCards from "./_components/SmallCards";
import VisitorsChart from "./_components/Visitors";

export default function page() {
  return (
    <div>
        <SmallCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-2">
          <VisitorsChart />
          <BlogArticleChart />
        </div>
    </div>
  );
}

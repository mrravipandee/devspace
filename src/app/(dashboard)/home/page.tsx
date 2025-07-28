import BlogArticleChart from "./_components/BlogArticleChart";
import Documentation from "./_components/Documentation";
import HowToUse from "./_components/HowToUse";
import SmallCards from "../../../components/SmallCards";
import VisitorsChart from "./_components/Visitors";

export default function page() {
  return (
    <div>
        <SmallCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-2">
          <VisitorsChart />
          <BlogArticleChart />
        </div>
        <HowToUse />
        <Documentation />
    </div>
  );
}

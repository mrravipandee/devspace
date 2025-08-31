import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description: "Comprehensive API documentation for DevSpace. Learn how to integrate your portfolio data with external applications, fetch user profiles, projects, blogs, and achievements programmatically.",
  keywords: [
    "API documentation",
    "portfolio API",
    "developer API",
    "REST API",
    "API integration",
    "portfolio data",
    "developer tools",
    "API endpoints",
    "JSON API",
    "programmatic access"
  ],
  openGraph: {
    title: "API Documentation | DevSpace",
    description: "Comprehensive API documentation for integrating portfolio data with external applications.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "API Documentation | DevSpace",
    description: "Learn how to integrate portfolio data with external applications using our API.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ApiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

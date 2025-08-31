import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Blog",
  description: "Create, manage, and publish your technical blog posts. Share your knowledge, tutorials, and insights with the developer community. Build your thought leadership in tech.",
  keywords: [
    "blog",
    "technical blog",
    "developer blog",
    "programming blog",
    "tech blog",
    "coding tutorials",
    "software development",
    "tech insights",
    "developer content",
    "programming articles"
  ],
  openGraph: {
    title: "My Blog | DevSpace Dashboard",
    description: "Create and manage your technical blog posts and share your knowledge with the developer community.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "My Blog | DevSpace Dashboard",
    description: "Create and manage your technical blog posts and developer content.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

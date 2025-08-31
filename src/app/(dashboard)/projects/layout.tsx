import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Projects",
  description: "Manage and showcase your development projects, track progress, and organize your portfolio. Add live links, source code, and project details to build your developer profile.",
  keywords: [
    "projects",
    "portfolio projects",
    "development projects",
    "coding projects",
    "software projects",
    "web development",
    "project management",
    "developer portfolio",
    "github projects",
    "open source projects"
  ],
  openGraph: {
    title: "My Projects | DevSpace Dashboard",
    description: "Manage and showcase your development projects with live links and source code.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "My Projects | DevSpace Dashboard",
    description: "Manage and showcase your development projects and portfolio.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

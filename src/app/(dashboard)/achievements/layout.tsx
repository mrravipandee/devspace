import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Achievements",
  description: "Manage and showcase your professional achievements, certifications, hackathon wins, and career milestones. Track your accomplishments and build your professional profile.",
  keywords: [
    "achievements",
    "certifications",
    "hackathon",
    "internship",
    "professional milestones",
    "career achievements",
    "developer achievements",
    "tech accomplishments",
    "portfolio achievements",
    "professional development"
  ],
  openGraph: {
    title: "My Achievements | DevSpace Dashboard",
    description: "Manage and showcase your professional achievements, certifications, and career milestones.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "My Achievements | DevSpace Dashboard",
    description: "Manage and showcase your professional achievements and career milestones.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AchievementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

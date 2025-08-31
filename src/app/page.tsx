import type { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: "DevSpace | Dynamic Portfolio Platform for Developers",
  description: "Create stunning developer portfolios with dynamic APIs. Manage projects, blogs, achievements, and showcase your skills. Perfect for developers, ML engineers, and tech professionals.",
  keywords: [
    "developer portfolio",
    "portfolio builder",
    "dynamic portfolio",
    "developer tools",
    "tech portfolio",
    "programming portfolio",
    "software engineer portfolio",
    "ML engineer portfolio",
    "portfolio API",
    "developer showcase",
    "tech resume",
    "coding portfolio",
    "web developer portfolio",
    "full stack developer",
    "portfolio website",
    "developer platform"
  ],
  openGraph: {
    title: "DevSpace | Dynamic Portfolio Platform for Developers",
    description: "Create stunning developer portfolios with dynamic APIs. Manage projects, blogs, achievements, and showcase your skills.",
    url: "https://devspacee.me",
    siteName: "DevSpace",
    images: [
      {
        url: "https://devspacee.me/og-home.png",
        width: 1200,
        height: 630,
        alt: "DevSpace - Dynamic Portfolio Platform for Developers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevSpace | Dynamic Portfolio Platform for Developers",
    description: "Create stunning developer portfolios with dynamic APIs. Perfect for developers and tech professionals.",
    images: ["https://devspacee.me/og-home.png"],
    creator: "@devspace",
  },
  alternates: {
    canonical: "https://devspacee.me",
  },
};

export default function Home() {
  return <HomePage />;
}
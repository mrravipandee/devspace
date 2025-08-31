import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});


export const metadata: Metadata = {
  title: {
    default: "DevSpace | Dynamic Portfolio for Developers",
    template: "%s | DevSpace"
  },
  description:
    "Create, manage, and share your developer portfolio with ease. Dynamic APIs for projects, blogs, and links. Perfect for ML engineers, developers, and students.",
  keywords: [
    "developer portfolio",
    "dynamic portfolio",
    "next.js portfolio",
    "API-based portfolio",
    "ML engineer portfolio",
    "projects API",
    "blogs API",
    "link in bio for developers",
    "portfolio builder",
    "developer tools",
    "tech portfolio",
    "programming portfolio",
    "software engineer portfolio",
    "web developer portfolio",
    "full stack developer",
    "portfolio website",
    "developer showcase",
    "tech resume",
    "coding portfolio"
  ],
  authors: [{ name: "Ravi Pandey", url: "https://devspacee.me/mrravipandee" }],
  creator: "Ravi Pandey",
  publisher: "DevSpace",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devspacee.me",
    siteName: "DevSpace",
    title: "DevSpace | Dynamic Portfolio for Developers",
    description:
      "One dashboard to manage all your tech projects, blogs, and links. Simple API integration for static portfolios.",
    images: [
      {
        url: "https://devspacee.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevSpace - Dynamic Portfolio Platform for Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevSpace | Dynamic Portfolio for Developers",
    description:
      "Create, manage, and share your developer portfolio with ease. Dynamic APIs for projects, blogs, and links.",
    images: ["https://devspacee.me/og-image.png"],
    creator: "@devspace",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://devspacee.me",
  },
  category: "technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "DevSpace",
    "description": "Dynamic portfolio platform for developers to showcase projects, blogs, and achievements",
    "url": "https://devspacee.me",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Person",
      "name": "Ravi Pandey",
      "url": "https://devspacee.me/mrravipandee"
    },
    "keywords": "developer portfolio, dynamic portfolio, API-based portfolio, developer tools",
    "inLanguage": "en-US"
  };

  return (
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="canonical" href="https://devspacee.me" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${poppins.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
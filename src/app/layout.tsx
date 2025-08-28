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
  title: "DevSpace | Dynamic Portfolio for Developers",
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
  ],
  authors: [{ name: "Ravi Pandey", url: "https://devspacee.me/mrravipandee" }],
  creator: "Ravi Pandey",
  openGraph: {
    title: "Devspace | Dynamic Portfolio for Developers",
    description:
      "One dashboard to manage all your tech projects, blogs, and links. Simple API integration for static portfolios.",
    url: "https://devspacee.me",
    siteName: "Devspace",
    images: [
      {
        url: "https://xyz.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Devfolio - Dynamic Portfolio Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      <body className={`${poppins.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
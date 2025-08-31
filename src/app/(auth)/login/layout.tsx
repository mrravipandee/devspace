import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your DevSpace account to manage your developer portfolio, projects, blogs, and achievements. Access your dashboard and showcase your skills.",
  keywords: [
    "login",
    "sign in",
    "developer account",
    "portfolio login",
    "devspace login",
    "developer dashboard",
    "account access"
  ],
  openGraph: {
    title: "Login | DevSpace",
    description: "Sign in to your DevSpace account to manage your developer portfolio and dashboard.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

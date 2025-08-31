import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your DevSpace account and start building your professional developer portfolio. Join thousands of developers showcasing their skills, projects, and achievements.",
  keywords: [
    "sign up",
    "register",
    "create account",
    "developer portfolio",
    "portfolio builder",
    "developer account",
    "join devspace",
    "free portfolio",
    "developer platform"
  ],
  openGraph: {
    title: "Sign Up | DevSpace",
    description: "Create your DevSpace account and start building your professional developer portfolio.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

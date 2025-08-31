import type { Metadata } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  
  try {
    await dbConnect();
    const user = await User.findOne({ username }).lean();
    
    if (!user) {
      return {
        title: "User Not Found",
        description: "The requested user profile could not be found.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const fullName = user.fullName || user.username;
    const bio = user.bio || `Portfolio of ${fullName} - Developer, Engineer, and Tech Enthusiast`;
    const location = user.location ? ` from ${user.location}` : "";
    
    return {
      title: `${fullName} | Developer Portfolio`,
      description: `${bio}${location}. View projects, achievements, and connect with ${fullName} on DevSpace.`,
      keywords: [
        fullName,
        user.username,
        "developer portfolio",
        "software engineer",
        "programmer",
        "tech portfolio",
        "coding projects",
        "developer profile",
        user.location || "",
        ...(user.socialHandles?.map(handle => handle.platform) || [])
      ].filter(Boolean),
      authors: [{ name: fullName, url: `https://devspacee.me/${username}` }],
      openGraph: {
        title: `${fullName} | Developer Portfolio`,
        description: `${bio}${location}. View projects, achievements, and connect with ${fullName}.`,
        url: `https://devspacee.me/${username}`,
        siteName: "DevSpace",
        images: [
          {
            url: user.profileImage || "https://devspacee.me/default-profile.png",
            width: 400,
            height: 400,
            alt: `${fullName} - Developer Portfolio`,
          },
        ],
        locale: "en_US",
        type: "profile",
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' '),
        username: username,
      },
      twitter: {
        card: "summary",
        title: `${fullName} | Developer Portfolio`,
        description: `${bio}${location}. View projects and connect with ${fullName}.`,
        images: [user.profileImage || "https://devspacee.me/default-profile.png"],
        creator: `@${username}`,
      },
      alternates: {
        canonical: `https://devspacee.me/${username}`,
      },
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
    };
  } catch (error) {
    console.error('Error generating metadata for user:', username, error);
    return {
      title: `${username} | Developer Portfolio`,
      description: `Portfolio of ${username} - Developer, Engineer, and Tech Enthusiast. View projects and achievements.`,
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

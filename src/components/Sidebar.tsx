import Link from "next/link";
import {
    House,
    Layers,
    LetterText,
    FileBadge,
    Gpu,
    FileUser,
    GitPullRequestArrow,
} from "lucide-react";

export default function Sidebar() {
    return (
        <div className="flex flex-col h-screen bg-white/80 w-full px-2 md:px-4 py-6 md:py-8">
            {/* Logo */}
            <div className="flex justify-center px-2 md:px-4 py-1">
                <h1 className="text-xl md:text-2xl font-bold text-primaryText text-center logo">
                    <span className="text-primary logo">Dev</span>
                    <span className="logo"> Space</span>
                </h1>
            </div>


            {/* Description (Only on md+) */}
            <p className="text-xs text-secondaryText text-center hidden lg:block">
                Your development hub
            </p>

            <div className="border-b border-gray-200 my-3 hidden md:block" />

            {/* Menus */}
            <nav className="flex-1 text-secondaryText mt-4 space-y-2">
                {menuItems.map(({ href, icon: Icon, label }) => (
                    <Link
                        key={label}
                        href={href}
                        className="flex items-center gap-3 justify-center md:justify-start px-3 md:px-4 py-2 text-sm hover:text-primaryText transition-colors duration-150 group hover:border-r-4 border-primary rounded-[4px]"
                    >
                        <Icon className="h-5 w-5 text-secondaryText group-hover:text-primary" />
                        <span className="hidden md:inline font-medium text-[16px] tracking-wide">{label}</span>
                    </Link>
                ))}
            </nav>

            {/* Bottom Card */}
            <div className="mt-auto mb-6 hidden md:block">
                <div className="bg-gradient-to-r from-primary/75 to-primary rounded-xl p-4">
                    <h3 className="font-semibold text-white text-center">Upgrade to Pro</h3>
                    <p className="text-sm text-white mt-1 text-center">
                        Unlock premium features and tools for your development workflow.
                    </p>
                </div>
            </div>
        </div>
    );
}

const menuItems = [
    { href: "/home", icon: House, label: "Home" },
    { href: "/projects", icon: Layers, label: "Projects" },
    { href: "/blog", icon: LetterText, label: "Blog" },
    { href: "/achievements", icon: FileBadge, label: "Achievements" },
    { href: "/tech", icon: Gpu, label: "Tech Stack" },
    { href: "/resume", icon: FileUser, label: "Resume" },
    { href: "/contributions", icon: GitPullRequestArrow, label: "Contributions" },
];

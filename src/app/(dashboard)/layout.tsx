"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { getUserProfile } from "@/lib/apiClient";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkProfileCompletion = async () => {
            try {
                // Skip check for profile routes
                if (pathname === '/profile' || pathname === '/profile/edit') {
                    setIsLoading(false);
                    return;
                }

                const response = await getUserProfile();
                const user = response.user;

                // If profile is not completed and user is not on profile page, redirect to profile
                if (!user.profileCompleted) {
                    toast.info('Please complete your profile to access all features!');
                    router.push('/profile');
                    return;
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error checking profile completion:', error);
                setIsLoading(false);
            }
        };

        checkProfileCompletion();
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="bg-background dark:bg-[#0B1437] h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background dark:bg-[#0B1437] h-screen flex">
            {/* Sidebar */}
            <div className="w-[18%] sm:w-[12%] md:w-[8%] lg:w-[18%] xl:w-[18%]">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="w-[82%] sm:w-[88%] md:w-[92%] lg:w-[82%] xl:w-[82%] overflow-y-auto">
                <Navbar />
                {children}
            </div>
        </div>
    );
}

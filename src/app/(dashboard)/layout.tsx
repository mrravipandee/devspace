"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { getUserProfile } from "@/lib/apiClient";
import { useTheme } from "@/context/ThemeContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const { currentTheme, isLoaded } = useTheme();

    useEffect(() => {
        const checkProfileCompletion = async () => {
            try {
                // Skip check for profile routes
                if (pathname === '/profile' || pathname === '/profile/edit') {
                    setIsLoading(false);
                    return;
                }

                console.log('Checking profile completion for path:', pathname);
                const response = await getUserProfile();
                const user = response.user;

                console.log('Profile completion status:', user.profileCompleted);

                // If profile is not completed and user is not on profile page, redirect to profile
                if (!user.profileCompleted) {
                    console.log('Profile not completed, redirecting to /profile');
                    toast.info('Please complete your profile to access all features!');
                    router.push('/profile');
                    return;
                }

                console.log('Profile completed, staying on current page');
                setIsLoading(false);
                setRetryCount(0); // Reset retry count on success
            } catch (error) {
                console.error('Error checking profile completion:', error);
                
                // Type guard to check if error has response property
                const axiosError = error as { response?: { status?: number } };
                
                // If it's a 401 error, redirect to login (authentication failed)
                if (axiosError?.response?.status === 401) {
                    console.log('Authentication failed (401), redirecting to login');
                    router.push('/login');
                    return;
                }
                
                // For other errors, retry a few times
                if (retryCount < 2) {
                    console.log(`Retrying profile check (attempt ${retryCount + 1})`);
                    setRetryCount(prev => prev + 1);
                    setTimeout(() => {
                        checkProfileCompletion();
                    }, 1000); // Wait 1 second before retry
                    return;
                }
                
                // If all retries failed, redirect to login
                console.log('All retries failed, redirecting to login');
                router.push('/login');
            }
        };

        checkProfileCompletion();
    }, [pathname, router, retryCount]);

    if (isLoading) {
        return (
            <div className={`${currentTheme.bg} h-screen flex items-center justify-center`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className={`${currentTheme.text}`}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${currentTheme.bg} h-screen flex`}>
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

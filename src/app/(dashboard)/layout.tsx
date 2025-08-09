import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
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

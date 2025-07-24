import { Bell, Moon, Search } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="w-full px-4 py-3 mt-2 flex justify-end">
      <div className="bg-white px-6 py-2 rounded-full flex justify-end items-center gap-4">
        {/* Search Bar */}
        <div className="w-3/5 hidden md:block">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 relative">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <Image
            src="/avtar_logo.avif"
            height={40}
            width={40}
            alt="User profile"
            className="rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  );
}

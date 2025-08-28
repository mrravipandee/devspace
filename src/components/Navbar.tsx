"use client";

import { Bell, Moon, Sun, Search, ChevronDown, Book, Cpu, User, Settings, LogOut, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserProfile } from '@/lib/apiClient';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState<{
    profileImage?: string;
    fullName?: string;
    username?: string;
    email?: string;
    profileCompleted?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { darkMode, toggleDarkMode, currentTheme } = useTheme();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await getUserProfile();
      setUserData(response.user);
    } catch (error: unknown) {
      console.error('Failed to fetch user data:', error);
      // Don't show error toast for navbar, just log it
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Data
  const notifications = [
    {
      id: 1,
      msg: "New features are added",
      icon: <Book className="h-4 w-4" />,
      time: "2 hours ago",
    },
    {
      id: 2,
      msg: "Backend API Restful 2.0",
      icon: <Cpu className="h-4 w-4" />,
      time: "1 day ago",
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error(data.msg || "Logout failed");
      }
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const profileMenu = [
    { label: "Profile", icon: <User className="h-4 w-4" />, href: "/profile" },
    { label: "Settings", icon: <Settings className="h-4 w-4" />, href: "/setting" },
    { 
      label: "Refresh Data", 
      icon: <RefreshCw className="h-4 w-4" />, 
      onClick: fetchUserData 
    },
    { 
      label: "Logout", 
      icon: <LogOut className="h-4 w-4" />, 
      onClick: handleLogout 
    },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
      
      <nav className="w-full px-4 py-3 mt-2 flex justify-end relative">
        <div className={`${currentTheme.bg} px-6 py-2 rounded-full flex justify-end items-center gap-4 shadow-sm`}>
          {/* Search Bar */}
          <div className="w-3/5 hidden md:block">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 ${currentTheme.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition duration-200"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 relative"
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className={`absolute right-[-4px] top-[3.6rem] w-[12.2rem] md:w-72 ${currentTheme.bg} border border-gray-200 dark:border-gray-900 rounded-lg shadow-lg z-50`}>
                  {/* Arrow indicator */}
                  <div className={`absolute -top-2 right-4 w-4 h-4 rotate-45 ${currentTheme.bg} border-t border-l border-gray-200 dark:border-gray-700`} />
                  
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className={`font-medium text-[12px] md:text-[16px] ${currentTheme.text}`}>
                      Notifications
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <li key={notification.id}>
                        <div className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-900">
                          <div className={`flex-shrink-0 mt-1 mr-3 ${currentTheme.text}`}>
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[10px] md:text-sm font-medium ${currentTheme.text}`}>
                              {notification.msg}
                            </p>
                            <p className="text-[8px] md:text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                aria-label="User menu"
                aria-expanded={showProfileMenu}
              >
                {isLoading ? (
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ) : (
                  <Image
                    src={userData?.profileImage || "/avtar_logo.avif"}
                    height={36}
                    width={36}
                    alt="User profile"
                    className="rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:border-primary-500 transition-colors duration-200"
                  />
                )}
                <ChevronDown className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className={`absolute right-0 top-[3.6rem] md:w-64 w-56 ${currentTheme.bg} border border-gray-200 dark:border-gray-900 rounded-lg shadow-lg z-50`}>
                  {/* Arrow indicator */}
                  <div className={`absolute -top-2 right-4 w-4 h-4 rotate-45 ${currentTheme.bg} border-t border-l border-gray-200 dark:border-gray-900`} />
                  
                  {/* User Info Section */}
                  {userData && (
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <Image
                          src={userData.profileImage || "/avtar_logo.avif"}
                          height={40}
                          width={40}
                          alt="User profile"
                          className="rounded-full border-2 border-gray-300 dark:border-gray-600"
                        />
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${currentTheme.text}`}>
                            {userData.fullName || userData.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            @{userData.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {userData.email}
                          </p>
                          {userData.profileCompleted ? (
                            <div className="flex items-center mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                                Complete
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1"></span>
                                Incomplete
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <ul className="py-1">
                    {profileMenu.map((item, index) => (
                      <li key={index}>
                        {item.onClick ? (
                          <button
                            onClick={item.onClick}
                            className={`w-full flex items-center px-4 py-2 text-sm ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-700`}
                          >
                            <span className="mr-2">{item.icon}</span>
                            {item.label}
                          </button>
                        ) : (
                          <a
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-sm ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-700`}
                          >
                            <span className="mr-2">{item.icon}</span>
                            {item.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
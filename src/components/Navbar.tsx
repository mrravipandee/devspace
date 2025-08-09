"use client";

import { Bell, Moon, Sun, Search, ChevronDown, Book, Cpu, User, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

  // Dark mode initialization
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else if (systemPrefersDark) {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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

  const profileMenu = [
    { label: "Profile", icon: <User className="h-4 w-4" />, href: "#" },
    { label: "Settings", icon: <Settings className="h-4 w-4" />, href: "#" },
    { label: "Logout", icon: <LogOut className="h-4 w-4" />, href: "#" },
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
    <nav className="w-full px-4 py-3 mt-2 flex justify-end relative">
      <div className="bg-white dark:bg-cardDark px-6 py-2 rounded-full flex justify-end items-center gap-4 shadow-sm dark:shadow-gray-700/20">
        {/* Search Bar */}
        <div className="w-3/5 hidden md:block">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-900 dark:bg-gray-900 dark:text-white rounded-full bg-gray-50 text-primaryText placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
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
              <div className="absolute right-[-4px] top-[3.6rem] w-[12.2rem] md:w-72 bg-white dark:bg-[#1B254B] border border-gray-200 dark:border-gray-900 rounded-lg shadow-lg z-50">
                {/* Arrow indicator */}
                <div className="absolute -top-2 right-4 w-4 h-4 rotate-45 bg-white dark:bg-[#1B254B] border-t border-l border-gray-200 dark:border-gray-700" />
                
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-[12px] md:text-[16px] text-primaryText dark:text-white">
                    Notifications
                  </h3>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <div className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-900">
                        <div className="flex-shrink-0 mt-1 mr-3 text-gray-500 dark:text-white">
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] md:text-sm font-medium text-gray-800 dark:text-gray-200">
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
              <Image
                src="/avtar_logo.avif"
                height={36}
                width={36}
                alt="User profile"
                className="rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:border-primary-500 transition-colors duration-200"
              />
              <ChevronDown className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-[3.6rem] md:w-52 w-48 bg-white dark:bg-[#1B254B] border border-gray-200 dark:border-gray-900 rounded-lg shadow-lg z-50">
                {/* Arrow indicator */}
                <div className="absolute -top-2 right-4 w-4 h-4 rotate-45 bg-white dark:bg-[#1B254B] border-t border-l border-gray-200 dark:border-gray-900" />
                
                <ul className="py-1">
                  {profileMenu.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
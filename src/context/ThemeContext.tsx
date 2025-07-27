"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'purple' | 'orange' | 'green' | 'blue-purple';

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    currentTheme: {
        bg: string;
        text: string;
        primary: string;
        secondary: string;
    };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [theme, setTheme] = useState<Theme>('purple');

    const themeClasses = {
        purple: {
            bg: darkMode ? 'bg-gray-900' : 'bg-purple-50',
            text: darkMode ? 'text-purple-200' : 'text-purple-900',
            primary: darkMode ? 'bg-purple-800' : 'bg-purple-600',
            secondary: darkMode ? 'bg-purple-900' : 'bg-purple-500',
        },
        orange: {
            bg: darkMode ? 'bg-gray-900' : 'bg-orange-50',
            text: darkMode ? 'text-orange-200' : 'text-orange-900',
            primary: darkMode ? 'bg-orange-800' : 'bg-orange-600',
            secondary: darkMode ? 'bg-orange-900' : 'bg-orange-500',
        },
        green: {
            bg: darkMode ? 'bg-gray-900' : 'bg-green-50',
            text: darkMode ? 'text-green-200' : 'text-green-900',
            primary: darkMode ? 'bg-green-800' : 'bg-green-600',
            secondary: darkMode ? 'bg-green-900' : 'bg-green-500',
        },
        'blue-purple': {
            bg: darkMode ? 'bg-gray-900' : 'bg-indigo-50',
            text: darkMode ? 'text-indigo-200' : 'text-indigo-900',
            primary: darkMode ? 'bg-indigo-800' : 'bg-indigo-600',
            secondary: darkMode ? 'bg-indigo-900' : 'bg-indigo-500',
        },
    };

    const currentTheme = themeClasses[theme];

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const value = {
        theme,
        setTheme,
        darkMode,
        toggleDarkMode,
        currentTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
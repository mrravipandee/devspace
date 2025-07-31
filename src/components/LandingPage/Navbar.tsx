'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Add scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (menuOpen && !event.target.closest('.navbar-container')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    // Check if link is active
    const isActive = (href: string) => {
        return pathname === href;
    };

    return (
        <nav className={`fixed top-4 left-4 right-4 mx-auto max-w-[1800px] rounded-xl z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/70 backdrop-blur-md shadow-lg border border-white/20'
                : 'bg-white/30 backdrop-blur-sm border border-white/10'
            } hover:bg-white/50 hover:backdrop-blur-md hover:border-white/30 transition-all duration-300`}>
            <div className="container mx-auto px-6 py-3 navbar-container">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-[1.5rem] font-bold text-primary hover:text-primary/90 transition-colors flex items-center logo"
                    >
                        Dev <span className='text-primaryText ml-[2px]'>Space</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="#features"
                            className={`relative text-gray-700 hover:text-purple-600 transition-colors font-medium group ${isActive('/features') ? 'text-purple-600' : ''}`}
                        >
                            Features
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full ${isActive('/features') ? 'w-full' : ''}`}></span>
                        </Link>
                        <Link
                            href="#pricing"
                            className={`relative text-gray-700 hover:text-purple-600 transition-colors font-medium group ${isActive('/pricing') ? 'text-purple-600' : ''}`}
                        >
                            Pricing
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full ${isActive('/pricing') ? 'w-full' : ''}`}></span>
                        </Link>
                        <Link
                            href="#faq"
                            className={`relative text-gray-700 hover:text-purple-600 transition-colors font-medium group ${isActive('/faq') ? 'text-purple-600' : ''}`}
                        >
                            FAQ
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full ${isActive('/faq') ? 'w-full' : ''}`}></span>
                        </Link>
                        <div className="flex items-center space-x-4 ml-4">
                            <Link
                                href="/login"
                                className={`px-4 py-2 border rounded-lg transition-colors font-medium ${isActive('/login') ? 'bg-purple-600 text-white border-purple-600' : 'border-purple-600 text-purple-600 hover:bg-purple-50'}`}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className={`px-4 py-2 bg-gradient-to-r rounded-lg transition-all shadow-lg font-medium ${isActive('/signup') ? 'from-purple-700 to-indigo-700' : 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'} text-white hover:shadow-purple-300/50`}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Toggle Button */}
                    <button
                        className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? (
                            <X size={24} className="text-purple-600" />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 pt-4 pb-6' : 'max-h-0'}`}>
                    <div className="flex flex-col space-y-4 px-2">
                        <Link
                            href="#features"
                            className={`text-gray-700 transition-colors font-medium py-2 px-3 rounded-lg ${isActive('/features') ? 'bg-purple-50 text-purple-600' : 'hover:bg-purple-50 hover:text-purple-600'}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className={`text-gray-700 transition-colors font-medium py-2 px-3 rounded-lg ${isActive('/pricing') ? 'bg-purple-50 text-purple-600' : 'hover:bg-purple-50 hover:text-purple-600'}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#faq"
                            className={`text-gray-700 transition-colors font-medium py-2 px-3 rounded-lg ${isActive('/faq') ? 'bg-purple-50 text-purple-600' : 'hover:bg-purple-50 hover:text-purple-600'}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            FAQ
                        </Link>
                        <div className="flex flex-col space-y-3 pt-2 border-t border-gray-100 mt-2">
                            <Link
                                href="/login"
                                className={`text-center px-4 py-2 border rounded-lg transition-colors font-medium ${isActive('/login') ? 'bg-purple-600 text-white border-purple-600' : 'border-purple-600 text-purple-600 hover:bg-purple-50'}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className={`text-center px-4 py-2 bg-gradient-to-r rounded-lg transition-all font-medium ${isActive('/signup') ? 'from-purple-700 to-indigo-700' : 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'} text-white`}
                                onClick={() => setMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
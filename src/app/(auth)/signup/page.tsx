"use client";
import { Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate signup
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row-reverse min-h-screen">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className=" p-6 sm:p-8 w-full max-w-md"
                >
                    <div className="text-start mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-2">Sign Up</h2>
                        <p className="text-secondaryText text-[11px] sm:text-[13px]">Create an account to get started</p>
                    </div>

                    {/* Social Login Buttons - Same Line */}
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 bg-background rounded-2xl py-3 px-4 hover:bg-background/80 transition-all duration-200"
                        >
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                                alt="Google Logo"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                            />
                            <span className="text-sm sm:text-base">Google</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 bg-background rounded-2xl py-3 px-4 hover:bg-background/80 transition-all duration-200"
                        >
                            <Github className="w-5 h-5" />
                            <span className="text-sm sm:text-base">GitHub</span>
                        </motion.button>
                    </div>

                    <div className="flex items-center my-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="px-4 text-gray-500 text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Signup Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                Email Address*
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                                Username*
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                Password*
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                                Confirm Password*
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                className="h-4 w-4 text-primary focus:ring-primary/95 border-gray-300 rounded transition"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                I agree to the <Link href="/terms" className="text-primary hover:text-primary/95">Terms</Link> and <Link href="/privacy" className="text-primary hover:text-primary/95">Privacy Policy</Link>
                            </label>
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/95 transition-all duration-200 font-medium flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-primary hover:text-primary/95 font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative w-1/2 min-h-screen">
                <Image
                    src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Signup Background"
                    fill
                    className="object-cover rounded-br-[14rem]"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 rounded-br-[14rem] flex flex-col justify-between p-12 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h3 className="text-4xl font-bold mb-4">Welcome!</h3>
                        <p className="text-xl max-w-md">Join our community and start your journey with us today.</p>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Footer */}
            <div className="lg:hidden py-4 text-center text-sm text-gray-500 mt-auto">
                © {new Date().getFullYear()} Your Brand. All rights reserved.
            </div>
        </div>
    );
}
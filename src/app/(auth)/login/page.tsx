"use client";
import { Link2, Moon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Login successful');
                router.push('/home');
            } else {
                setError(data?.msg || 'Invalid credentials');
                toast.error(data?.msg || 'Invalid credentials');
            }
        } catch (error) {
            setError('Login failed. Please try again.');
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                theme="light"
            />
            
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-6 sm:p-8 w-full max-w-md"
                    >
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                            </motion.div>
                            <div className="text-start mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-2">Sign In</h2>
                                <p className="text-secondaryText text-[11px] sm:text-[13px]">Enter your credentials to access your account</p>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Google Login */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-4 mb-6 bg-background transition-all duration-200"
                        >
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                                alt="Google Logo"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                            />
                            <span className="text-[11px] sm:text-[13px]">Sign in with Google</span>
                        </motion.button>

                        <div className="flex items-center my-6">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="px-4 text-gray-500 text-sm">OR</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div>

                        {/* Login Form */}
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
                                    className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="your@email.com"
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
                                    className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-primary focus:ring-primary/80 border-gray-300 rounded transition"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/signup"
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Sign up
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Image */}
                <div className="hidden lg:block relative w-1/2 min-h-screen">
                    <Image
                        src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                        alt="Login Background"
                        fill
                        className="object-cover rounded-bl-[14rem]"
                        priority
                        quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 rounded-bl-[14rem] flex flex-col justify-between p-12 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <h3 className="text-4xl font-bold mb-4">Welcome! <span className='logo'>Dev Space</span></h3>
                            <p className="text-xl max-w-md">Beautiful tagline or description about your platform goes here.</p>
                        </motion.div>
                        <motion.div
                            className="flex justify-end gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <button
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Twitter"
                            >
                                <Moon className="h-6 w-6" />
                            </button>
                            <button
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="GitHub"
                            >
                                <Link2 className="h-6 w-6" />
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Footer */}
                <div className="lg:hidden py-4 text-center text-sm text-secondaryText mt-auto">
                    © {new Date().getFullYear()} <span className='logo'>Dev space</span>. All rights reserved.
                </div>
            </div>
        </>
    );
}
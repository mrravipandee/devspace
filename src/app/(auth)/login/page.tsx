"use client";
import { Link2, Moon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen ">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600">Enter your credentials to access your account</p>
                    </div>

                    {/* Google Login */}
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 px-4 mb-6 hover:bg-gray-50 transition-colors">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                            alt="Google Logo"
                            width={20}
                            height={20}
                        />
                        <span>Continue with Google</span>
                    </button>

                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="px-4 text-gray-500 text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                Email Address*
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative w-1/2 min-h-screen">
                <Image
                    src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Login Background"
                    fill
                    className="object-cover rounded-bl-[14rem]"
                    priority
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-12 text-white">
                    <div>
                        <h3 className="text-4xl font-bold mb-4">Your Brand Name</h3>
                        <p className="text-xl max-w-md">Beautiful tagline or description about your platform goes here.</p>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <span className="sr-only">Twitter</span>
                            {/* Replace with your icon */}
                            <Moon className="h-6 w-6" />
                        </button>
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <span className="sr-only">GitHub</span>
                            {/* Replace with your icon */}
                            <Link2 className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
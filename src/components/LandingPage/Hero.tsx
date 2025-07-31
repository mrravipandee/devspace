'use client';

import { X, Star, StarHalf } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    return (
        <div>
            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 md:py-32 max-w-7xl">
                <div className="flex flex-col items-center text-center">
                    {/* User Reviews */}
                    <div className="flex flex-col items-center mb-10 mt-12">
                        <div className="flex text-yellow-400 gap-1 mb-3">
                            {[...Array(4)].map((_, i) => (
                                <Star key={i} size={20} fill="currentColor" />
                            ))}
                            <StarHalf size={20} fill="currentColor" />
                        </div>
                        <p className="text-[12px] md:text-lg text-lightText">
                            Trusted by 100+ developers worldwide
                        </p>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-[25px] md:text-6xl font-bold mb-6 max-w-4xl leading-tight text-primaryText">
                        Transform your static portfolio into a dynamic showcase in minutes
                    </h1>
                    <p className="text-[13px] md:text-xl mb-10 max-w-2xl text-secondaryText">
                        Completely free — no backend required, no hidden costs
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => router.push('/signup')} className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-primary/30">
                            Get Started Free
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
                        >
                            See Live Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* YouTube Video Modal */}
            {isMounted && isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Demo</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="aspect-w-16 aspect-h-9 w-full">
                            <iframe
                                className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
                                src="https://www.youtube.com/embed/UuGf9fYHOpo?si=K1cx8xbYd4mMsqTf"
                                title="Demo Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Press ESC or click outside to close
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
'use client';

import { X, Star, StarHalf } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll-based animations
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    // Animate scale, rotation, position, and fade out as user scrolls
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
    const rotate = useTransform(scrollYProgress, [0, 1], [12, 90]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    return (
        <div ref={containerRef} className="relative overflow-hidden">
            <section className="container mx-auto px-6 py-20 md:py-32 max-w-7xl">
                <div className="flex flex-col items-center text-center">
                    {/* Stars rating */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center mb-10 mt-12"
                    >
                        <div className="flex text-primary gap-1 mb-3">
                            {[...Array(4)].map((_, i) => (
                                <Star key={i} size={20} fill="currentColor" />
                            ))}
                            <StarHalf size={20} fill="currentColor" />
                        </div>
                        <p className="text-[12px] md:text-lg text-lightText">
                            Trusted by 100+ developers worldwide
                        </p>
                    </motion.div>

                    {/* Main heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-[25px] md:text-6xl font-bold mb-6 max-w-4xl leading-tight text-primaryText"
                    >
                        Transform your static portfolio into a dynamic showcase in minutes
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-[13px] md:text-xl mb-10 max-w-2xl text-secondaryText"
                    >
                        Completely free — no backend required, no hidden costs
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            onClick={() => router.push('/signup')}
                            className="px-8 py-3 bg-primary/80 text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-primary/30"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
                        >
                            See Live Demo
                        </button>
                    </motion.div>
                </div>

                {/* Animated Images */}
                <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        style={{ scale, rotate, y, opacity }}
                        className="absolute top-[15%] left-20 w-[200px] origin-center"
                    >
                        <Image
                            src="/user_in_frame.png"
                            height={200}
                            width={200}
                            className="rounded-[30px] object-cover shadow-xl"
                            alt="Phone user mode left"
                        />
                    </motion.div>

                    <motion.div
                        style={{ scale, rotate, y, opacity }}
                        className="absolute top-[15%] right-[5%] w-[220px] origin-center"
                    >
                        <Image
                            src="/user_in_frame.png"
                            height={400}
                            width={200}
                            className="rounded-[30px] object-cover shadow-xl h-[30rem]"
                            alt="Phone user mode right"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

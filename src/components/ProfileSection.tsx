"use client";

import Image from "next/image";
import { Github, Twitter, Linkedin, Dribbble, ChevronRight, ExternalLink } from "lucide-react";

type ProfileSectionProps = {
    theme: {
        bg: string;
        text: string;
        primary: string;
        secondary: string;
    };
    username?: string;
};

const ProfileSection = ({ theme, username }: ProfileSectionProps) => {
    return (
        <section className={`${theme.bg} ${theme.text} py-12 px-4 md:px-8`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    {/* Profile Image with Modern Border */}
                    <div className="w-full md:w-2/5 flex justify-center relative group">
                        <div className="relative">

                            <Image
                                src="https://images.unsplash.com/photo-1654110455429-cf322b40a906?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D"
                                width={320}
                                height={320}
                                alt="Profile"
                                className="w-64 h-64 rounded-full object-cover border-4 border-white"
                                priority
                            />

                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="w-full md:w-3/5 space-y-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold">Ravi Pandey</h2>
                            <p className="text-lg text-gray-400 mt-1">@{username || "mrravipandee"}</p>
                            <p className="text-xl mt-3">Frontend Developer & UI Designer</p>
                        </div>

                        <p className="text-lg leading-relaxed">
                            I create beautiful, functional digital experiences with React and modern web technologies.
                            Passionate about turning complex problems into elegant solutions.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="https://dribbble.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Dribbble"
                            >
                                <Dribbble className="w-5 h-5" />
                            </a>
                        </div>

                        {/* Modern Buttons */}

                        <div className="flex flex-wrap gap-3">
                            <a
                                href="#projects"
                                className={`px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2`}
                            >
                                <span>View Projects</span>
                                <ChevronRight className="w-4 h-4" />
                            </a>
                            <a
                                href="#blog"
                                className={`px-6 py-3 rounded-lg  font-medium hover:opacity-90 transition-opacity flex items-center gap-2`}
                            >
                                <span>Read Blog</span>
                                <ChevronRight className="w-4 h-4" />
                            </a>
                            <a
                                href="#contact"
                                className={`px-6 py-3 rounded-lg ${theme.primary}  font-medium hover:bg-opacity-10 transition-colors flex items-center gap-2`}
                            >
                                <span>Visit Website</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileSection;
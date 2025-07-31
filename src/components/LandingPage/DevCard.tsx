import Image from "next/image";
import { Twitter, Github, Linkedin } from "lucide-react";


export default function DevCard() {
    return (
        <div>
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
                        <div className="flex flex-col md:flex-row">
                            {/* Image Section */}
                            <div className="w-full md:w-1/3 p-8 flex justify-center md:justify-end relative">
                                <div className="relative aspect-square w-64 h-64 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-lg group">
                                    <Image
                                        src="/devspace_dev.jpeg"
                                        alt="Ravi Pandey"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <button className="text-white font-medium bg-primary/90 hover:bg-primary px-4 py-2 rounded-lg transition-all transform translate-y-2 group-hover:translate-y-0">
                                            View Portfolio
                                        </button>
                                    </div>

                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="w-full md:w-2/3 p-8 md:p-12">
                                <div className="flex flex-col h-full justify-center">
                                    <div className="mb-6">
                                        <h2 className="text-4xl font-bold text-gray-900">
                                            Ravi Pandey
                                            <span className="block text-primary text-xl font-normal mt-1">@mrravipandee</span>
                                        </h2>
                                        <div className="flex items-center mt-4">
                                            <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                                            <span className="text-sm text-gray-600">Available for freelance work</span>
                                        </div>
                                    </div>

                                    <p className="text-lg mb-8 text-gray-600 leading-relaxed border-l-4 border-primary/30 pl-4">
                                        Full-stack developer passionate about creating tools that make developer&apos;s lives easier.
                                        I built DevSpace to help fellow developers showcase their work without the hassle of
                                        maintaining complex portfolios.
                                    </p>

                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {['React', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'TypeScript'].map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors cursor-default"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex gap-2">
                                            <a
                                                href="#"
                                                className="p-3 rounded-full hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-md"
                                                aria-label="Twitter"
                                            >
                                                <Twitter size={20} className="text-primary hover:text-blue-400 transition-colors" />
                                            </a>
                                            <a
                                                href="#"
                                                className="p-3 rounded-full hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-md"
                                                aria-label="GitHub"
                                            >
                                                <Github size={20} className="text-primary hover:text-gray-700 transition-colors" />
                                            </a>
                                            <a
                                                href="#"
                                                className="p-3 rounded-full hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-md"
                                                aria-label="LinkedIn"
                                            >
                                                <Linkedin size={20} className="text-primary hover:text-blue-600 transition-colors" />
                                            </a>
                                        </div>

                                        <a
                                            href="#"
                                            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:from-primary-dark hover:to-primary transition-all font-medium flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <span>Contact Me</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="animate-bounce-horizontal"
                                            >
                                                <path d="M4 4h16v16H4z"></path>
                                                <path d="M12 8v8"></path>
                                                <path d="M8 12h8"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
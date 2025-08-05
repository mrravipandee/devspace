import Image from "next/image";
import { Twitter, Github, Linkedin, MessageSquarePlus } from "lucide-react";
import Link from "next/link";


export default function DevCard() {
    return (
        <div>
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
                        <div className="flex flex-col md:flex-row">
                            {/* Image Section */}
                            <div className="w-full md:w-1/3 p-8 flex justify-center md:justify-end relative">
                                <div className="relative aspect-square w-64 h-64 md:h-full rounded-2xl overflow-hidden border-4 border-primary_landing/20 shadow-lg group">
                                    <Image
                                        src="/img_dev.jpeg"
                                        alt="Ravi Pandey"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <button  className="text-white font-medium rounded-lg transition-all transform translate-y-2 group-hover:translate-y-0">
                                            Ravi Pandey @Dev
                                        </button>
                                    </div>

                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="w-full md:w-2/3 p-8 md:p-12">
                                <div className="flex flex-col h-full justify-center">
                                    <div className="mb-6">
                                        <h2 className="text-3xl md:text-4xl font-bold text-primary_landing">
                                            Ravi Pandey
                                            <span className="block text-primary_landing text-[16px] md:text-xl font-normal mt-[-4px] md:mt-1">@mrravipandee</span>
                                        </h2>
                                        <div className="flex items-center mt-4">
                                            <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                                            <span className="text-[12px] md:text-sm text-gray-600">Available for freelance work</span>
                                        </div>
                                    </div>

                                    <p className="text-[13px] md:text-lg mb-8 text-gray-600 leading-relaxed border-l-4 border-primary_landing/30 pl-4">
                                        Full-stack developer passionate about creating tools that make developer&apos;s lives easier.
                                        I built DevSpace to help fellow developers showcase their work without the hassle of
                                        maintaining complex portfolios.
                                    </p>

                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {['React', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'TypeScript'].map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-[10px] md:px-4 py-1.5 bg-primary_landing/10 text-primary_landing rounded-full text-[10px] md:text-sm font-medium hover:bg-primary_landing/20 transition-colors cursor-default"
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
                                                <Twitter size={20} className="text-primary_landing hover:text-blue-400 transition-colors" />
                                            </a>
                                            <a
                                                href="#"
                                                className="p-3 rounded-full hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-md"
                                                aria-label="GitHub"
                                            >
                                                <Github size={20} className="text-primary_landing hover:text-gray-700 transition-colors" />
                                            </a>
                                            <a
                                                href="#"
                                                className="p-3 rounded-full hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-md"
                                                aria-label="LinkedIn"
                                            >
                                                <Linkedin size={20} className="text-primary_landing hover:text-blue-600 transition-colors" />
                                            </a>
                                        </div>

                                        <Link
                                            href="https://imravidev.vercel.app/about" target="_blank"
                                            className="px-6 py-3 bg-primary_landing text-white rounded-lg hover:from-primary_landing-dark hover:to-primary_landing transition-all font-medium flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <span>Contact Me</span>
                                            <MessageSquarePlus className="animate-bounce-horizontal" />
                                        </Link>
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
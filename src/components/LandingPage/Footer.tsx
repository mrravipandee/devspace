import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <div>
            <footer className="py-12 px-6 bg-primary_landing">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
                        {/* Left Side */}
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-2 text-white">
                                DevSpace
                            </h3>
                            <p className="max-w-xs text-lightText">
                                The easiest way to create and maintain your developer portfolio
                            </p>
                        </div>

                        {/* Middle - Links */}
                        <div className="grid grid-cols-2 gap-12">
                            <div>
                                <h4 className="font-semibold mb-4 text-white">
                                    Product
                                </h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-lightText hover:text-white">Features</a></li>
                                    <li><a href="#" className="text-lightText hover:text-white">Pricing</a></li>
                                    <li><a href="#" className="text-lightText hover:text-white">Examples</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4 text-white">
                                    Resources
                                </h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-lightText hover:text-white">Documentation</a></li>
                                    <li><a href="#" className="text-lightText hover:text-white">Blog</a></li>
                                    <li><a href="#" className="text-lightText hover:text-white">Support</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Side - Social */}
                        <div className="text-center md:text-right">
                            <h4 className="font-semibold mb-4 text-white">
                                Connect
                            </h4>
                            <div className="flex justify-center md:justify-end gap-4">
                                <a href="#" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                    <Twitter size={18} className="text-white" />
                                </a>
                                <a href="#" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                    <Github size={18} className="text-white" />
                                </a>
                                <a href="#" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                    <Linkedin size={18} className="text-white" />
                                </a>
                            </div>
                        </div>
                    </div>

                    

                    <div className="border-t border-primary_landing/30 mt-12 pt-8 text-center text-sm text-lightText">
                        <p>© {new Date().getFullYear()} DevSpace. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
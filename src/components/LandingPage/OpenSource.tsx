import { Code, Github, Users, HeartHandshake } from "lucide-react";

export default function OpenSource() {
    return (
        <div>
            <section className="py-20 bg-primaryText">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-[26px] md:text-4xl font-bold mb-6 text-white">
                            Why Open Source?
                        </h2>
                        <p className="text-[14px] md:text-xl mb-10 text-lightText">
                            We believe in transparency and community-driven development.
                            DevSpace is built by developers, for developers.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {[
                                {
                                    title: "Transparency",
                                    description: "Every line of code is open for inspection and improvement",
                                    icon: <Code size={24} className="text-white" />
                                },
                                {
                                    title: "Community",
                                    description: "Built with contributions from developers worldwide",
                                    icon: <Users size={24} className="text-white" />
                                },
                                {
                                    title: "Freedom",
                                    description: "Use, modify, and distribute without restrictions",
                                    icon: <HeartHandshake size={24} className="text-white" />
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-lg bg-primary/40"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 mx-auto bg-primary/30">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-[16px] md:text-xl font-semibold mb-2 text-white">{item.title}</h3>
                                    <p className="text-[12px] md:text-[15px] text-lightText">{item.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl p-8 max-w-2xl mx-auto bg-primary/20">
                            <h3 className="text-lg md:text-2xl font-semibold mb-4 text-white">Ready to contribute?</h3>
                            <p className="mb-6 text-lightText text-[12px] md:text-[16px]">
                                Join our growing community of contributors and help shape the future of <span className="logo">DevSpace</span>.
                            </p>
                            <a
                                href="https://github.com/devspace"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors mx-auto bg-primary text-white hover:bg-primary/90"
                            >
                                <Github size={20} />
                                Star the Repository
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
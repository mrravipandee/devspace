import { Code, Github, Users, HeartHandshake } from "lucide-react";

export default function OpenSource() {
    return (
        <div className="relative">
            <section className="py-20 bg-primary_landing">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="mx-auto text-center">
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
                                    className="p-6 rounded-lg bg-background py-10"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 mx-auto bg-primaryText">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-[16px] md:text-xl font-semibold mb-2 text-primaryText">{item.title}</h3>
                                    <p className="text-[12px] md:text-[15px] text-lightText">{item.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl p-8 max-w-2xl mx-auto bg-background mb-10">
                            <h3 className="text-lg md:text-2xl font-semibold mb-4 text-primaryText">Ready to contribute?</h3>
                            <p className="mb-6 text-lightText text-[12px] md:text-[16px]">
                                Join our growing community of contributors and help shape the future of <span className="logo">DevSpace</span>.
                            </p>
                            <a
                                href="https://github.com/devspace"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors mx-auto bg-primaryText text-white hover:bg-primary_landingText/90"
                            >
                                <Github size={20} />
                                Star the Repository
                            </a>
                        </div>
                    </div>
                </div>

                {/* Asymmetrical design at bottom */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                    <svg
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        className="relative block w-full h-[100px] rotate-360"
                    >
                        <path
                            d="M0,120V60c100,30,300,20,400-10s200-30,400,10,300,20,400-10V120Z"
                            className="fill-background "
                        />
                        <path
                            d="M0,120V80c150,20,350,0,450-20s250-10,400,20,300,10,350-10V120Z"
                            className="fill-background"
                        />
                    </svg>
                </div>
            </section>
        </div>
    )
}
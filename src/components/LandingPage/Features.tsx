import { Zap, Monitor, Globe, BarChart2 } from "lucide-react"

export default function Features() {
    return (
        <div>
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-[25px] md:text-4xl font-bold mb-4 text-primaryText">
                            Unmatchable Features. Free, Forever
                        </h2>
                        <p className="text-[13px] md:text-xl max-w-2xl mx-auto text-secondaryText">
                            Everything you need to showcase your work without the hassle
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Instant Setup",
                                description: "Get your portfolio live in minutes with zero configuration",
                                icon: <Zap size={24} className="text-primary_landing" />
                            },
                            {
                                title: "No Backend Needed",
                                description: "All your content updates happen without server maintenance",
                                icon: <Monitor size={24} className="text-primary_landing" />
                            },
                            {
                                title: "Custom Domains",
                                description: "Connect your own domain for a professional touch",
                                icon: <Globe size={24} className="text-primary_landing" />
                            },
                            {
                                title: "Analytics Included",
                                description: "Track your visitors with built-in analytics dashboard",
                                icon: <BarChart2 size={24} className="text-primary_landing" />
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center items-center md:justify-start md:items-start"
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-primary_landing/10">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-primaryText">
                                    {feature.title}
                                </h3>
                                <p className="text-secondaryText text-center md:text-start text-[12px] md:text-base">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
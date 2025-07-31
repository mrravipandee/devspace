import { Star, StarHalf } from "lucide-react"

export default function Hero() {

    return (
        <div>
            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 md:py-32 max-w-7xl">
                <div className="flex flex-col items-center text-center">
                    {/* User Reviews */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="flex text-yellow-400 gap-1 mb-3">
                            {[...Array(4)].map((_, i) => (
                                <Star key={i} size={20} fill="currentColor" />
                            ))}
                            <StarHalf size={20} fill="currentColor" />
                        </div>
                        <p className="text-lg text-lightText">
                            Trusted by 100+ developers worldwide
                        </p>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight text-primaryText">
                        Transform your static portfolio into a dynamic showcase in minutes
                    </h1>
                    <p className="text-xl mb-10 max-w-2xl text-secondaryText">
                        Completely free — no backend required, no hidden costs
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-primary/30">
                            Get Started Free
                        </button>
                        <button className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium">
                            See Live Demo
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
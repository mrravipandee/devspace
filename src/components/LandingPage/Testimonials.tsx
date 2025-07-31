import { Star } from "lucide-react";
import Image from "next/image";

export default function Testimonials() {
    return (
        <div>
            <section className="container mx-auto px-6 py-20 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primaryText">
                        Loved by 500+ developers
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto text-secondaryText">
                        Hear what our community has to say about DevSpace
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            name: "Alex Johnson",
                            username: "@alexdev",
                            quote: "DevSpace saved me countless hours of setup. My portfolio was live in 10 minutes!",
                            stars: 5
                        },
                        {
                            name: "Sam Rodriguez",
                            username: "@samcodes",
                            quote: "The easiest way to showcase my projects without managing servers.",
                            stars: 5
                        },
                        {
                            name: "Taylor Smith",
                            username: "@taydev",
                            quote: "I contribute to the open source project regularly. Great community!",
                            stars: 4
                        }
                    ].map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(testimonial.stars)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="italic mb-6 text-secondaryText">
                                {testimonial.quote}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                    <Image
                                        src={`/user-${index + 1}.jpg`}
                                        alt={testimonial.name}
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-primaryText">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-secondaryText">
                                        {testimonial.username}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
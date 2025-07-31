import { Star } from "lucide-react";
import Image from "next/image";

export default function Testimonials() {
    return (
        <div>
            <section className="container mx-auto px-6 py-20 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-[25px] md:text-4xl font-bold mb-2 md:mb-4 text-primaryText">
                        Loved by 500+ developers
                    </h2>
                    <p className="text-[12px] md:text-xl max-w-2xl mx-auto text-secondaryText">
                        Hear what our community has to say about <span className="logo">DevSpace</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[

                        {
                            name: "Yash Jejurkar",
                            username: "@yashdev",
                            quote:
                                "I'm a full-stack developer, and I know how critical it is to manage the backend — especially for beginners. DevSpace makes it effortless with just a few simple clicks. It saved me countless hours of setup. My portfolio was live in 10 minutes!",
                            stars: 5
                        },
                        {
                            name: "Nitesh Ray",
                            username: "@niteshdev",
                            quote:
                                "As an Android developer, I had no experience in web development. But for job applications and sharing my portfolio with recruiters, DevSpace made everything super simple. I can now easily update my resume and projects without any web dev knowledge.",
                            stars: 5
                        },
                        {
                            name: "Aman Husain",
                            username: "@amandev",
                            quote:
                                "I'm an AI/ML engineer, and creating UI for a web page was always a headache. I don’t know CSS or JS, but with DevSpace, I can easily manage and update my portfolio without writing a single line of frontend code.",
                            stars: 4
                        }


                    ].map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center md:items-start"
                        >
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(testimonial.stars)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="italic mb-6 text-secondaryText text-center md:text-start text-[13px] md:text-lg">
                                {testimonial.quote}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                    <Image
                                        src={`/user_${index + 1}.jpeg`}
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
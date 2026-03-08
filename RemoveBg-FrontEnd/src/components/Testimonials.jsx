import { Star } from "lucide-react";
import { testimonialsData } from "../assets/assets";

const Testimonials = () => {
    return (
        <div className="px-8 py-20 bg-white">
            {/* Heading */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    They <span className="text-indigo-700">love us.</span> You will too.
                </h2>
            </div>

            {/* Testimonials Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {testimonialsData.map((testimonial) => (
                    <div 
                        key={testimonial.id}
                        className="bg-gray-50 rounded-3xl p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:shadow-xl transition-all hover:scale-105"
                    >
                        {/* Rating Stars */}
                        <div className="flex gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                            "{testimonial.text}"
                        </p>

                        {/* Name and Role */}
                        <div>
                            <h4 className="font-semibold text-gray-900 text-lg">
                                {testimonial.name}
                            </h4>
                            <p className="text-indigo-600 text-sm">
                                {testimonial.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

         
        </div>
    )
}

export default Testimonials;
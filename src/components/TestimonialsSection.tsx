import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";
const testimonials = [{
  id: 1,
  name: "Robert Johnson",
  position: "CEO, Express Solutions",
  quote: "Working with Kargon has transformed our logistics operations. Their commitment to timely delivery and exceptional customer service has made a significant impact on our business efficiency.",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
}, {
  id: 2,
  name: "Sarah Williams",
  position: "Operations Manager, Global Trade",
  quote: "Kargon's professional approach to logistics management has helped us streamline our supply chain. Their attention to detail and problem-solving abilities are truly commendable.",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
}, {
  id: 3,
  name: "Michael Chen",
  position: "Founder, Tech Innovations",
  quote: "We've been working with Kargon for over 5 years now, and their service quality has been consistently excellent. They understand our needs and deliver beyond expectations.",
  avatar: "https://randomuser.me/api/portraits/men/67.jpg"
}];
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const nextTestimonial = () => {
    setActiveIndex(prev => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setActiveIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };
  const currentTestimonial = testimonials[activeIndex];
  return <section className="py-16 bg-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation className="text-center mb-12">
          <span className="text-kargon-red font-medium text-sm uppercase tracking-wider">CLIENT FEEDBACK</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What our clients say about us</h2>
        </ScrollAnimation>

        <div className="max-w-4xl mx-auto">
          <ScrollAnimation className="bg-white rounded-lg shadow-lg p-8 relative" key={activeIndex}>
            <div className="absolute top-6 left-6 text-kargon-red/10">
              <Quote size={64} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-kargon-red/20">
                  <img src={currentTestimonial.avatar} alt={currentTestimonial.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg">{currentTestimonial.name}</h3>
                <p className="text-gray-600 text-sm">{currentTestimonial.position}</p>
              </div>
              <div className="md:col-span-2 relative z-10">
                <p className="text-lg text-gray-700 italic mb-6">{currentTestimonial.quote}</p>
                <div className="flex justify-end gap-2">
                  <button onClick={prevTestimonial} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-kargon-red hover:text-white hover:border-kargon-red transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextTestimonial} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-kargon-red hover:text-white hover:border-kargon-red transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;

import ScrollAnimation from "./ScrollAnimation";
import { FileCheck, SmileIcon, Building2, Trophy } from "lucide-react";

const StatsSection = () => {
  return (
    <section className="relative py-16">
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/6fa84550-fe8c-4549-a9c9-c0f071c2cd75.png"
          alt="Logistics Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-kargon-dark/80"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center">Our goals <span className="text-kargon-red">in numbers</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ScrollAnimation className="bg-white/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl p-8 text-center" delay={0}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full">
                <FileCheck className="text-kargon-red h-12 w-12" />
              </div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">10M+</div>
            <div className="text-lg font-medium text-white/80">Deliveries Completed</div>
          </ScrollAnimation>
          
          <ScrollAnimation className="bg-white/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl p-8 text-center" delay={200}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full">
                <SmileIcon className="text-kargon-red h-12 w-12" />
              </div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">8700+</div>
            <div className="text-lg font-medium text-white/80">Happy Clients</div>
          </ScrollAnimation>
          
          <ScrollAnimation className="bg-white/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl p-8 text-center" delay={400}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full">
                <Building2 className="text-kargon-red h-12 w-12" />
              </div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">49+</div>
            <div className="text-lg font-medium text-white/80">Worldwide Offices</div>
          </ScrollAnimation>
          
          <ScrollAnimation className="bg-white/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl p-8 text-center" delay={600}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full">
                <Trophy className="text-kargon-red h-12 w-12" />
              </div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">300+</div>
            <div className="text-lg font-medium text-white/80">Awards Won</div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

import React, { useState, useEffect } from "react";
import { Users, UserCircle, SearchCode, Ship, Calendar, ArrowRight, Play, Zap } from "lucide-react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface HeroSectionProps {
  country?: 'sri-lanka' | 'myanmar' | 'bangladesh' | 'pakistan';
}

const HeroSection = ({ country }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const location = useLocation();

  const countryContent = {
    'sri-lanka': {
      images: [
        { url: "/14.png", title: "GLOBAL CONSOL", description: "Your Trusted Logistics Partner in Sri Lanka", gradient: "" },
        { url: "/air1.png", title: "AIR FREIGHT", description: "We deliver flexible, global airfreight solutions", gradient: "" },
        { url: "/whouse1.png", title: "WAREHOUSE MANAGEMENT", description: "A cutting edge solutions with advanced WMS", gradient: "" },
        { url: "/15.png", title: "LIQUID CARGO TRANSPORTATION", description: "Cost effective and safe transportation of liquid cargo", gradient: "" }
      ]
    },
    myanmar: {
      images: [
        { url: "/12.png", title: "GLOBAL CONSOL", description: "Your Trusted Logistics Partner in Myanmar", gradient: "" },
        { url: "/4.png", title: "LOGISTICS SERVICES", description: "Supported through own offices and network of key partners around the world.", gradient: "" },
        { url: "/warehousing1.png", title: "WAREHOUSE MANAGEMENT", description: "A cutting edge solutions with advanced WMS.", gradient: "" },
        { url: "/16.png", title: "LIQUID CARGO TRANSPORTATION", description: "Cost effective and safe transportation of liquid cargo", gradient: "" }
      ]
    },
    bangladesh: {
      images: [
        { url: "/15.png", title: "GLOBAL CONSOL", description: "Your Trusted Logistics Partner in Bangladesh", gradient: "" },
        { url: "/20.png", title: "AIR FREIGHT", description: "We deliver flexible, global airfreight solutions", gradient: "" },
        { url: "/whouse3.png", title: "WAREHOUSE MANAGEMENT", description: "A cutting edge solutions with advanced WMS.", gradient: "" },
        { url: "/17.png", title: "LIQUID CARGO TRANSPORTATION", description: "Cost effective and safe transportation of liquid cargo", gradient: "" }
      ]
    },
    pakistan: {
      images: [
        { url: "/13.png", title: "GLOBAL CONSOL", description: "Your Trusted Logistics Partner in Pakistan", gradient: "" },
        { url: "/air1.png", title: "AIR FREIGHT", description: "We deliver flexible, global airfreight solutions", gradient: "" },
        { url: "/whouse2.png", title: "WAREHOUSE MANAGEMENT", description: "A cutting edge solutions with advanced WMS .", gradient: "" },
        { url: "/18.png", title: "LIQUID CARGO TRANSPORTATION", description: "Cost effective and safe transportation of liquid cargo", gradient: "" }
      ]
    }
  };

  const defaultImages = [
    { url: "/h1.png", title: "OECL", description: "Vital Link to Enhance Your Supply Chain.", gradient: "" },
    { url: "/h2.png", title: "LOGISTICS SERVICES", description: "Supported through own offices and network of key partners around the world.", gradient: "" },
    { url: "/h3.png", title: "WAREHOUSE MANAGEMENT", description: "A cutting edge solutions with advanced WMS .", gradient: "" },
    { url: "/h4.png", title: "MULTIPLE CARRIER OPTION", description: "Assublue space with contracted rates to major trade routes .", gradient: "" }
  ];

  const [sliderImages, setSliderImages] = useState(
    country ? countryContent[country].images : defaultImages
  );

  // ✅ UPDATED HERE (Title only change)
  const portalLinks = [
    {
      icon: <Users className="w-4 h-4" />,
      title: country === "pakistan" || country === "myanmar"
        ? "Customer Portal"
        : "Consolmate",
      url: "https://consolmate.com/auth/login/1",
      external: true,
      color: "from-blue-500 to-blue-700",
      hoverColor: "from-blue-600 to-blue-800"
    },
    {
      icon: <UserCircle className="w-4 h-4" />,
      title: "Partner Portal",
      url: "https://pp.onlinetracking.co/auth/login/1",
      external: true,
      color: "from-blue-500 to-blue-700",
      hoverColor: "from-blue-600 to-blue-800"
    },
    {
      icon: <SearchCode className="w-4 h-4" />,
      title: "Tracking",
      url: "http://ec2-13-229-38-56.ap-southeast-1.compute.amazonaws.com:8081/ords/f?p=107:102:::::P0_GROUP_RID:54",
      external: true,
      color: "from-blue-500 to-blue-700",
      hoverColor: "from-blue-600 to-blue-800"
    },
    {
      icon: <Ship className="w-4 h-4" />,
      title: "Sailing Schedule",
      url: "http://ec2-13-229-38-56.ap-southeast-1.compute.amazonaws.com:8081/ords/f?p=107:104:::::P0_GROUP_RID:54",
      external: true,
      color: "from-blue-500 to-blue-700",
      hoverColor: "from-blue-600 to-blue-800"
    }
  ];

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (!error && data && data.length > 0) {
          setSliderImages(data.map(slide => ({
            url: slide.image_url,
            title: slide.title,
            description: slide.description || "",
            gradient: slide.gradient || ""
          })));
        }
      } catch (err) {
        console.error("Failed to fetch hero slides:", err);
      }
    };
    fetchHeroSlides();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const currentSlide = sliderImages[activeSlide];

  const getContactUrl = () => {
    if (country) return `/${country}/contact`;
    return "/contact";
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }} />
        ))}
      </div>

      {/* Background Slider */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {sliderImages.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-2000 ease-in-out ${
              activeSlide === i ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`} style={{ zIndex: activeSlide === i ? 1 : 0 }}
          >
            <img
              src={slide.url}
              alt={`Slide ${i}`}
              className="w-full h-full object-cover transition-transform duration-2000"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} z-[1]`} />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40 z-[2]" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-start min-h-screen px-6 lg:px-12">
        <div className="max-w-4xl space-y-8 px-0 py-0 mr-auto ml-0 md:ml-10 lg:ml-20 text-left w-full flex flex-col items-start">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-left w-full">
            {currentSlide.title.split(" ").map((word, i) => (
              <span
                key={i}
                style={{ animationDelay: `${i * 0.1}s` }}
                className="text-slate-50 font-bold text-4xl"
              >
                {word}{" "}
              </span>
            ))}
          </h1>

          <p className={`text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed text-left w-full transform transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            {currentSlide.description}
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-start w-full transform transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <a href={getContactUrl()} className="group">
              <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-8 py-4 text-lg font-semibold flex items-center gap-3 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30 border border-blue-500/30 w-full sm:w-auto justify-start">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Zap className="w-5 h-5" />
                <span>GET STARTED</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </div>
          
          {/* Slide Indicators */}
          <div className="flex space-x-2 pt-4 justify-start w-full">
            {sliderImages.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveSlide(i)} 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSlide === i ? "bg-blue-500 scale-125 shadow-lg shadow-blue-500/50" : "bg-white/30 hover:bg-white/50"}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Portal Buttons */}
      <div className="absolute bottom-6 left-0 right-0 z-30 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
          {portalLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <div className="h-14 flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm">
                {link.icon}
                <span>{link.title}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

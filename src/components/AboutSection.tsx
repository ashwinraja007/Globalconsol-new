import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";
import { Link, useLocation } from "react-router-dom";
import { getCurrentCountryFromPath } from "@/services/countryDetection";
import { supabase } from "@/integrations/supabase/client";

const AboutSection = () => {
  const location = useLocation();
  const currentCountry = getCurrentCountryFromPath(location.pathname);

  const getNavLink = (basePath: string) => {
    if (currentCountry.code === "SG") return basePath;
    return `/${currentCountry.name.toLowerCase().replace(" ", "-")}${basePath}`;
  };

  const [aboutData, setAboutData] = useState({
    title: "About Us",
    subtitle: "15 Years Excellence in Logistics Industry",
    description: "GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly experienced team of logistics professionals with over 30 years of industry expertise, GC has swiftly emerged as one of the fastest-growing logistics and freight forwarding companies in South East Asia, the Indian subcontinent, and the Middle East.",
    image_url: "/aboutus2.png"
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data, error } = await supabase
          .from('about_section')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (error) throw error;
        if (data) {
          setAboutData(data);
        }
      } catch (err) {
        console.error("Failed to fetch about data:", err);
        const local = localStorage.getItem('fallback_about_section');
        if (local) {
          setAboutData(JSON.parse(local));
        }
      }
    };
    fetchAboutData();
    
    window.addEventListener('website_updated', fetchAboutData);
    return () => window.removeEventListener('website_updated', fetchAboutData);
  }, []);

  return (
    <section className="bg-slate-100 py-[114px]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Side - Text */}
          <div className="order-2 lg:order-1">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{aboutData.title}</h2>
              <div className="w-16 h-1 bg-gc-gold mb-6"></div>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="text-gc-gold shrink-0 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-xl mb-3 text-gray-900">
                      {aboutData.subtitle}
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {aboutData.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to={getNavLink("/about-us")}>
                  <Button className="bg-gc-gold hover:bg-gc-bronze text-white rounded-md px-6 py-3">
                    Know More
                  </Button>
                </Link>
                <Link to={getNavLink("/contact")}>
                  <Button
                    variant="outline"
                    className="border-gc-gold text-gc-gold hover:bg-gc-gold hover:text-white rounded-md px-6 py-3"
                  >
                    Reach Us
                  </Button>
                </Link>
              </div>
            </ScrollAnimation>
          </div>

          {/* Right Side - Main Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <ScrollAnimation delay={200} className="relative">
              <img
                alt="GC Logistics Operations"
                className="rounded-lg shadow-lg w-full object-cover"
                style={{ height: "400px" }}
                src={aboutData.image_url || "/aboutus2.png"}
              />
            </ScrollAnimation>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

import { useState, useEffect } from "react";
import { Truck, Plane, Ship, Box, Container, Droplets } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ScrollAnimation from "./ScrollAnimation";
import { supabase } from "@/integrations/supabase/client";

// Get country from URL slug (now includes Sri Lanka)
const getCurrentCountryFromPath = (pathname: string) => {
  const segments = pathname.split("/");
  const countrySlug = (segments[1] || "").toLowerCase();
  const map: Record<string, string> = {
    "sri-lanka": "Sri Lanka",
    srilanka: "Sri Lanka",
    india: "India",
    malaysia: "Malaysia",
    thailand: "Thailand",
    indonesia: "Indonesia",
    singapore: "Singapore",
  };
  const name = map[countrySlug] || "Singapore";
  return { name, slug: countrySlug || "singapore" };
};

const ServicesSection = () => {
  const location = useLocation();
  const currentCountry = getCurrentCountryFromPath(location.pathname);
  
  const [data, setData] = useState({
    main_title: 'Our Services',
    main_description: 'Comprehensive logistics solutions to move your world efficiently and safely.',
    s1_title: 'SEA Freight', s1_desc: 'At GC, we cater to the unique requirement of our customers. With our extensive expertise in sea freight operations...', s1_image: '/oceanfreight.png',
    s2_title: 'Air Freight', s2_desc: 'As a leading air freight company, we excel in offering enhanced flexibility and global choice by collaborating with a diverse... ', s2_image: '/airfreight.png',
    s3_title: 'Warehousing', s3_desc: 'GC possesses the necessary resources and expertise to effectively manage the warehousing of diverse commodities, including cold...', s3_image: '/warehousing.png',
    s4_title: 'Project Cargo', s4_desc: 'We operate a specialized division focused on knowledge-based projects, staffed with highly skilled experts who have inherited... ', s4_image: '/projectcargo.png',
    s5_title: '3PL', s5_desc: 'With our cutting-edge 3PL warehouse management system, you can optimize your business operations and implement advanced fulfill...', s5_image: '/3pl.png',
    s6_title: 'Liquid Transportation', s6_desc: 'GC specializes in delivering comprehensive expertise and services for the transportation of liquid cargoes through ISO Tanks... ', s6_image: '/liquidtransportation.png',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sectionData, error } = await supabase.from('services_content').select('*').eq('id', 1).single();
        if (!error && sectionData) {
          setData(sectionData);
        } else {
          throw new Error("No data");
        }
      } catch (err) {
        const local = localStorage.getItem('fallback_services_section');
        if (local) setData(JSON.parse(local));
      }
    };
    fetchData();
  }, []);

  const allServices = [
    {
      id: 1,
      title: data.s1_title,
      description: data.s1_desc,
      icon: Ship,
      image: data.s1_image || "/oceanfreight.png",
      slug: "sea-freight",
      delay: 0,
    },
    {
      id: 2,
      title: data.s2_title,
      description: data.s2_desc,
      icon: Plane,
      image: data.s2_image || "/airfreight.png",
      slug: "air-freight",
      delay: 100,
    },
    {
      id: 3,
      title: data.s3_title,
      description: data.s3_desc,
      icon: Box,
      image: data.s3_image || "/warehousing.png",
      slug: "warehousing",
      delay: 200,
    },
    {
      id: 4,
      title: data.s4_title,
      description: data.s4_desc,
      icon: Container,
      image: data.s4_image || "/projectcargo.png",
      slug: "project-cargo",
      delay: 300,
    },
    {
      id: 5,
      title: data.s5_title,
      description: data.s5_desc,
      icon: Box,
      image: data.s5_image || "/3pl.png",
      slug: "third-party-logistics",
      delay: 0,
    },
    {
      id: 6,
      title: data.s6_title,
      description: data.s6_desc,
      icon: Droplets,
      image: data.s6_image || "/liquidtransportation.png",
      slug: "liquid-cargo",
      delay: 100,
    },
  ];

  const getServicesLink = () => {
    if (currentCountry.slug && currentCountry.slug !== "singapore") {
      return `/${currentCountry.slug}/services`;
    }
    return "/services";
  };

  // Show 6 services for all countries
  const displayedServices = allServices;

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <ScrollAnimation className="text-center mb-16">
          <p className="font-bold mb-4 text-kargon-blue text-5xl">{data.main_title}</p>
          <p className="mt-4 max-w-xl mx-auto text-lg text-slate-950">
            {data.main_description}
          </p>
        </ScrollAnimation>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayedServices.map((service) => (
            <ScrollAnimation key={service.id} delay={service.delay}>
              <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-full h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 right-4 blue p-2 rounded-full shadow-md bg-kargon-blue">
                    <service.icon className="text-white w-5 h-5" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-kargon-blue transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    to={`/${currentCountry.slug}/services/${service.slug}`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300"
                  >
                    Read More
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={getServicesLink()}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

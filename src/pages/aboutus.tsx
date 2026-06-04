import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Truck, Ship, Globe, Users, Award, TrendingUp, CheckCircle, Star } from "lucide-react";
import { getCurrentCountryFromPath } from "@/services/countryDetection";
import { supabase } from "@/integrations/supabase/client";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const AboutUs = () => {
  const location = useLocation();
  const currentCountry = getCurrentCountryFromPath(location.pathname);
  const isSriLanka = currentCountry.code === "LK";

  const [pageData, setPageData] = useState({
    hero_title: 'About',
    hero_highlight: 'GC',
    hero_subtitle: 'Your premier global freight forwarding and logistics solutions provider',
    heading: '15 Years Excellence in Logistics Industry',
    paragraph_1: 'GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly experienced team of logistics professionals with over 30 years of industry expertise, GC has swiftly emerged as one of the fastest-growing logistics and freight forwarding companies in South East Asia, the Indian subcontinent, and the Middle East.',
    paragraph_2: 'Our competitive advantage lies in our dedicated warehouse facilities and owned fleet of trucks strategically located at key hubs, enabling us to deliver top-notch logistics services to our valued customers.',
    hero_image_url: '/customclearance.png',
    sl_cert_image_1_url: '/srilanka.jpg',
    sl_cert_image_2_url: '/Certificatesr.jpg',
    sl_heading: 'Certifications',
    sl_paragraph: 'Proud recipient of the <strong>Sri Lanka Brand Leadership Award 2024</strong> and certified to the <strong>ISO 9001:2015</strong> standard by <strong>TÜV NORD CERT GmbH (Germany)</strong>, GC Sri Lanka has earned its place as one of the region’s most trusted logistics partners. This internationally recognized certification, accredited by <strong>DAkkS (Germany’s National Accreditation Body)</strong>, demonstrates our commitment to global quality standards and continuous improvement.',
    sl_bullets: [
      'Industry recognition for <strong>Brand leadership</strong>',
      'ISO 9001:2015 certified by <strong>TÜV NORD CERT GmbH (Germany)</strong>, accredited by <strong>DAkkS</strong>'
    ],
    features: [
      "Global freight forwarding expertise",
      "Reliable network of agents",
      "30+ years industry experience",
      "Dedicated warehouse facilities",
      "Own fleet of trucks",
      "Strategic location advantages",
    ],
    stats: [
      { number: "15+", label: "Years Experience", icon: "TrendingUp" },
      { number: "500+", label: "Global Clients", icon: "Users" },
      { number: "50+", label: "Countries Served", icon: "Globe" },
      { number: "99%", label: "Customer Satisfaction", icon: "Award" },
    ]
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const countrySlug = currentCountry.name.toLowerCase().replace(/\s+/g, ''); // Evaluates to 'singapore', 'srilanka', etc.
        const { data, error } = await supabase.from('about_us_page').select('*').eq('country', countrySlug).single();
        if (data && !error) {
          setPageData({
            ...pageData,
            ...data,
            sl_bullets: Array.isArray(data.sl_bullets) ? data.sl_bullets : pageData.sl_bullets,
            features: Array.isArray(data.features) ? data.features : pageData.features,
            stats: Array.isArray(data.stats) ? data.stats : pageData.stats
          });
        } else if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error fetching about us content:', error);
        // Fallback to local storage if Supabase fails
        const local = localStorage.getItem('fallback_about_us_page');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            setPageData(prev => ({
              ...prev,
              ...parsed,
              sl_bullets: Array.isArray(parsed.sl_bullets) ? parsed.sl_bullets : prev.sl_bullets,
              features: Array.isArray(parsed.features) ? parsed.features : prev.features,
              stats: Array.isArray(parsed.stats) ? parsed.stats : prev.stats
            }));
          } catch (e) {}
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
    
    // Listen for admin updates to refresh instantly
    const handleUpdate = () => fetchContent();
    window.addEventListener('website_updated', handleUpdate);
    return () => window.removeEventListener('website_updated', handleUpdate);
  }, []);

  const getNavLink = (basePath: string) => {
    if (currentCountry.code === "SG") return basePath;
    return `/${currentCountry.name.toLowerCase().replace(" ", "-")}${basePath}`;
  };


  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col">
      <ScrollToTop />
      <Navigation />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                {pageData.hero_title} <span className="text-kargon-red">{pageData.hero_highlight}</span>
              </h1>
              <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-700">
                {pageData.hero_subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* Text Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold mb-4 text-kargon-blue">
                    {pageData.heading}
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                    {pageData.paragraph_1}
                  </p>
                  {pageData.paragraph_2 && (
                    <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                      {pageData.paragraph_2}
                    </p>
                  )}
                </div>

                {isSriLanka && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    {pageData.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-gc-gold flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Link to={getNavLink("/contact")} className="inline-block pt-4">
                  {/* Add a CTA button here if you want */}
                </Link>
              </motion.div>

              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    alt="GC Operations"
                    loading="lazy"
                    className="w-full h-96 object-cover"
                    src={pageData.hero_image_url || "/customclearance.png"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 p-4 rounded-xl shadow-lg bg-kargon-red">
                  <Ship className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sri Lanka specific content blocks */}
        {isSriLanka && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
              >
                {/* LEFT: two certificates (side-by-side, centered) */}
                <div className="lg:col-span-6 flex justify-center lg:justify-start">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[980px]">
                    <img
                      alt="Sri Lanka Brand Leadership Award 2024 - Certificate 1"
                      src={pageData.sl_cert_image_1_url || "/srilanka.jpg"}
                      className="w-full max-h-[560px] object-contain rounded-2xl shadow-2xl ring-1 ring-black/5 bg-white"
                      loading="lazy"
                    />
                    <img
                      alt="Sri Lanka Brand Leadership Award 2024 - Certificate 2"
                      src={pageData.sl_cert_image_2_url || "/Certificatesr.jpg"}
                      className="w-full max-h-[720px] object-contain rounded-2xl shadow-2xl ring-1 ring-black/5 bg-white"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* RIGHT: title + copy + bullets + CTA (logo removed) */}
                <div className="lg:col-span-6 space-y-6">
                  <h2 className="text-3xl font-bold text-kargon-blue">{pageData.sl_heading}</h2>

                  <p className="text-lg leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: pageData.sl_paragraph }}></p>

                  <ul className="list-disc marker:text-gc-gold pl-5 space-y-2 text-gray-800">
                    {pageData.sl_bullets.map((bullet, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: bullet }}></li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <Link
                      to={getNavLink("/about-us")}
                      className="inline-flex items-center justify-center rounded-md bg-gc-gold px-6 py-3 text-white hover:bg-gc-bronze transition-colors"
                    >
                      Explore Our Certifications
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        {isSriLanka && (
          <section className="py-20 bg-slate-50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {pageData.stats.map((stat, idx) => {
                  const iconMap: Record<string, any> = { TrendingUp, Users, Globe, Award, Truck, Ship, Star };
                  const IconComponent = iconMap[stat.icon] || Star;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center p-8 bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="mx-auto w-14 h-14 bg-blue-50 text-kargon-blue rounded-2xl flex items-center justify-center mb-6">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div className="text-4xl font-extrabold text-slate-800 mb-2">{stat.number}</div>
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
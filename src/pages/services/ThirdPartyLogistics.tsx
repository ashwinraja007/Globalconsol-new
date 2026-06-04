import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Box } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ThirdPartyLogistics = () => {
  const location = useLocation();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const { data } = await supabase.from('service_pages_content').select('*').eq('slug', 'third-party-logistics').single();
      if (data) setPageData(data);
    };
    fetchData();
  }, []);

  // Build country-aware contact path; default to Singapore when no country slug is present
  const contactPath = useMemo(() => {
    const path = location.pathname.toLowerCase();

    // Add any new country slugs here
    const countries = [
      "/singapore",
      "/sri-lanka",
      "/myanmar",
      "/bangladesh",
      "/pakistan",
    ];

    const matched = countries.find((c) => path.startsWith(c + "/") || path === c);
    return matched ? `${matched}/contact` : "/singapore/contact";
  }, [location.pathname]);

  return (
    <div className="bg-white text-black min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 bg-blue-600/20 px-6 py-3 rounded-full mb-6 mt-9">
              <Box className="w-6 h-6 text-blue-500" />
              <span className="text-blue-500 font-semibold">3PL Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-blue-500">3PL</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={pageData?.image_url || "/3pl.png"} alt="3PL" className="w-full h-96 object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
            <h2 className="text-3xl font-bold text-blue-500">{pageData?.title || "3PL"}</h2>
            {pageData?.content ? (
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{pageData.content}</div>
            ) : (
              <p className="text-gray-700 text-lg leading-relaxed">
                With our cutting-edge 3PL warehouse management system, you can optimize your business operations and
                implement advanced fulfillment strategies for enhanced customer satisfaction, while simultaneously
                minimizing expenses and delivery durations.
              </p>
            )}
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white p-12 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-4">
              Get a quick consultation and our experts are here to help you out
            </h3>
            {/* Country-aware contact link; defaults to Singapore */}
            <Link to={contactPath}>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                Reach Us
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThirdPartyLogistics;

import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Ship } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Transhipment = () => {
  const location = useLocation();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const { data } = await supabase.from('service_pages_content').select('*').eq('slug', 'transhipment').single();
      if (data) setPageData(data);
    };
    fetchData();
  }, []);

  // Country-aware contact path; default to Singapore when no country slug is present
  const contactPath = useMemo(() => {
    const path = location.pathname.toLowerCase();
    const countries = ["/singapore", "/sri-lanka", "/myanmar", "/bangladesh", "/pakistan"];
    const matched = countries.find((c) => path.startsWith(c + "/") || path === c);
    return matched ? `${matched}/contact` : "/singapore/contact";
  }, [location.pathname]);

  return (
    <div className="bg-white text-black min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden bg-gradient-to-r from-gc-dark-blue to-gc-blue">
        <div className="absolute inset-0 bg-gradient-to-r from-gc-dark-blue/20 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 bg-gc-gold/20 px-6 py-3 mb-5 mt-10 rounded-lg">
              <Ship className="w-6 h-6 text-gc-gold" />
              <span className="text-white font-semibold">Transhipment Services</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Trans<span className="text-gc-gold text-slate-50">hipment</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Seamless LCL/FCL transfers and Sea–Air / Air–Sea connections
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                {/* replace with your actual asset */}
                <img
                  src={pageData?.image_url || "/transhipment.png"}
                  alt="Transhipment Solutions"
                  className="w-full h-96 object-cover"
                />
              </div>
            </motion.div>

            {/* Exact Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gc-dark-blue">{pageData?.title || "Transhipment"}</h2>

              {pageData?.content ? (
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{pageData.content}</div>
              ) : (
                <>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    GC offers seamless transhipment solutions for both LCL (Less than Container Load) and FCL (Full Container Load) cargo. We also specialize in Sea-to-Air and Air-to-Sea movements, ensuring flexible and efficient routing options to meet diverse logistics needs.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Our experienced team manages every aspect of the transhipment process with precision — from coordinating schedules and handling documentation to overseeing cargo transfers between modes of transport. With our expertise and global network, we guarantee smooth, timely, and cost-effective operations, even for the most complex routing requirements.
                  </p>
                </>
              )}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-gc-gold to-gc-light-gold text-white p-12 rounded-2xl"
          >
            <h3 className="text-3xl font-bold mb-6 text-slate-950">Need a Fast Transhipment Plan?</h3>
            <p className="text-xl mb-8 opacity-90 text-slate-950">
              Talk to our team for the best Sea–Air / Air–Sea routing
            </p>
            <Link to={contactPath}>
              <button className="bg-white text-gc-dark-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 text-lg">
                Get Quote Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Transhipment;

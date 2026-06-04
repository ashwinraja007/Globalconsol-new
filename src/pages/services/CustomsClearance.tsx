import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AirFreight = () => {
  const location = useLocation();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const { data } = await supabase.from('service_pages_content').select('*').eq('slug', 'customs-clearance').single();
      if (data) setPageData(data);
    };
    fetchData();
  }, []);

  // Build country-aware contact path; default to Singapore when no country slug is present
  const contactPath = useMemo(() => {
    const path = location.pathname.toLowerCase();
    const countries = ["/singapore", "/sri-lanka", "/myanmar", "/bangladesh", "/pakistan"];
    const matched = countries.find((c) => path.startsWith(c + "/") || path === c);
    return matched ? `${matched}/contact` : "/singapore/contact";
  }, [location.pathname]);

  return (
    <div className="bg-white text-black min-h-screen">
      <Navigation />

      {/* Hero Section */}
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
              <Plane className="w-6 h-6 text-gc-gold" />
              <span className="text-white font-semibold">Customs Services</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Custom <span className="text-gc-gold text-slate-50">House Brokerage</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Fast, reliable, and compliant customs clearance for imports and exports
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
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
                <img
                  src={pageData?.image_url || "/customclearance.png"}
                  alt="Customs House Brokerage"
                  className="w-full h-96 object-cover"
                />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gc-dark-blue">{pageData?.title || "What We Do"}</h2>

              {pageData?.content ? (
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{pageData.content}</div>
              ) : (
                <>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Our Customs House Brokerage Division delivers fast, reliable, and compliant customs clearance services
                    for both imports and exports. We specialize in efficient and timely customs clearing and forwarding to
                    meet the unique requirements of our customers and overseas partners. From document preparation to
                    coordination with authorities, our experienced team ensures that your cargo moves smoothly without
                    delays or penalties.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    We handle shipments by sea and air under all major trade terms, including CIF, Ex-Works, FCA, FOB, DAP, DDU, and DDP. Whether it’s a one-time shipment or
                    regular cargo movements, we offer tailored solutions to optimize your supply chain. With our in-depth
                    knowledge of customs regulations and a commitment to service excellence, we make cross-border trade simpler, faster, and more cost-effective.
                  </p>
                </>
              )}
            </motion.div>
          </div>

          {/* CTA Section (kept same layout) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-gc-gold to-gc-light-gold text-white p-12 rounded-2xl"
          >
            <h3 className="text-3xl font-bold mb-6 text-slate-950">Need Clearance Support?</h3>
            <p className="text-xl mb-8 opacity-90 text-slate-950">
              Talk to our brokerage team for a quick, compliant release
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

export default AirFreight;

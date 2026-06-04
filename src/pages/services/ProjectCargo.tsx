import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Container } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ProjectCargo = () => {
  const location = useLocation();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const { data } = await supabase.from('service_pages_content').select('*').eq('slug', 'project-cargo').single();
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
      "/uk",
      "/usa",
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
              <Container className="w-6 h-6 text-blue-500" />
              <span className="text-blue-500 font-semibold">Project Cargo Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Project <span className="text-blue-500">Cargo</span>
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
              <img src={pageData?.image_url || "/projectcargo.png"} alt="Project Cargo" className="w-full h-96 object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-blue-500">{pageData?.title || "Project Cargo"}</h2>
              {pageData?.content ? (
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{pageData.content}</div>
              ) : (
                <>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    We operate a specialized division focused on knowledge-based projects, staffed with highly skilled
                    experts who have inherited their expertise from major project handlers. GC is fully equipped to handle a
                    wide range of challenging project cargoes, including long lengths, oversized dimensions, heavy lifts, and
                    complex shipments that require floating cranes or tandem lifting.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Our approach involves developing customized solution packages that precisely meet the unique shipping and
                    transport requirements of our customers, whether it involves port-to-port delivery or ex-works to door
                    service. Our project and heavy-lift breakbulk handling team provides valuable guidance to our customers,
                    formulating the right strategies after conducting thorough feasibility and risk assessments for each job.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Furthermore, we offer our customers the knowledge, efficiency, and safety they require, along with timely
                    and effective communication throughout the process.
                  </p>
                </>
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

export default ProjectCargo;

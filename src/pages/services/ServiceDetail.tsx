import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const ServiceDetail = () => {
  const location = useLocation();
  // Extract the slug from the end of the URL (e.g., "sea-freight")
  const segments = location.pathname.split('/').filter(Boolean);
  const slug = segments[segments.length - 1]; 
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchService = async () => {
      setLoading(true);
      try {
        const { data: serviceData, error } = await supabase
          .from('service_pages_content')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (!error && serviceData) {
          setData(serviceData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  // Dynamically determine where the "Back" and "Contact" buttons should go based on country
  const backUrl = segments.length > 2 ? `/${segments[0]}/services` : "/services";
  const contactUrl = segments.length > 2 ? `/${segments[0]}/contact` : "/contact";

  if (loading) return <div className="min-h-screen bg-gray-50 flex flex-col"><Navigation /><div className="flex-grow pt-40 text-center text-gray-500">Loading service details...</div><Footer /></div>;

  if (!data) return <div className="min-h-screen bg-gray-50 flex flex-col"><Navigation /><div className="flex-grow pt-40 text-center text-gray-500">Service not found.</div><Footer /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to={backUrl} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {data.image_url ? (
              <div className="w-full h-[300px] md:h-[450px] relative">
                <img src={data.image_url} alt={data.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                  <h1 className="text-3xl md:text-5xl font-bold text-white p-8 md:p-12 drop-shadow-md">{data.title}</h1>
                </div>
              </div>
            ) : (
              <div className="p-8 md:p-12 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
                <h1 className="text-3xl md:text-5xl font-bold">{data.title}</h1>
              </div>
            )}
            
            <div className="p-8 md:p-12">
              <p className="text-xl text-gray-700 mb-10 font-medium border-l-4 border-blue-600 pl-5 leading-relaxed bg-blue-50/50 py-3 rounded-r-lg">
                {data.description}
              </p>
              
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                {data.content || "Detailed information about this service is coming soon."}
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100">
                <Link to={contactUrl}>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md">
                    Request a Quote
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;
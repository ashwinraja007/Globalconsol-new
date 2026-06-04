import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentCountryFromPath } from '@/services/countryDetection';
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#cfae4c"; // Sampled from your logo
const BLUE = "#2172c9"; // Sampled from your logo

const GlobalPresence = () => {
  const location = useLocation();
  const currentCountry = getCurrentCountryFromPath(location.pathname);
  
  const [data, setData] = useState({
    main_title: "Global Presence",
    main_description: "Our logistics network spans across continents, enabling seamless global shipping solutions."
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sectionData, error } = await supabase.from('global_presence_section').select('*').eq('id', 1).single();
        if (!error && sectionData) setData(sectionData);
      } catch (err) {
        const local = localStorage.getItem('fallback_global_presence_section');
        if (local) setData(JSON.parse(local));
      }
    };
    fetchData();
  }, []);

  const locations = [{
    id: 1,
    name: "Melbourne",
    position: {
      top: "75%",
      left: "85%"
    },
    country: "Australia"
  }, {
    id: 2,
    name: "Singapore",
    position: {
      top: "58%",
      left: "75%"
    },
    country: "Singapore"
  }, {
    id: 3,
    name: "Dubai",
    position: {
      top: "45%",
      left: "62%"
    },
    country: "UAE"
  }, {
    id: 4,
    name: "London",
    position: {
      top: "30%",
      left: "48%"
    },
    country: "UK"
  }, {
    id: 5,
    name: "New York",
    position: {
      top: "35%",
      left: "25%"
    },
    country: "USA"
  }, {
    id: 6,
    name: "Los Angeles",
    position: {
      top: "40%",
      left: "15%"
    },
    country: "USA"
  }, {
    id: 7,
    name: "Shanghai",
    position: {
      top: "40%",
      left: "80%"
    },
    country: "China"
  }, {
    id: 8,
    name: "Mumbai",
    position: {
      top: "50%",
      left: "68%"
    },
    country: "India"
  }, {
    id: 9,
    name: "Cape Town",
    position: {
      top: "75%",
      left: "52%"
    },
    country: "South Africa"
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  const getGlobalPresenceLink = () => {
    if (currentCountry.code === "SG") return "/global-presence";
    return `/${currentCountry.name.toLowerCase().replace(" ", "-")}/global-presence`;
  };
  return <motion.section initial="hidden" whileInView="visible" viewport={{
    once: true,
    amount: 0.2
  }} variants={containerVariants} className="py-8 px-0" style={{
    background: GOLD
  }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <motion.div initial={{
          opacity: 0,
          y: -20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} viewport={{
          once: true
        }} className="flex justify-center items-center gap-3 mb-2">
            <motion.div animate={{
            rotate: 360
          }} transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}>
              
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-950 mt-10">
              {data.main_title}
            </h2>
          </motion.div>
          <div className="w-24 h-1 mx-auto mb-4" style={{
          background: BLUE
        }}></div>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-950">
            {data.main_description}
          </p>
        </div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.8
      }} viewport={{
        once: true
      }} className="mt-10 text-center">
          <Link to={getGlobalPresenceLink()}>
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.98
          }} animate={{
            opacity: [1, 0.5, 1]
          }} transition={{
            repeat: Infinity,
            duration: 1.5
          }} className="inline-flex items-center gap-2 font-bold rounded-lg shadow-lg transition-all duration-300 px-6 py-3" style={{
            background: BLUE,
            color: "#fff",
            border: `2px solid ${GOLD}`,
            fontSize: "1.25rem"
          }}>
              Explore Our Global Network <ExternalLink size={20} style={{
              color: GOLD
            }} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>;
};
export default GlobalPresence;
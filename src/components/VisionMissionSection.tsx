import { useState, useEffect } from "react";
import ScrollAnimation from "./ScrollAnimation";
import { Target, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const VisionMissionSection = () => {
  const [data, setData] = useState({
    main_title: "Our Vision & Mission",
    vision_title: "Our Vision",
    vision_description: "Our aim is to maintain our position as a leading global logistics solutions provider by utilizing advanced systems and the expertise of our skilled logistics professionals.",
    mission_title: "Our Mission",
    mission_description: "To be customers' first choice for logistics solutions like FCL, LCL, Air Freight, Project Cargo, Warehousing, 3PL, Liquid Transportation, and Liner Agency"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sectionData, error } = await supabase
          .from('vision_mission_section')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (!error && sectionData) {
          setData(sectionData);
        } else {
          throw new Error("No data");
        }
      } catch (err) {
        const local = localStorage.getItem('fallback_vision_section');
        if (local) {
          setData(JSON.parse(local));
        }
      }
    };
    fetchData();
  }, []);

  return <section className="py-20 bg-gradient-to-br from-gc-light-gold/10 to-gc-blue/10">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {data.main_title}
          </h2>
          <div className="w-20 h-1 bg-gc-gold mx-auto"></div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vision */}
          <ScrollAnimation delay={100}>
            <div className="p-8 rounded-2xl shadow-lg border-l-4 border-kargon-blue hover:shadow-xl transition-shadow duration-300 bg-kargon-blue">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gc-gold/10 rounded-full mr-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-50">{data.vision_title}</h3>
              </div>
              <p className="leading-relaxed text-lg text-slate-100">
                {data.vision_description}
              </p>
            </div>
          </ScrollAnimation>

          {/* Mission */}
          <ScrollAnimation delay={200}>
            <div className="p-8 rounded-2xl shadow-lg border-l-4 border-kargon-red hover:shadow-xl transition-shadow duration-300 bg-kargon-red">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gc-blue/10 rounded-full mr-4">
                  <Target className="w-8 h-8 text-white bg-transparent" />
                </div>
                <h3 className="text-2xl font-bold text-slate-50">{data.mission_title}</h3>
              </div>
              <p className="leading-relaxed text-lg text-slate-50">
                {data.mission_description}
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>;
};
export default VisionMissionSection;
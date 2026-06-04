import { useState, useEffect } from "react";
import ScrollAnimation from "./ScrollAnimation";
import { Settings, Globe, Heart, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const WhatMakesUsUniqueSection = () => {
  const [data, setData] = useState({
    main_title: "What Makes Us Unique?",
    f1_title: "Bespoke Logistics Solutions",
    f1_desc: "Efficient, cost-effective and innovative bespoke global logistics solutions with a wide range of services comprising of end-to-end logistics packages.",
    f2_title: "Overseas Network",
    f2_desc: "Through our extensive network of international representatives, we are able to offer you a comprehensive range of high-quality logistical freight services.",
    f3_title: "Service Driven",
    f3_desc: "We provide the highest quality of service and is widely recognized as the most customer-driven logistics company.",
    f4_title: "Built To Deliver",
    f4_desc: "We provide the most reliable & cost effective logistics solutions thereby creating a long-term partnership with our clients."
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sectionData, error } = await supabase.from('unique_section').select('*').eq('id', 1).single();
        if (!error && sectionData) {
          setData(sectionData);
        } else {
          throw new Error("No data");
        }
      } catch (err) {
        const local = localStorage.getItem('fallback_unique_section');
        if (local) setData(JSON.parse(local));
      }
    };
    fetchData();
  }, []);

  const features = [{
    icon: Settings,
    title: data.f1_title,
    description: data.f1_desc,
    delay: 0,
    color: "gc-gold"
  }, {
    icon: Globe,
    title: data.f2_title,
    description: data.f2_desc,
    delay: 100,
    color: "gc-blue"
  }, {
    icon: Heart,
    title: data.f3_title,
    description: data.f3_desc,
    delay: 200,
    color: "gc-gold"
  }, {
    icon: Truck,
    title: data.f4_title,
    description: data.f4_desc,
    delay: 300,
    color: "gc-blue"
  }];
  return <section className="py-20 bg-blue-800 ">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {data.main_title}
          </h2>
          <div className="w-20 h-1 bg-gc-gold mx-auto"></div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <ScrollAnimation key={index} delay={feature.delay}>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center h-full">
                <div className={`p-4 bg-${feature.color}/10 rounded-full mb-6 mx-auto w-fit`}>
                  <feature.icon className={`w-10 h-10 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </ScrollAnimation>)}
        </div>
      </div>
    </section>;
};
export default WhatMakesUsUniqueSection;
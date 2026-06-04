import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LocationsSection from "@/components/LocationsSection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Send, XCircle, MapPin, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const defaultOffices = {
  Singapore: [
    {
      name: "Headquarters",
      address: "Blk 511 Kampong Bahru Road, #03-01 Keppel Distripark, Singapore 099447",
      phones: ["+ 65 69084188"],
      emails: ["info.sg@globalconsol.com"],
      map_url: "https://www.google.com/maps/d/u/0/embed?mid=1U_72YwJ_4E6SQSrx2E6eWegoUTQesgo&ehbc=2E312F&noprof=1",
    },
  ],
  "Sri Lanka": [
    {
      name: "Colombo",
      address: "Ceylinco House, 9th Floor, No. 69, Janadhipathi Mawatha, Colombo 01, Sri Lanka",
      phones: ["+94 114477494", "+94 114477498", "+94 114477499", "+94 764434885"],
      emails: ["info.cmb@globalconsol.com"],
      map_url: "https://www.google.com/maps/d/u/0/embed?mid=1Nt9tx3aLmBNO-Sf6oJxm3WxfmbDIF0I&ehbc=2E312F&noprof=1",
    },
  ],
  Pakistan: [
    {
      name: "Karachi",
      address: "Suite No.301, 3rd Floor, Fortune Center, Shahrah-e-Faisal, Block 6, PECHS, Karachi, Pakistan.",
      phones: ["+92-300-8282511", "+92-21-34302281-5"],
      emails: ["info.pk@globalconsol.com"],
      map_url: "https://www.google.com/maps/d/u/0/embed?mid=1reXoq38Nt5GKCCpv-f_cb1UwG-Ko30o&ehbc=2E312F&noprof=1"
    },
    {
      name: "Lahore",
      address: "Office # 301, 3rd Floor, Gulberg Arcade Main Market, Gulberg 2, Lahore, Pakistan.",
      phones: ["+92 42-35782306", "+92 42-35782307", "+92 42-35782308"],
      emails: ["info.pk@globalconsol.com"],
      map_url: "https://www.google.com/maps/d/u/0/embed?mid=1ObHyVRDeNaWR7qOyMHKqqvqWbqjsCVk&ehbc=2E312F&noprof=1"
    },
  ],
  Myanmar: [
    {
      name: "Yangon",
      address: "#1210, 12TH (A) FLOOR, SAKURA TOWER 339, BOGYOKE SAN ROAD, KYAUKTADA TOWNSHIP - 11181 YANGON, UNION OF MYANMAR",
      phones: ["951 243158", "951 243101"],
      emails: ["info@globalconsol.com"],
      map_url: "https://www.google.com/maps/d/u/0/embed?mid=1S0BF3WzohAIQGBr9w6ryuexAnYj8AVc&ehbc=2E312F&noprof=1",
    },
  ],
  Bangladesh: [
    {
      name: "Dhaka",
      address: "ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh",
      phones: ["+880 1716 620989"],
      emails: ["info@globalconsol.com"],
      map_url: "https://www.google.com/maps/d/u/0/embed?mid=1X0GsrCFJRFoj6Q67PJztKAAzkDlKkXY&ehbc=2E312F&noprof=1",
    },
  ],
};

const Contact: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [locationNames, setLocationNames] = useState<string[]>(Object.keys(defaultOffices).map(k => k.toUpperCase()));
  const [officesData, setOfficesData] = useState<Record<string, any[]>>(defaultOffices);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const location = useLocation();
  const [pageData, setPageData] = useState({
    main_title: "Get in Touch",
    main_description: "We're here to help and answer any questions you might have.",
    form_title: "Send us a Message",
    form_description: "Fill out the form below and we'll get back to you within 24 hours.",
  });

  // Function to detect country slug from pathname
  const getCountryFromPath = (available: string[]) => {
    const path = location.pathname.toLowerCase();
    for (const country of available) {
      const slug1 = country.toLowerCase().replace(/\s+/g, '-');
      const slug2 = country.toLowerCase().replace(/\s+/g, '');
      if (path.includes(`/${slug1}`) || path.includes(`/${slug2}`)) {
        return country.toUpperCase();
      }
    }
    return "SINGAPORE";
  };

  // Map of country to email addresses
  const [emailMap, setEmailMap] = useState<Record<string, string[]>>({
    "SINGAPORE": ["https://formsubmit.co/ajax/info.sg@globalconsol.com"],
    "SRI LANKA": ["https://formsubmit.co/ajax/info.cmb@globalconsol.com"],
    "MYANMAR": ["https://formsubmit.co/ajax/info@globalconsol.com"],
    "BANGLADESH": ["https://formsubmit.co/ajax/info@globalconsol.com"],
    "PAKISTAN": ["https://formsubmit.co/ajax/info.pk@globalconsol.com"],
  });

  useEffect(() => {
    const countries = Object.keys(officesData).length > 0 
      ? Object.keys(officesData).map(c => c.toUpperCase())
      : Object.keys(defaultOffices).map(c => c.toUpperCase());
      
    setLocationNames(countries);

    const currentCountry = getCountryFromPath(countries);
    const matchedCountry = countries.find(c => c.trim().toUpperCase() === currentCountry);
    
    if (matchedCountry) {
      setSelectedLocation(matchedCountry);
    } else if (countries.length > 0) {
      setSelectedLocation(countries[0]);
    }
  }, [location.pathname, officesData]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchContactData = async () => {
      try {
        const { data, error } = await supabase.from('contact_section').select('*').eq('id', 1).single();
        if (data) {
          setPageData({
            main_title: data.main_title || "Get in Touch",
            main_description: data.main_description || "We're here to help and answer any questions you might have.",
            form_title: data.form_title || "Send us a Message",
            form_description: data.form_description || "Fill out the form below and we'll get back to you within 24 hours.",
          });
          
          let parsedOffices = data.offices_data;
          if (typeof parsedOffices === 'string') {
            try { parsedOffices = JSON.parse(parsedOffices); } catch(e) {}
          }
          
          if (parsedOffices && typeof parsedOffices === 'object' && Object.keys(parsedOffices).length > 0) {
            
            // Fallback for missing map_urls in DB
            Object.keys(parsedOffices).forEach(country => {
              const defaultCountryKey = Object.keys(defaultOffices).find(k => k.toLowerCase() === country.toLowerCase());
              if (defaultCountryKey) {
                parsedOffices[country] = parsedOffices[country].map((office: any, idx: number) => ({
                  ...office,
                  map_url: office.map_url || (defaultOffices[defaultCountryKey as keyof typeof defaultOffices][idx]?.map_url || '')
                }));
              }
            });

            setOfficesData(parsedOffices);

            const newEmailMap: Record<string, string[]> = { ...emailMap };
            Object.keys(parsedOffices).forEach(country => {
              const emails = parsedOffices[country].flatMap((o: any) => o.emails || []);
              if (emails.length > 0) {
                newEmailMap[country.trim().toUpperCase()] = emails.map((e: string) => `https://formsubmit.co/ajax/${e}`);
              }
            });
            setEmailMap(newEmailMap);
          }
        }
      } catch (err) {
        console.error("Contact page fetch error:", err);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchContactData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const urls = emailMap[selectedLocation] || emailMap["SINGAPORE"];

    try {
      const responses = await Promise.all(
        urls.map(url =>
          fetch(url, {
            method: "POST",
            body: formData
          })
        )
      );
      const allSuccessful = responses.every(res => res.ok);
      if (allSuccessful) {
        setShowNotification(true);
        form.reset();
        setSelectedLocation("");
        setTimeout(() => setShowNotification(false), 4000);
      } else {
        alert("One or more submissions failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[40vh] flex items-center justify-center bg-blue-700 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black to-blue-900/90" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center px-4 relative z-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 mt-9">{pageData.main_title}</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto font-light">
              {pageData.main_description}
            </p>
          </motion.div>
        </motion.section>

        {/* Locations */}
        <section className="py-16 bg-gradient-to-b from-blue-50/30 to-white">
          <div className="container mx-auto px-4">
            <LocationsSection />
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-white" id="contact-form">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
              >
                <h2 className="text-3xl font-bold mb-2 text-black text-center">{pageData.form_title}</h2>
                <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
                <p className="text-gray-600 mb-8 text-center">
                  {pageData.form_description}
                </p>

                {showNotification && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Send size={18} />
                      <span>Message sent successfully!</span>
                    </div>
                    <button onClick={() => setShowNotification(false)} className="text-green-800">
                      <XCircle size={18} />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="box" />
                  <input type="hidden" name="_subject" value="New Contact Form Submission" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">First Name *</label>
                      <Input name="First Name" required placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Last Name *</label>
                      <Input name="Last Name" required placeholder="Enter your last name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address *</label>
                      <Input name="Email" required type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <Input name="Phone" placeholder="Enter your phone number" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company/Organization</label>
                    <Input name="Organization" placeholder="Enter your company name" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Preferred Location *
                      {isLoadingLocations && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                    </label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation} required disabled={isLoadingLocations}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingLocations ? "Loading..." : "Select preferred office location"} />
                      </SelectTrigger>
                      <SelectContent>
                        {locationNames.map(loc => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="Preferred Location" value={selectedLocation} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Message *</label>
                    <Textarea
                      name="Message"
                      required
                      placeholder="Tell us about your logistics needs..."
                      rows={5}
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

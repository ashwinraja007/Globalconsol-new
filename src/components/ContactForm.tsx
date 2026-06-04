import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Building2, CheckCircle2, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Brand Colors
const BRAND = {
  gold: "#c0a064",
  blue: "#2172c9",
  black: "#111",
};

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
      address: "ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord, No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh",
      phones: ["+880 1716 620989"],
      emails: ["info@globalconsol.com"],
      map_url: "https://www.google.com/maps/d/u/0/embed?mid=1X0GsrCFJRFoj6Q67PJztKAAzkDlKkXY&ehbc=2E312F&noprof=1",
    },
  ],
};

// Fallback recipients if slug not matched (or for redundancy)
const fallbackRecipients: string[] = [
  "info@globalconsol.com",
];

// Utility: turn emails into FormSubmit AJAX endpoints
const toFormSubmitUrls = (emails: string[]) =>
  emails.map((e) => `https://formsubmit.co/ajax/${e}`);

const ContactForm: React.FC = () => {
  const location = useLocation();
  const [allOffices, setAllOffices] = useState<Record<string, any[]>>(defaultOffices);
  const [locationOptions, setLocationOptions] = useState<string[]>(Object.keys(defaultOffices));
  const [selectedLocation, setSelectedLocation] = useState<string>(Object.keys(defaultOffices)[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [data, setData] = useState({
    main_title: "Get In Touch",
    main_description: "Ready to streamline your logistics? Contact us today for a customized solution.",
    form_title: "Send us a Message",
    form_description: "Fill out the form below and we'll get back to you within 24 hours.",
    offices_title: "Our Offices"
  });

  // Detect country from slug
  const getCurrentCountryFromPath = (available: string[]): string => {
    const path = location.pathname.toLowerCase();
    for (const country of available) {
      const slug1 = country.toLowerCase().replace(/\s+/g, '-');
      const slug2 = country.toLowerCase().replace(/\s+/g, '');
      if (path.includes(`/${slug1}`) || path.includes(`/${slug2}`)) {
        return country;
      }
    }
    return "Singapore";
  };

  // Auto-select dropdown based on slug on mount/route change
  useEffect(() => {
    const availableCountries = Object.keys(allOffices);
    const currentCountry = getCurrentCountryFromPath(availableCountries);
    
    if (availableCountries.length > 0) {
      setLocationOptions(availableCountries);
      const matchingCountry = availableCountries.find(c => c.trim().toLowerCase() === currentCountry.toLowerCase());
      if (matchingCountry) {
        setSelectedLocation(matchingCountry);
      } else {
        setSelectedLocation(availableCountries[0]);
      }
    }
  }, [location.pathname, allOffices]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sectionData, error } = await supabase.from('contact_section').select('*').eq('id', 1).single();
        
        if (error) throw error;
        if (sectionData) {
          setData({
            main_title: sectionData.main_title || "Get In Touch",
            main_description: sectionData.main_description || "",
            form_title: sectionData.form_title || "Send us a Message",
            form_description: sectionData.form_description || "Fill out the form below and we'll get back to you within 24 hours.",
            offices_title: sectionData.offices_title || "Our Offices"
          });
          
          let parsedOffices = sectionData.offices_data;
          if (typeof parsedOffices === 'string') {
            try { parsedOffices = JSON.parse(parsedOffices); } catch(e) {}
          }
          
          if (parsedOffices && typeof parsedOffices === 'object' && Object.keys(parsedOffices).length > 0) {
            Object.keys(parsedOffices).forEach(country => {
              const defaultCountryKey = Object.keys(defaultOffices).find(k => k.toLowerCase() === country.toLowerCase());
              if (defaultCountryKey) {
                parsedOffices[country] = parsedOffices[country].map((office: any, idx: number) => ({
                  ...office,
                  map_url: office.map_url || (defaultOffices[defaultCountryKey as keyof typeof defaultOffices][idx]?.map_url || '')
                }));
              }
            });
            setAllOffices(parsedOffices);
            
          }
        }
      } catch (err: any) {
        console.error("ContactForm fetch error:", err.message);
        const local = localStorage.getItem('fallback_contact_section');
        if (local) {
          const parsed = JSON.parse(local);
          setData({
            main_title: parsed.main_title || "Get In Touch",
            main_description: parsed.main_description || "",
            form_title: parsed.form_title || "Send us a Message",
            form_description: parsed.form_description || "Fill out the form below and we'll get back to you within 24 hours.",
            offices_title: parsed.offices_title || "Our Offices"
          });
          if (parsed.offices_data) {
             Object.keys(parsed.offices_data).forEach(country => {
               const defaultCountryKey = Object.keys(defaultOffices).find(k => k.toLowerCase() === country.toLowerCase());
               if (defaultCountryKey) {
                 parsed.offices_data[country] = parsed.offices_data[country].map((office: any, idx: number) => ({
                   ...office,
                   map_url: office.map_url || (defaultOffices[defaultCountryKey as keyof typeof defaultOffices][idx]?.map_url || '')
                 }));
               }
             });
             setAllOffices(parsed.offices_data);
             
          }
        }
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchData();
  }, []);

  const currentOffices = allOffices[selectedLocation] || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Use emails defined in the current offices as recipients
    let recipients = currentOffices.flatMap((office: any) => office.emails || []);
    if (recipients.length === 0) recipients = fallbackRecipients;

    const urls = toFormSubmitUrls(recipients.length ? recipients : fallbackRecipients);

    try {
      const responses = await Promise.all(
        urls.map((url) =>
          fetch(url, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData,
          })
        )
      );

      const ok = responses.every((r) => r.ok);
      if (!ok) throw new Error("One or more submissions failed.");

      form.reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err: any) {
      alert("Something went wrong: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <section id="contact" className="py-16 bg-slate-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: BRAND.blue }}
          >
            {data.main_title}
          </h2>
          <div className="w-24 h-1 mx-auto mb-4" style={{ background: BRAND.gold }} />
          <p className="max-w-2xl mx-auto text-lg" style={{ color: BRAND.black }}>
            {data.main_description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Office List */}
          <div className="space-y-6">
            <h3
              className="text-2xl font-bold mb-4 flex items-center gap-2"
              style={{ color: BRAND.blue }}
            >
            <Building2 className="w-6 h-6" style={{ color: BRAND.gold }} /> {data.offices_title}
            </h3>

            {(currentOffices.length > 0 ? currentOffices : []).map((office, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 + idx * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl shadow-lg"
                style={{ border: `2px solid ${BRAND.gold}`, background: "#fff" }}
              >
                
                {office.name && (
                  <h4 className="text-xl font-bold mb-4" style={{ color: BRAND.black }}>
                    {office.name}
                  </h4>
                )}

                <div className="space-y-3">

                  {office.address && (
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="w-5 h-5 shrink-0" style={{ color: BRAND.gold, marginTop: '2px' }} />
                      <p className="text-sm leading-relaxed" style={{ color: BRAND.black }}>
                        {office.address}
                      </p>
                    </div>
                  )}

                  {office.phones &&
                    office.phones.map((phone, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Phone className="w-5 h-5" style={{ color: BRAND.gold }} />
                        <a
                          href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                          className="text-sm hover:underline"
                          style={{ color: BRAND.black }}
                        >
                          {phone}
                        </a>
                      </div>
                    ))}

                  {office.emails &&
                    office.emails.map((email, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Mail className="w-5 h-5" style={{ color: BRAND.gold }} />
                        <a
                          href={`mailto:${email}`}
                          className="text-sm hover:underline"
                          style={{ color: BRAND.black }}
                        >
                          {email}
                        </a>
                      </div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl shadow-xl border"
            style={{ borderColor: BRAND.gold, background: "#fff" }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND.blue }}>
              {data.form_title}
            </h3>
            <p className="mb-6" style={{ color: BRAND.black }}>
              {data.form_description}
            </p>

            <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
              {/* FormSubmit controls */}
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="box" />
              <input
                type="hidden"
                name="_subject"
                value={`New Contact Submission from ${selectedLocation}`}
              />
              <input type="hidden" name="Preferred_Location" value={selectedLocation} />
              {/* You can also add _cc via hidden input if needed */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: BRAND.black }}>
                    First Name *
                  </label>
                  <Input placeholder="Enter your first name" name="First Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: BRAND.black }}>
                    Last Name *
                  </label>
                  <Input placeholder="Enter your last name" name="Last Name" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: BRAND.black }}>
                    Email Address *
                  </label>
                  <Input type="email" name="Email" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: BRAND.black }}>
                    Phone Number
                  </label>
                  <Input name="Phone" placeholder="Enter your phone number" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: BRAND.black }}>
                  Company/Organization
                </label>
                <Input name="Organization" placeholder="Enter your company name" />
              </div>

              <div
                className="space-y-2 max-w-md mx-auto p-4 rounded-lg shadow"
                style={{ background: "#fff" }}
              >
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: BRAND.black }}>
                  Preferred Office Location
                  {isLoadingLocations && <Loader2 className="w-4 h-4 animate-spin" style={{ color: BRAND.blue }} />}
                </label>
                <Select value={selectedLocation} onValueChange={(v) => setSelectedLocation(v)} disabled={isLoadingLocations}>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingLocations ? "Loading..." : "Select office location"} />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: BRAND.black }}>
                  Message *
                </label>
                <Textarea
                  name="Message"
                  placeholder="Tell us about your logistics needs..."
                  required
                  rows={5}
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  style={{
                    width: "100%",
                    background: BRAND.blue,
                    color: "#fff",
                    padding: "1.5rem 0",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    borderRadius: "1rem",
                    border: `2px solid ${BRAND.gold}`,
                  }}
                >
                  <Send className="w-5 h-5 mr-2" style={{ color: BRAND.gold }} />
                  Send Message
                </Button>
              </motion.div>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 rounded-xl shadow flex items-center gap-3"
                  style={{ background: "#fff", border: `1px solid ${BRAND.gold}`, color: BRAND.black }}
                >
                  <CheckCircle2 className="w-5 h-5" style={{ color: BRAND.blue }} />
                  <p className="text-sm md:text-base font-medium">
                    Your message has been sent successfully. We'll get back to you soon!
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const defaultMapUrls = {
  singapore: ["https://www.google.com/maps/d/u/0/embed?mid=1U_72YwJ_4E6SQSrx2E6eWegoUTQesgo&ehbc=2E312F&noprof=1"],
  "sri lanka": ["https://www.google.com/maps/d/u/0/embed?mid=1Nt9tx3aLmBNO-Sf6oJxm3WxfmbDIF0I&ehbc=2E312F&noprof=1"],
  pakistan: [
    "https://www.google.com/maps/d/u/0/embed?mid=1reXoq38Nt5GKCCpv-f_cb1UwG-Ko30o&ehbc=2E312F&noprof=1",
    "https://www.google.com/maps/d/u/0/embed?mid=1ObHyVRDeNaWR7qOyMHKqqvqWbqjsCVk&ehbc=2E312F&noprof=1"
  ],
  myanmar: ["https://www.google.com/maps/d/u/0/embed?mid=1S0BF3WzohAIQGBr9w6ryuexAnYj8AVc&ehbc=2E312F&noprof=1"],
  bangladesh: ["https://www.google.com/maps/d/u/0/embed?mid=1X0GsrCFJRFoj6Q67PJztKAAzkDlKkXY&ehbc=2E312F&noprof=1"]
};

const LocationsSection: React.FC = () => {
  const { pathname } = useLocation();
  const [allLocations, setAllLocations] = useState<Record<string, any[]>>({});
  const [sectionTitle, setSectionTitle] = useState("Our Office Locations");
  const [loading, setLoading] = useState(true);
  
  // Extract country from pathname
  const getCountryFromPath = (path: string, available: string[]) => {
    const normalizedPath = path.toLowerCase();
    for (const country of available) {
      const slug1 = country.toLowerCase().replace(/\s+/g, '-');
      const slug2 = country.toLowerCase().replace(/\s+/g, '');
      if (normalizedPath.includes(`/${slug1}`) || normalizedPath.includes(`/${slug2}`)) {
        return country;
      }
    }
    return "Singapore"; // Default
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase.from('contact_section').select('offices_data, offices_title').eq('id', 1).single();
        if (data && data.offices_title) {
          setSectionTitle(data.offices_title);
        }
        
        if (data && data.offices_data) {
          let parsed = data.offices_data;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch(e) {}
          }
          if (parsed && typeof parsed === 'object') {
            Object.keys(parsed).forEach(country => {
              const cKey = country.toLowerCase();
              if (defaultMapUrls[cKey as keyof typeof defaultMapUrls]) {
                parsed[country] = parsed[country].map((office: any, idx: number) => ({
                  ...office,
                  map_url: office.map_url || defaultMapUrls[cKey as keyof typeof defaultMapUrls][idx] || ''
                }));
              }
            });
            setAllLocations(parsed);
          }
        }
      } catch (err) {
        console.error("Error fetching map locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const availableCountries = Object.keys(allLocations);
  const targetCountry = getCountryFromPath(pathname, availableCountries);
  
  // Safely match the targeted country
  const matchedCountry = availableCountries.find(c => c.trim().toLowerCase() === targetCountry.toLowerCase()) 
    || availableCountries.find(c => c.trim().toLowerCase().replace(/\s+/g, '') === targetCountry.toLowerCase().replace(/\s+/g, ''));
    

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>(0);

  useEffect(() => {
    if (availableCountries.length > 0) {
      setSelectedCountry(matchedCountry || availableCountries[0]);
      setSelectedLocationIndex(0);
    }
  }, [pathname, allLocations]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (availableCountries.length === 0 || !selectedCountry) return null;

  const currentOffices = allLocations[selectedCountry] || [];
  const selectedOffice = currentOffices[selectedLocationIndex] || currentOffices[0];

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-6 text-center">{sectionTitle}</h2>
        
        <div className="text-center text-xl font-semibold py-2 px-4 bg-red-600 text-white rounded inline-block">
          {selectedCountry}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {currentOffices.length > 0 && (
          <div className="w-full md:w-[30%] space-y-3">
            {currentOffices.map((office, idx) => (
              <button
                key={idx}
                className={`w-full text-left p-3 rounded border transition-all ${
                  selectedLocationIndex === idx
                    ? "bg-blue-800 text-white border-blue-800"
                    : "bg-white border-gray-300 hover:bg-blue-100"
                }`}
                onClick={() => setSelectedLocationIndex(idx)}
              >
                {office.name || `Office ${idx + 1}`}
              </button>
            ))}
          </div>
        )}

        {selectedOffice && (
          <div className="w-full md:w-[70%] space-y-4">
            <div className="bg-slate-100 p-4 rounded border shadow">
              <h3 className="text-xl font-bold mb-2">Address</h3>
              <p className="whitespace-pre-line mb-2">
                {selectedOffice.address}
              </p>
              {selectedOffice.phones && selectedOffice.phones.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mt-4 mb-2">Phone</h3>
                  <p>{selectedOffice.phones.join(', ')}</p>
                </>
              )}
              {selectedOffice.emails && selectedOffice.emails.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mt-4 mb-2">Email</h3>
                  <p>{selectedOffice.emails.join(', ')}</p>
                </>
              )}
            </div>

            {selectedOffice.map_url && (
              <div className="relative rounded-lg overflow-hidden h-[400px] shadow-lg">
                <div className="absolute top-0 left-0 w-full text-white text-center py-2 bg-red-600 font-semibold z-10">
                 {selectedOffice.name}
                </div>
                <iframe
                  src={selectedOffice.map_url}
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0 w-full h-full pt-10"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title={`${selectedOffice.name} Map`}
                ></iframe>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationsSection;
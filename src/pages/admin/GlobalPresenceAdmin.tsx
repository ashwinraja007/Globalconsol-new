import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, X, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface City {
  name: string;
  lat: number;
  lng: number;
  address: string;
  contacts: string[];
  email?: string;
  map_url?: string;
}

interface CountryLocation {
  code: string;
  name: string;
  lat: number;
  lng: number;
  cities: City[];
}

const defaultLocations = [
  {
    code: "in", name: "India", lat: 9.9323, lng: 76.2996,
    cities: [
      { name: "Kerala", lat: 9.9323, lng: 76.2996, address: "CC 59/801A Elizabeth Memorial Building, Thevara Ferry Jn, Cochin 682013 , Kerala.", contacts: ["+91 484 4019192 / 93"], email: "info@oecl.sg" },
      { name: "Mumbai", lat: 19.01123, lng: 73.03715, address: "803 / 804, Shelton Cubix, Plot No. 87, Sector-15,CBD Belapur, Navi Mumbai, Maharastra - 400614.", contacts: ["022-35131688 / 35113475 / 35082586"], email: "info@oecl.sg" },
      { name: "Mumbai-Andheri", lat: 19.11303, lng: 72.86848, address: "503, Midas, Sahar Plaza Complex,Sir M.V Road,Andheri East, Mumbai 400059", contacts: ["+91 8879756838"], email: "info@oecl.sg" },
      { name: "Delhi", lat: 28.62748, lng: 77.2221, address: "903, Surya Kiran Building K.G Marg,Connaught Place New Delhi - 110001", contacts: ["+91 11 493224477 / 48 /49"], email: "info@oecl.sg" },
      { name: "Punjab", lat: 30.89135, lng: 75.93255, address: "No. 7A, G K Estate,Hari Nagar, Mundian Kalan,Chandigarh Road,Ludhiana, Punjab – 141015", contacts: ["+91 62845 49881"], email: "navjot.kohli@ggl.sg" },
      { name: "Bangalore", lat: 13.01855, lng: 77.64191, address: "3C-964 IIIrd Cross Street,HRBR LAYOUT 1st Block,Kalayan Nagar Bannaswadi,Bengaluru - 560043.", contacts: ["+91 9841676259"], email: "info@oecl.sg" },
      { name: "Kolkata", lat: 22.5769, lng: 88.4341, address: "Merlin Matrix, 3rd floor, Room No. 303 10,D. N. BLOCK, SECTOR - V SALT LAKE CITY, Kolkata – 700091", contacts: ["+91 33 46025458 / 59 / 60/ 61"], email: "info@oecl.sg" }
    ]
  },
  {
    code: "my", name: "Malaysia", lat: 1.4842, lng: 103.7629,
    cities: [
      { name: "PASIRGUDANG", lat: 1.4842, lng: 103.7629, address: "Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru", contacts: ["+603-3319 2778 / 74 / 75, 79"], email: "info@oecl.sg" },
      { name: "PORTKLANG", lat: 2.9982, lng: 101.3831, address: "MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200, Klang, Selangor D.E", contacts: ["+603 - 3319 2778 / 74 / 75"], email: "info@oecl.sg" }
    ]
  },
  {
    code: "ae", name: "United Arab Emirates (UAE)", lat: 25.2048, lng: 55.2708,
    cities: [
      { name: "Dubai", lat: 25.2048, lng: 55.2708, address: "Office # 509, Al Nazar Plaza, Oud Metha, Dubai, U.A.E", contacts: ["+971 4 3433388"] },
      { name: "JEBEL ALI", lat: 24.9857, lng: 55.1436, address: "Warehouse# Zg06, Near Roundabout 13, North Zone, p. B No: 30821, jebel Ali, Dubai, U.A.E", contacts: ["+971 4 8819787"] },
      { name: "ABU DHABI", lat: 24.4539, lng: 54.3773, address: "PB No: 30500, Office 3-1, Unit 101, 1st Floor, Al Jaber Jewellery Building, Al Khalidiya, Abu Dhabi, U.A.E", contacts: ["+971 50 4337214"] }
    ]
  },
  {
    code: "qa", name: "Qatar", lat: 25.276987, lng: 51.520008,
    cities: [
      { name: "Doha", lat: 25.276987, lng: 51.520008, address: "Office no: 48, 2nd Floor, Al matar Centre, Old Airport Road Doha", contacts: ["0974 33622555"] }
    ]
  },
  {
    code: "cn", name: "China", lat: 22.54262, lng: 114.11696,
    cities: [
      { name: "China", lat: 22.54262, lng: 114.11696, address: "13C02, Block A, Zhaoxin Huijin Plaza 3085 Shennan East Road, Luohu, Shenzhen.", contacts: ["+86 75582222447"], email: "helen@haixun.co" }
    ]
  },
  {
    code: "sa", name: "Saudi Arabia", lat: 26.4207, lng: 50.0888,
    cities: [
      { name: "Dammam", lat: 26.4207, lng: 50.0888, address: "Building No.2817, Secondary No9403, King Faisal Road, Al Tubebayshi Dist, Dammam, KSA 32233", contacts: ["+966 13 343 0003"] },
      { name: "Riyadh", lat: 24.7136, lng: 46.6753, address: "Room No. T18, Rail Business Centre, Bldg No. 3823, Omar Aimukhtar St, Thulaim, Riyadh 11332", contacts: ["+966 11295 0020"] },
      { name: "Jeddah", lat: 21.4858, lng: 39.1925, address: "Al-Madinah Al-Munawarah Road, Al Sharafeyah, Jeddah 4542 -22234, Kingdom of Saudi Arabia", contacts: ["+966 12 578 0874"] }
    ]
  },
  {
    code: "sg", name: "Singapore", lat: 1.3521, lng: 103.8198,
    cities: [
      { name: "Singapore", lat: 1.3521, lng: 103.8198, address: "Blk 511 Kampong Bahru Road, #03-01 Keppel Distripark, Singapore - 099447", contacts: ["+ 65 69080838"], email: "info.sg@globalconsol.com" }
    ]
  },
  {
    code: "id", name: "Indonesia", lat: -6.2088, lng: 106.8456,
    cities: [
      { name: "Jakarta", lat: -6.2088, lng: 106.8456, address: "408, Lina Building, JL.HR Rasuna Said kav B7, Jakarta", contacts: ["+62 21 529 20292, 522 4887"], email: "logistics.jkt@oecl.sg" },
      { name: "Surabaya", lat: -7.2575, lng: 112.7521, address: "Japfa Indoland Center, Japfa Tower 1, Lantai 4/401-A JL Jend, Basuki Rahmat 129-137, Surabaya 60271", contacts: ["+62 21 529 20292, 522 4887"], email: "logistics.jkt@oecl.sg" }
    ]
  },
  {
    code: "lk", name: "Sri Lanka", lat: 6.9271, lng: 79.8612,
    cities: [
      { name: "Colombo", lat: 6.9271, lng: 79.8612, address: "Ceylinco House, 9th Floor, No. 69, Janadhipathi Mawatha, Colombo 01, Sri Lanka", contacts: ["+94 114477499", "+94 114477494 / 98"], email: "info.cmb@globalconsol.com " }
    ]
  },
  {
    code: "th", name: "Thailand", lat: 13.72957, lng: 100.53095,
    cities: [
      { name: "Bangkok", lat: 13.72957, lng: 100.53095, address: "109 CCT Building, 3rd Floor, Rm.3, Surawong Road, Suriyawongse, Bangrak, Bangkok 10500 109", contacts: ["+662-634-3240", "+662-634-3942"], email: "info@oecl.sg" }
    ]
  },
  {
    code: "mm", name: "Myanmar", lat: 16.8409, lng: 96.1735,
    cities: [
      { name: "Yangon", lat: 16.8409, lng: 96.1735, address: "No.608, Room 8B, Bo Soon Pat Tower, Merchant Street, Pabedan Township, Yangon, Myanmar", contacts: ["+951 243158", "+951 377985, 243101"], email: "info@globalconsol.com" }
    ]
  },
  {
    code: "bd", name: "Bangladesh", lat: 23.8103, lng: 90.4125,
    cities: [
      { name: "Dhaka", lat: 23.8103, lng: 90.4125, address: "ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh", contacts: ["+880 1716 620989"], email: "info@globalconsol.com" }
    ]
  },
  {
    code: "pk", name: "Pakistan", lat: 24.8608, lng: 67.0097,
    cities: [
      { name: "Karachi", lat: 24.8608, lng: 67.0097, address: "Suite No. 507 & 508, 5th Floor Fortune Center, Block-6, P.E.C.H.S, Shahrah-e-Faisal, Karachi, Pakistan", contacts: ["+92 21 34542881/ +92 21 34542882/ +92 21 34542883/ +92 21 34542884"], email: "info.pk@ggl.sg" },
      { name: "Lahore", lat: 31.5204, lng: 74.3487, address: "Office # 301, 3rd Floor, Gulberg Arcade Main Market, Gulberg 2, Lahore, Pakistan", contacts: ["+92 42-35782306/07/08"], email: "info.pk@globalconsol.com" }
    ]
  },
  {
    code: "us", name: "United States (USA)", lat: 41.8622, lng: -87.7209,
    cities: [
      { name: "Chicago", lat: 41.8622, lng: -87.7209, address: "939 W. North Avenue, Suite 750, Chicago, IL 60642", contacts: ["+1 847 254 7320"], email: "info@gglusa.us" },
      { name: "New York", lat: 37.4545, lng: -122.1818, address: "New Jersey Branch, 33 Wood Avenue South Suite 600, Iselin, NJ 08830", contacts: ["+1 732 456 6780"], email: "info@gglusa.us" },
      { name: "Los Angeles", lat: 40.5330, lng: -74.3481, address: "2250 South Central Avenue Compton, CA 90220", contacts: ["+1 310 928 3903"], email: "info@gglusa.us" }
    ]
  },
  {
    code: "gb", name: "United Kingdom (UK)", lat: 51.5074, lng: -0.1278,
    cities: [
      { name: "London", lat: 51.5074, lng: -0.1278, address: "167-169 Great Portland Street 5th Floor, London W1W 5PF, United Kingdom", contacts: ["+44 (0) 203 393 9508"] }
    ]
  },
  {
    code: "au", name: "Australia", lat: -37.7064, lng: 144.8503,
    cities: [
      { name: "Melbourne", lat: -37.7064, lng: 144.8503, address: "Suite 5, 7-9 Mallet Road, Tullamarine, Victoria, 3043", contacts: ["Mob: +61 432254969", "Tel: +61 388205157"], email: "info@gglaustralia.com" }
    ]
  }
];

const GlobalPresenceAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    main_title: 'Global Presence',
    main_description: 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
    map_url: 'https://www.google.com/maps/d/u/0/embed?mid=1rF5337I7j7xk98at6ZPdMul4aglzrLg&ehbc&ehbc=2E312F&hl=en&output=embed',
  });

  const [locations, setLocations] = useState<CountryLocation[]>(defaultLocations);

  const [originalData, setOriginalData] = useState(formData);
  const [originalLocations, setOriginalLocations] = useState<CountryLocation[]>(defaultLocations);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('global_presence_section')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      
      const fetchedData = {
        main_title: data.main_title,
        main_description: data.main_description,
        map_url: data.map_url || formData.map_url,
      };
      setFormData(fetchedData);
      setOriginalData(fetchedData);
      
      let parsedLocations = data.locations_data;
      if (typeof parsedLocations === 'string') {
        try { parsedLocations = JSON.parse(parsedLocations); } catch(e) {}
      }
      if (!Array.isArray(parsedLocations)) parsedLocations = defaultLocations;
      setLocations(parsedLocations);
      setOriginalLocations(parsedLocations);
    } catch (error: any) {
      console.warn("Supabase fetch failed, checking local fallback:", error.message);
      const local = localStorage.getItem('fallback_global_presence_section');
      if (local) {
        const parsed = JSON.parse(local);
        const fetchedData = {
          main_title: parsed.main_title,
          main_description: parsed.main_description,
          map_url: parsed.map_url || formData.map_url,
        };
        setFormData(fetchedData);
        setOriginalData(fetchedData);
        
        let parsedFallback = parsed.locations_data;
        if (typeof parsedFallback === 'string') {
          try { parsedFallback = JSON.parse(parsedFallback); } catch(e) {}
        }
        if (!Array.isArray(parsedFallback)) parsedFallback = defaultLocations;
        setLocations(parsedFallback);
        setOriginalLocations(parsedFallback);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData) || JSON.stringify(locations) !== JSON.stringify(originalLocations);
    setIsDirty(hasChanges);
  }, [formData, originalData, locations, originalLocations]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        main_title: formData.main_title,
        main_description: formData.main_description,
        map_url: formData.map_url,
        locations_data: locations,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('global_presence_section')
        .upsert({ id: 1, ...updateData })
        .select();

      localStorage.setItem('fallback_global_presence_section', JSON.stringify(updateData));
      if (error) console.warn("Supabase save failed, but saved locally:", error.message);

      setOriginalData(formData);
      setOriginalLocations(locations);

      const newNotif = { message: "Global Presence Section was updated", time: new Date().toISOString() };
      const existing = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
      localStorage.setItem('admin_notifications', JSON.stringify([newNotif, ...existing].slice(0, 20)));
      window.dispatchEvent(new Event('website_updated'));

      toast({ title: "Section updated successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (index: number, field: keyof CountryLocation, value: any) => {
    const newLocs = [...locations];
    newLocs[index] = { ...newLocs[index], [field]: value };
    setLocations(newLocs);
  };

  const handleAddCountry = () => {
    setLocations([...locations, { code: '', name: 'New Country', lat: 0, lng: 0, cities: [] }]);
  };

  const handleRemoveCountry = (index: number) => {
    const newLocs = [...locations];
    newLocs.splice(index, 1);
    setLocations(newLocs);
  };

  const handleCityChange = (countryIdx: number, cityIdx: number, field: keyof City, value: any) => {
    const newLocs = [...locations];
    const newCities = [...newLocs[countryIdx].cities];
    newCities[cityIdx] = { ...newCities[cityIdx], [field]: value };
    newLocs[countryIdx] = { ...newLocs[countryIdx], cities: newCities };
    setLocations(newLocs);
  };

  const handleAddCity = (countryIdx: number) => {
    const newLocs = [...locations];
    newLocs[countryIdx].cities.push({ name: 'New Office', lat: 0, lng: 0, address: '', contacts: [], email: '', map_url: '' });
    setLocations(newLocs);
  };

  const handleRemoveCity = (countryIdx: number, cityIdx: number) => {
    const newLocs = [...locations];
    newLocs[countryIdx].cities.splice(cityIdx, 1);
    setLocations(newLocs);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-[1200px] w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Global Presence Settings</h1>
        <p className="text-muted-foreground">Manage the text for the Global Presence section on the home page.</p>
      </div>

      {isDirty && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-md text-sm border border-yellow-200 font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
          ⚠️ You have unsaved changes. Don't forget to click "Save Changes" before leaving!
        </div>
      )}

      <Tabs defaultValue="text">
        <TabsList className="w-full grid grid-cols-2 max-w-md">
          <TabsTrigger value="text">Text & Map URL</TabsTrigger>
          <TabsTrigger value="locations">Locations & Offices</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Edit Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input value={formData.main_title} onChange={(e) => handleChange('main_title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Section Description</Label>
                <Textarea value={formData.main_description} onChange={(e) => handleChange('main_description', e.target.value)} rows={3} />
              </div>
              <div className="space-y-2 pt-4 border-t">
                <Label>Google Maps Embed URL</Label>
                <Input value={formData.map_url} onChange={(e) => handleChange('map_url', e.target.value)} placeholder="https://www.google.com/maps/d/u/0/embed?mid=..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="mt-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Manage Global Locations</h2>
              <p className="text-sm text-gray-500">Add or edit countries and their specific city offices shown on the map.</p>
            </div>
            <Button onClick={handleAddCountry} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Country
            </Button>
          </div>

          <div className="space-y-6">
            {locations.map((country, cIdx) => (
              <Card key={cIdx} className="border-blue-100 shadow-md overflow-hidden">
                <div className="bg-blue-50 border-b border-blue-100 p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-blue-800">Country Name</Label>
                        <Input value={country.name} onChange={(e) => handleCountryChange(cIdx, 'name', e.target.value)} className="bg-white" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-blue-800">Flag Code (e.g. sg)</Label>
                        <Input value={country.code} onChange={(e) => handleCountryChange(cIdx, 'code', e.target.value)} className="bg-white" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-blue-800">Map Center Lat</Label>
                        <Input type="number" step="any" value={country.lat || 0} onChange={(e) => handleCountryChange(cIdx, 'lat', parseFloat(e.target.value) || 0)} className="bg-white" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-blue-800">Map Center Lng</Label>
                        <Input type="number" step="any" value={country.lng || 0} onChange={(e) => handleCountryChange(cIdx, 'lng', parseFloat(e.target.value) || 0)} className="bg-white" />
                      </div>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleRemoveCountry(cIdx)} title="Remove Country">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-700">City Offices</h4>
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => handleAddCity(cIdx)}>
                      <Plus className="w-3 h-3 mr-1" /> Add Office
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {country.cities && country.cities.length > 0 ? (
                      country.cities.map((city, cityIdx) => (
                        <div key={cityIdx} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8" 
                            onClick={() => handleRemoveCity(cIdx, cityIdx)}
                            title="Remove Office"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pr-10">
                            <div className="space-y-1">
                              <Label className="text-xs">City Name</Label>
                              <Input value={city.name} onChange={(e) => handleCityChange(cIdx, cityIdx, 'name', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Latitude</Label>
                              <Input type="number" step="any" value={city.lat || 0} onChange={(e) => handleCityChange(cIdx, cityIdx, 'lat', parseFloat(e.target.value) || 0)} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Longitude</Label>
                              <Input type="number" step="any" value={city.lng || 0} onChange={(e) => handleCityChange(cIdx, cityIdx, 'lng', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <Label className="text-xs">Full Address</Label>
                              <Textarea rows={2} value={city.address} onChange={(e) => handleCityChange(cIdx, cityIdx, 'address', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label className="text-xs">Phone Contacts (Comma separated)</Label>
                                <Input value={(city.contacts || []).join(',')} onChange={(e) => handleCityChange(cIdx, cityIdx, 'contacts', e.target.value.split(','))} placeholder="+65 1234, +65 5678" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Email</Label>
                                <Input value={city.email || ''} onChange={(e) => handleCityChange(cIdx, cityIdx, 'email', e.target.value)} placeholder="office@example.com" />
                              </div>
                            </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Individual Map Embed URL (Optional)</Label>
                            <Input value={city.map_url || ''} onChange={(e) => handleCityChange(cIdx, cityIdx, 'map_url', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
                          </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 bg-white border border-dashed rounded-lg">
                        <p className="text-sm text-gray-500">No offices added for {country.name || 'this country'} yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {locations.length === 0 && (
              <div className="text-center py-12 bg-white border border-dashed rounded-lg">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No countries configured. Click "Add Country" to begin.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
        <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default GlobalPresenceAdmin;
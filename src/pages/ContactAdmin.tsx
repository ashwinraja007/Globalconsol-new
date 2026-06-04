import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, MapPin, Link as LinkIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Office {
  name: string;
  address: string;
  phones: string[];
  emails: string[];
  map_url: string;
  website_url?: string;
  content?: string;
}

type OfficesData = Record<string, Office[]>;

const ContactAdmin = () => {
  const [officesData, setOfficesData] = useState<OfficesData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCountry, setNewCountry] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('contact_section').select('*').eq('id', 1).single();
      if (error) throw error;
      if (data) {
        let parsedOffices = data.offices_data;
        if (typeof parsedOffices === 'string') {
          try { parsedOffices = JSON.parse(parsedOffices); } catch(e) {}
        }
        if (parsedOffices && typeof parsedOffices === 'object') {
          setOfficesData(parsedOffices);
        }
      }
    } catch (error: any) {
      toast({ title: "Error fetching data", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('contact_section').upsert({ id: 1, offices_data: officesData });
      if (error) throw error;
      toast({ title: "Success", description: "Locations saved successfully." });
    } catch (error: any) {
      toast({ title: "Error saving data", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addCountry = () => {
    if (!newCountry.trim()) return;
    const countryKey = newCountry.trim().toUpperCase();
    if (officesData[countryKey]) {
      toast({ title: "Country already exists", variant: "destructive" });
      return;
    }
    setOfficesData({ ...officesData, [countryKey]: [] });
    setNewCountry("");
  };

  const deleteCountry = (country: string) => {
    if (!confirm(`Are you sure you want to delete ${country}?`)) return;
    const newData = { ...officesData };
    delete newData[country];
    setOfficesData(newData);
  };

  const addOffice = (country: string) => {
    const newOffice: Office = {
      name: "New Office",
      address: "",
      phones: [""],
      emails: [""],
      map_url: "",
      website_url: "",
      content: ""
    };
    setOfficesData({
      ...officesData,
      [country]: [...(officesData[country] || []), newOffice]
    });
  };

  const updateOffice = (country: string, officeIndex: number, field: keyof Office, value: any) => {
    const newData = { ...officesData };
    newData[country][officeIndex] = { ...newData[country][officeIndex], [field]: value };
    setOfficesData(newData);
  };

  const deleteOffice = (country: string, officeIndex: number) => {
    if (!confirm("Delete this office?")) return;
    const newData = { ...officesData };
    newData[country].splice(officeIndex, 1);
    setOfficesData(newData);
  };

  const handleArrayChange = (country: string, officeIndex: number, field: 'phones' | 'emails', arrayIndex: number, value: string) => {
    const newData = { ...officesData };
    newData[country][officeIndex][field][arrayIndex] = value;
    setOfficesData(newData);
  };

  const addArrayItem = (country: string, officeIndex: number, field: 'phones' | 'emails') => {
    const newData = { ...officesData };
    if (!newData[country][officeIndex][field]) {
      newData[country][officeIndex][field] = [];
    }
    newData[country][officeIndex][field].push("");
    setOfficesData(newData);
  };

  const removeArrayItem = (country: string, officeIndex: number, field: 'phones' | 'emails', arrayIndex: number) => {
    const newData = { ...officesData };
    newData[country][officeIndex][field].splice(arrayIndex, 1);
    setOfficesData(newData);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Location Management</h1>
          <p className="text-gray-500">Manage countries, offices, contact details, maps, and specific content.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[rgb(var(--brand-primary,37,99,235))] hover:bg-[rgb(var(--brand-primary-dark,29,78,216))] text-white shadow-md shadow-[rgba(var(--brand-primary,37,99,235),0.2)] border-0 transition-all duration-300">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Country</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input 
            placeholder="e.g. SINGAPORE" 
            value={newCountry} 
            onChange={(e) => setNewCountry(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCountry()}
          />
          <Button onClick={addCountry}><Plus className="w-4 h-4 mr-2"/> Add Country</Button>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="space-y-4">
        {Object.entries(officesData).map(([country, offices]) => (
          <AccordionItem key={country} value={country} className="bg-white border rounded-lg shadow-sm px-4">
            <div className="flex items-center justify-between">
              <AccordionTrigger className="hover:no-underline text-xl font-semibold py-4">
                {country} ({offices.length} Locations)
              </AccordionTrigger>
              <Button variant="ghost" size="sm" onClick={() => deleteCountry(country)} className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-4">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <AccordionContent className="pb-6 pt-2 space-y-6">
              {offices.map((office, oIdx) => (
                <Card key={oIdx} className="border-gray-200 shadow-sm relative overflow-visible mt-2">
                  <div className="absolute top-4 right-4 z-10">
                    <Button variant="destructive" size="sm" onClick={() => deleteOffice(country, oIdx)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Remove Office
                    </Button>
                  </div>
                  <CardHeader className="pb-3 border-b bg-gray-50/50 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-[rgb(var(--brand-primary,37,99,235))]"/> {office.name || `Office #${oIdx + 1}`}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Office Name / City *</label>
                        <Input value={office.name || ""} onChange={(e) => updateOffice(country, oIdx, 'name', e.target.value)} placeholder="e.g. Headquarters" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1"><LinkIcon className="w-3 h-3"/> Website URL</label>
                        <Input value={office.website_url || ""} onChange={(e) => updateOffice(country, oIdx, 'website_url', e.target.value)} placeholder="https://..." />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Office Address *</label>
                      <Textarea value={office.address || ""} onChange={(e) => updateOffice(country, oIdx, 'address', e.target.value)} rows={2} placeholder="Full physical address..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Phones */}
                      <div className="space-y-2 border p-4 rounded-lg bg-gray-50/30">
                        <label className="text-sm font-medium flex justify-between">
                          Phone Numbers
                          <button type="button" onClick={() => addArrayItem(country, oIdx, 'phones')} className="text-[rgb(var(--brand-primary,37,99,235))] text-xs font-bold tracking-wide hover:underline">+ Add Phone</button>
                        </label>
                        {(office.phones || []).map((phone, pIdx) => (
                          <div key={pIdx} className="flex gap-2">
                            <Input value={phone} onChange={(e) => handleArrayChange(country, oIdx, 'phones', pIdx, e.target.value)} placeholder="+1 234..." />
                            <Button variant="outline" size="icon" onClick={() => removeArrayItem(country, oIdx, 'phones', pIdx)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                          </div>
                        ))}
                      </div>

                      {/* Emails */}
                      <div className="space-y-2 border p-4 rounded-lg bg-gray-50/30">
                        <label className="text-sm font-medium flex justify-between">
                          Email Addresses
                          <button type="button" onClick={() => addArrayItem(country, oIdx, 'emails')} className="text-[rgb(var(--brand-primary,37,99,235))] text-xs font-bold tracking-wide hover:underline">+ Add Email</button>
                        </label>
                        {(office.emails || []).map((email, eIdx) => (
                          <div key={eIdx} className="flex gap-2">
                            <Input value={email} onChange={(e) => handleArrayChange(country, oIdx, 'emails', eIdx, e.target.value)} placeholder="info@..." />
                            <Button variant="outline" size="icon" onClick={() => removeArrayItem(country, oIdx, 'emails', eIdx)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Google Maps URL (iframe src) *</label>
                      <Input value={office.map_url || ""} onChange={(e) => updateOffice(country, oIdx, 'map_url', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country-specific Content</label>
                      <Textarea value={office.content || ""} onChange={(e) => updateOffice(country, oIdx, 'content', e.target.value)} placeholder="Special instructions, content or details specific to this location..." rows={3} />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" className="w-full border-dashed py-6" onClick={() => addOffice(country)}>
                <Plus className="w-4 h-4 mr-2" /> Add New Office to {country}
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ContactAdmin;
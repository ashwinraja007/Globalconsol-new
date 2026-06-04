import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const defaultOffices = {
  Singapore: [
    {
      name: "Headquarters",
      address: "Blk 511 Kampong Bahru Road, #03-01 Keppel Distripark, Singapore 099447",
      phones: ["+ 65 69084188"],
      emails: ["info.sg@globalconsol.com"],
    },
  ],
  "Sri Lanka": [
    {
      name: "Colombo",
      address: "Ceylinco House, 9th Floor, No. 69, Janadhipathi Mawatha, Colombo 01, Sri Lanka",
      phones: ["+94 114477494", "+94 114477498", "+94 114477499", "+94 764434885"],
      emails: ["info.cmb@globalconsol.com"],
    },
  ],
  Pakistan: [
    {
      name: "Karachi",
      address: "Suite No.301, 3rd Floor, Fortune Center, Shahrah-e-Faisal, Block 6, PECHS, Karachi, Pakistan.",
      phones: ["+92-300-8282511", "+92-21-34302281-5"],
      emails: ["info.pk@globalconsol.com"],
    },
    {
      name: "Lahore",
      address: "Office # 301, 3rd Floor, Gulberg Arcade Main Market, Gulberg 2, Lahore, Pakistan.",
      phones: ["+92 42-35782306", "+92 42-35782307", "+92 42-35782308"],
      emails: ["info.pk@globalconsol.com"],
    },
  ],
  Myanmar: [
    {
      name: "Yangon",
      address: "#1210, 12TH (A) FLOOR, SAKURA TOWER 339, BOGYOKE SAN ROAD, KYAUKTADA TOWNSHIP - 11181 YANGON, UNION OF MYANMAR",
      phones: ["951 243158", "951 243101"],
      emails: ["info@globalconsol.com"],
    },
  ],
  Bangladesh: [
    {
      name: "Dhaka",
      address: "ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord, No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh",
      phones: ["+880 1716 620989"],
      emails: ["info@globalconsol.com"],
    },
  ],
};

interface FlatOffice {
  id: string;
  country: string;
  name: string;
  address: string;
  phones: string;
  emails: string;
  map_url: string;
}

const flattenOffices = (data: Record<string, any[]>): FlatOffice[] => {
  const flat: FlatOffice[] = [];
  Object.keys(data).forEach(country => {
    data[country].forEach((o) => {
      flat.push({
        id: Math.random().toString(36).substring(7),
        country,
        name: o.name || '',
        address: o.address || '',
        phones: Array.isArray(o.phones) ? o.phones.join(', ') : (o.phones || ''),
        emails: Array.isArray(o.emails) ? o.emails.join(', ') : (o.emails || ''),
        map_url: o.map_url || ''
      });
    });
  });
  return flat;
};

const unflattenOffices = (flat: FlatOffice[]): Record<string, any[]> => {
  const data: Record<string, any[]> = {};
  flat.forEach(o => {
    const countryKey = o.country.trim();
    if (!countryKey) return;
    if (!data[countryKey]) {
      data[countryKey] = [];
    }
    data[countryKey].push({
      name: o.name.trim(),
      address: o.address.trim(),
      phones: (o.phones || '').split(',').map(s => s.trim()).filter(Boolean),
      emails: (o.emails || '').split(',').map(s => s.trim()).filter(Boolean),
      map_url: (o.map_url || '').trim()
    });
  });
  return data;
};

const ContactAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    main_title: 'Get In Touch',
    main_description: 'Ready to streamline your logistics? Contact us today for a customized solution.',
    form_title: 'Send us a Message',
    form_description: 'Fill out the form below and we\'ll get back to you within 24 hours.',
    offices_title: 'Our Offices'
  });
  
  const [offices, setOffices] = useState<FlatOffice[]>(flattenOffices(defaultOffices));

  const [originalData, setOriginalData] = useState(formData);
  const [originalOffices, setOriginalOffices] = useState<FlatOffice[]>(offices);
  
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_section')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      
      const fetchedData = {
        main_title: data.main_title,
        main_description: data.main_description,
        form_title: data.form_title || 'Send us a Message',
        form_description: data.form_description || 'Fill out the form below and we\'ll get back to you within 24 hours.',
        offices_title: data.offices_title || 'Our Offices'
      };
      setFormData(fetchedData);
      setOriginalData(fetchedData);
      
      let parsedOffices = data.offices_data;
      if (typeof parsedOffices === 'string') {
        try { parsedOffices = JSON.parse(parsedOffices); } catch(e) {}
      }
      if (!parsedOffices || typeof parsedOffices !== 'object' || Object.keys(parsedOffices).length === 0) {
        parsedOffices = defaultOffices;
      }

      const flat = flattenOffices(parsedOffices);
      setOffices(flat);
      setOriginalOffices(flat);
      
    } catch (error: any) {
      console.warn("Supabase fetch failed, checking local fallback:", error.message);
      const local = localStorage.getItem('fallback_contact_section');
      if (local) {
        const parsed = JSON.parse(local);
        const fetchedData = {
          main_title: parsed.main_title,
          main_description: parsed.main_description,
          form_title: parsed.form_title || 'Send us a Message',
          form_description: parsed.form_description || 'Fill out the form below and we\'ll get back to you within 24 hours.',
          offices_title: parsed.offices_title || 'Our Offices'
        };
        setFormData(fetchedData);
        setOriginalData(fetchedData);

        let parsedFallback = parsed.offices_data;
        if (typeof parsedFallback === 'string') {
          try { parsedFallback = JSON.parse(parsedFallback); } catch(e) {}
        }
        if (!parsedFallback || typeof parsedFallback !== 'object' || Object.keys(parsedFallback).length === 0) {
          parsedFallback = defaultOffices;
        }
        const flat = flattenOffices(parsedFallback);
        setOffices(flat);
        setOriginalOffices(flat);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData) || 
                       JSON.stringify(offices) !== JSON.stringify(originalOffices);
    setIsDirty(hasChanges);
  }, [formData, originalData, offices, originalOffices]);

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
        ...formData,
        offices_data: unflattenOffices(offices),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('contact_section')
        .upsert({ id: 1, ...updateData });

      if (error) throw error;

      localStorage.setItem('fallback_contact_section', JSON.stringify(updateData));

      setOriginalData(formData);
      setOriginalOffices(offices);

      const newNotif = { message: "Contact Section was updated", time: new Date().toISOString() };
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

  const handleOfficeChange = (id: string, field: keyof FlatOffice, value: string) => {
    setOffices(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handleAddOffice = () => {
    setOffices(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      country: '',
      name: '',
      address: '',
      phones: '',
      emails: '',
      map_url: ''
    }]);
  };

  const handleRemoveOffice = (id: string) => {
    setOffices(prev => prev.filter(o => o.id !== id));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Get In Touch Settings</h1>
        <p className="text-muted-foreground">Manage the text for the Contact form section.</p>
      </div>

      {isDirty && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-md text-sm border border-yellow-200 font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
          ⚠️ You have unsaved changes. Don't forget to click "Save Changes" before leaving!
        </div>
      )}

      <Tabs defaultValue="text">
        <TabsList className="w-full grid grid-cols-2 max-w-md">
          <TabsTrigger value="text">Text Content</TabsTrigger>
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
              <div className="pt-4 mt-4 border-t space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Form & Offices Text</h3>
                <div className="space-y-2">
                  <Label>Form Title</Label>
                  <Input value={formData.form_title} onChange={(e) => handleChange('form_title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Form Description</Label>
                  <Textarea value={formData.form_description} onChange={(e) => handleChange('form_description', e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Offices List Title</Label>
                  <Input value={formData.offices_title} onChange={(e) => handleChange('offices_title', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Locations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add, edit, or remove the office locations shown in the contact form dropdown.
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Country</TableHead>
                      <TableHead className="min-w-[150px]">Office Name</TableHead>
                      <TableHead className="min-w-[250px]">Address</TableHead>
                      <TableHead className="min-w-[200px]">Phones <span className="text-xs font-normal text-muted-foreground">(Comma sep)</span></TableHead>
                      <TableHead className="min-w-[200px]">Emails <span className="text-xs font-normal text-muted-foreground">(Comma sep)</span></TableHead>
                      <TableHead className="min-w-[200px]">Map Embed URL</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offices.map((office) => (
                      <TableRow key={office.id}>
                        <TableCell className="align-top p-2">
                          <Input 
                            value={office.country} 
                            onChange={e => handleOfficeChange(office.id, 'country', e.target.value)} 
                            placeholder="e.g. Singapore" 
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell className="align-top p-2">
                          <Input 
                            value={office.name} 
                            onChange={e => handleOfficeChange(office.id, 'name', e.target.value)} 
                            placeholder="e.g. Headquarters" 
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell className="align-top p-2">
                          <Textarea 
                            value={office.address} 
                            onChange={e => handleOfficeChange(office.id, 'address', e.target.value)} 
                            placeholder="Full address" 
                            rows={2} 
                            className="min-h-[2.25rem]"
                          />
                        </TableCell>
                        <TableCell className="align-top p-2">
                          <Textarea 
                            value={office.phones} 
                            onChange={e => handleOfficeChange(office.id, 'phones', e.target.value)} 
                            placeholder="+65 1234, +65 5678" 
                            rows={2} 
                            className="min-h-[2.25rem]"
                          />
                        </TableCell>
                        <TableCell className="align-top p-2">
                          <Textarea 
                            value={office.emails} 
                            onChange={e => handleOfficeChange(office.id, 'emails', e.target.value)} 
                            placeholder="info@..., hr@..." 
                            rows={2} 
                            className="min-h-[2.25rem]"
                          />
                        </TableCell>
                        <TableCell className="align-top p-2">
                          <Textarea 
                            value={office.map_url} 
                            onChange={e => handleOfficeChange(office.id, 'map_url', e.target.value)} 
                            placeholder="https://maps.google.com/..." 
                            rows={2} 
                            className="min-h-[2.25rem]"
                          />
                        </TableCell>
                        <TableCell className="align-top p-2 text-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50" 
                            onClick={() => handleRemoveOffice(office.id)}
                            title="Remove Office"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {offices.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No locations defined. Click the button below to add one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" className="w-full mt-4 border-dashed" onClick={handleAddOffice}>
                <Plus className="w-4 h-4 mr-2" /> Add New Location
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
        <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default ContactAdmin;
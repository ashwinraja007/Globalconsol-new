import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const ServicesAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    main_title: 'Our Services',
    main_description: 'Comprehensive logistics solutions to move your world efficiently and safely.',
    s1_title: 'SEA Freight', s1_desc: 'At GC, we cater to the unique requirement of our customers. With our extensive expertise in sea freight operations...', s1_image: '', s1_image_path: '',
    s2_title: 'Air Freight', s2_desc: 'As a leading air freight company, we excel in offering enhanced flexibility and global choice by collaborating with a diverse... ', s2_image: '', s2_image_path: '',
    s3_title: 'Warehousing', s3_desc: 'GC possesses the necessary resources and expertise to effectively manage the warehousing of diverse commodities, including cold...', s3_image: '', s3_image_path: '',
    s4_title: 'Project Cargo', s4_desc: 'We operate a specialized division focused on knowledge-based projects, staffed with highly skilled experts who have inherited... ', s4_image: '', s4_image_path: '',
    s5_title: '3PL', s5_desc: 'With our cutting-edge 3PL warehouse management system, you can optimize your business operations and implement advanced fulfill...', s5_image: '', s5_image_path: '',
    s6_title: 'Liquid Transportation', s6_desc: 'GC specializes in delivering comprehensive expertise and services for the transportation of liquid cargoes through ISO Tanks... ', s6_image: '', s6_image_path: '',
  });

  const [originalData, setOriginalData] = useState(formData);
  const [isDirty, setIsDirty] = useState(false);
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string | null>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services_content')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      
      const fetchedData = {
        main_title: data.main_title, main_description: data.main_description,
        s1_title: data.s1_title, s1_desc: data.s1_desc, s1_image: data.s1_image || '', s1_image_path: data.s1_image_path || '',
        s2_title: data.s2_title, s2_desc: data.s2_desc, s2_image: data.s2_image || '', s2_image_path: data.s2_image_path || '',
        s3_title: data.s3_title, s3_desc: data.s3_desc, s3_image: data.s3_image || '', s3_image_path: data.s3_image_path || '',
        s4_title: data.s4_title, s4_desc: data.s4_desc, s4_image: data.s4_image || '', s4_image_path: data.s4_image_path || '',
        s5_title: data.s5_title, s5_desc: data.s5_desc, s5_image: data.s5_image || '', s5_image_path: data.s5_image_path || '',
        s6_title: data.s6_title, s6_desc: data.s6_desc, s6_image: data.s6_image || '', s6_image_path: data.s6_image_path || '',
      };
      setFormData(fetchedData);
      setOriginalData(fetchedData);
    } catch (error: any) {
      console.warn("Supabase fetch failed, checking local fallback:", error.message);
      const local = localStorage.getItem('fallback_services_section');
      if (local) {
        const parsed = JSON.parse(local);
        setFormData(parsed);
        setOriginalData(parsed);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData) || Object.keys(imageFiles).length > 0;
    setIsDirty(hasChanges);
  }, [formData, originalData, imageFiles]);

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
      const updateData = { ...formData, updated_at: new Date().toISOString() };
      const { error } = await supabase.from('services_content').upsert({ id: 1, ...updateData });

      localStorage.setItem('fallback_services_section', JSON.stringify(updateData));
      if (error) console.warn("Supabase save failed, but saved locally:", error.message);

      setOriginalData(formData);

      const newNotif = { message: "Services Section was updated", time: new Date().toISOString() };
      const existing = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
      localStorage.setItem('admin_notifications', JSON.stringify([newNotif, ...existing].slice(0, 20)));
      window.dispatchEvent(new Event('website_updated'));

      toast({ title: "Services updated successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (num: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFiles(prev => ({ ...prev, [`s${num}`]: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreviews(prev => ({ ...prev, [`s${num}`]: e.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  // Titles to help identify cards
  const cardLabels = [
    "Service 1 (Sea Freight)", "Service 2 (Air Freight)", "Service 3 (Warehousing)",
    "Service 4 (Project Cargo)", "Service 5 (3PL)", "Service 6 (Liquid Transport)"
  ];

  const defaultImages = [
    "/oceanfreight.png",
    "/airfreight.png",
    "/warehousing.png",
    "/projectcargo.png",
    "/3pl.png",
    "/liquidtransportation.png"
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Services Section Settings</h1>
        <p className="text-muted-foreground">Manage the services text on the home page.</p>
      </div>

      {isDirty && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-md text-sm border border-yellow-200 font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
          ⚠️ You have unsaved changes. Don't forget to click "Save Changes" before leaving!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Main Section Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={formData.main_title} onChange={(e) => handleChange('main_title', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Subtitle Description</Label>
            <Textarea value={formData.main_description} onChange={(e) => handleChange('main_description', e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Card key={num}>
            <CardHeader className="pb-3">
              <CardTitle className="text-md">{cardLabels[num - 1]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input value={formData[`s${num}_title` as keyof typeof formData]} onChange={(e) => handleChange(`s${num}_title`, e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea value={formData[`s${num}_desc` as keyof typeof formData]} onChange={(e) => handleChange(`s${num}_desc`, e.target.value)} rows={4} className="text-sm" />
              </div>
              <div className="space-y-1 pt-2 border-t">
                <Label className="text-xs">Service Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleFileChange(num, e)} className="text-xs" />
                {(() => {
                  const imgSrc = imagePreviews[`s${num}`] || (formData[`s${num}_image` as keyof typeof formData] as string) || defaultImages[num - 1];
                  return imgSrc ? (
                    <div className="mt-2 aspect-video rounded-md overflow-hidden bg-gray-100 border relative">
                      <img 
                        src={imgSrc} 
                        alt={`Service ${num}`} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : null;
                })()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
        <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};
export default ServicesAdmin;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const servicesList = [
  { slug: 'sea-freight', name: 'Sea Freight' },
  { slug: 'air-freight', name: 'Air Freight' },
  { slug: 'customs-clearance', name: 'Customs Clearance' },
  { slug: 'warehousing', name: 'Warehousing' },
  { slug: 'consolidation', name: 'Consolidation' },
  { slug: 'project-cargo', name: 'Project Cargo' },
  { slug: 'transhipment', name: 'Transhipment' },
  { slug: 'liquid-cargo', name: 'Liquid Cargo' },
  { slug: 'third-party-logistics', name: 'Third Party Logistics' },
  { slug: 'liner-agency', name: 'Liner Agency' },
];

const ServicePagesAdmin = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const activeSlug = slug || servicesList[0].slug;
  const serviceName = servicesList.find(s => s.slug === activeSlug)?.name || 'Service';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image_url: '',
    image_path: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (activeSlug) fetchServiceData(activeSlug);
  }, [activeSlug]);

  const fetchServiceData = async (currentSlug: string) => {
    setLoading(true);
    setImageFile(null);
    setImagePreview(null);
    try {
      const { data, error } = await supabase
        .from('service_pages_content')
        .select('*')
        .eq('slug', currentSlug)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          content: data.content || '',
          image_url: data.image_url || '',
          image_path: data.image_path || ''
        });
        setImagePreview(data.image_url || null);
      } else {
        const defaultName = servicesList.find(s => s.slug === currentSlug)?.name || '';
        setFormData({ title: defaultName, description: '', content: '', image_url: '', image_path: '' });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error fetching data", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalImageUrl = formData.image_url;
      let finalImagePath = formData.image_path;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('services-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('services-images').getPublicUrl(fileName);
        finalImageUrl = publicUrl;
        finalImagePath = fileName;

        if (formData.image_path) await supabase.storage.from('services-images').remove([formData.image_path]);
      }

      const updateData = {
        slug: activeSlug, title: formData.title, description: formData.description,
        content: formData.content, image_url: finalImageUrl, image_path: finalImagePath,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('service_pages_content').upsert(updateData);
      if (error) throw error;
      
      setFormData(prev => ({ ...prev, image_url: finalImageUrl, image_path: finalImagePath }));
      setImageFile(null);
      
      toast({ title: "Service page updated successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit: {serviceName}</h1>
        <p className="text-muted-foreground">Manage the detailed content for the {serviceName} page.</p>
      </div>
      {!loading ? (
        <Card>
          <CardHeader><CardTitle>Edit Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Page Title</Label><Input value={formData.title} onChange={(e) => handleChange('title', e.target.value)} /></div>
            <div className="space-y-2"><Label>Short Description (Excerpt)</Label><Textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} /></div>
            <div className="space-y-2"><Label>Detailed Content</Label><Textarea value={formData.content} onChange={(e) => handleChange('content', e.target.value)} rows={10} placeholder="Full details of the service..." /></div>
            <div className="space-y-2"><Label>Featured Image</Label><Input type="file" accept="image/*" onChange={handleFileChange} />{imagePreview && (<div className="mt-4 max-w-md rounded-lg overflow-hidden border shadow-sm"><img src={imagePreview} alt="Preview" className="w-full h-auto object-cover" /></div>)}</div>
            <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 mt-4"><Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}</Button>
          </CardContent>
        </Card>
      ) : (<div className="p-8 text-center">Loading...</div>)}
    </div>
  );
};
export default ServicePagesAdmin;
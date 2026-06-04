import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const FooterAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [description, setDescription] = useState('15 Years Excellence in Logistics Industry GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly');
  const [copyrightText, setCopyrightText] = useState('Site Powered by Global Consolidators Pte Ltd. All rights reserved.');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>('/logo.png');
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('footer_section')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setDescription(data.description || '15 Years Excellence in Logistics Industry GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly');
        setCopyrightText(data.copyright_text || 'Site Powered by Global Consolidators Pte Ltd. All rights reserved.');
        setImagePreview(data.logo_url || '/logo.png');
        setCurrentImagePath(data.logo_path || null);
      }
    } catch (error: any) {
      console.warn("Using fallback content. Database fetch error:", error.message);
      const local = localStorage.getItem('fallback_footer_section');
      if (local) {
        const parsed = JSON.parse(local);
        setDescription(parsed.description || '15 Years Excellence in Logistics Industry GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly');
        setCopyrightText(parsed.copyright_text || 'Site Powered by Global Consolidators Pte Ltd. All rights reserved.');
        setImagePreview(parsed.logo_url || '/logo.png');
        setCurrentImagePath(parsed.logo_path || null);
      }
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
      let finalImageUrl = imagePreview;
      let finalImagePath = currentImagePath;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('footer-images')
          .upload(fileName, imageFile);
          
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('footer-images')
          .getPublicUrl(fileName);

        if (currentImagePath) {
          await supabase.storage.from('footer-images').remove([currentImagePath]);
        }

        finalImageUrl = publicUrl;
        finalImagePath = fileName;
      }

      const updateData = {
        id: 1,
        description,
        copyright_text: copyrightText,
        logo_url: finalImageUrl,
        logo_path: finalImagePath,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('footer_section').upsert(updateData).select();

      localStorage.setItem('fallback_footer_section', JSON.stringify(updateData));
      setImageFile(null);
      setCurrentImagePath(finalImagePath);
      
      window.dispatchEvent(new Event('website_updated'));
      if (error) throw error;

      toast({ title: "Footer settings updated successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div><h1 className="text-2xl font-bold tracking-tight">Footer Management</h1><p className="text-muted-foreground">Manage the text, logo, and copyright content displayed at the bottom of the site.</p></div>
      <Card>
        <CardHeader><CardTitle>Footer Settings</CardTitle><CardDescription>Update the website footer information.</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2"><Label>Footer Logo</Label><Input type="file" accept="image/*" onChange={handleFileChange} />{imagePreview && (<div className="mt-4 p-4 border rounded-lg bg-gray-900 w-fit"><img src={imagePreview} alt="Footer Logo Preview" className="h-16 w-auto object-contain" /></div>)}</div>
          <div className="space-y-2"><Label>Company Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Brief about us text shown in the footer..." /></div>
          <div className="space-y-2"><Label>Copyright Text</Label><Input value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} placeholder="e.g. Site Powered by Global Consolidators Pte Ltd. All rights reserved." /></div>
          <Button onClick={handleSave} disabled={saving} className="w-full bg-[#1565C0] hover:bg-[#0D47A1] text-white"><Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Settings'}</Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default FooterAdmin;
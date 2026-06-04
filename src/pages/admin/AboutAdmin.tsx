import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, ADMIN_COUNTRIES } from "@/contexts/AuthContext";

const AboutAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { adminCountry, setAdminCountry } = useAuth();
  const [recordId, setRecordId] = useState<number | null>(null);

  // Form states
  const [title, setTitle] = useState('About Us');
  const [subtitle, setSubtitle] = useState('15 Years Excellence in Logistics Industry');
  const [description, setDescription] = useState('GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly experienced team of logistics professionals with over 30 years of industry expertise, GC has swiftly emerged as one of the fastest-growing logistics and freight forwarding companies in South East Asia, the Indian subcontinent, and the Middle East.');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState({ 
    title: 'About Us', 
    subtitle: '15 Years Excellence in Logistics Industry', 
    description: 'GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly experienced team of logistics professionals with over 30 years of industry expertise, GC has swiftly emerged as one of the fastest-growing logistics and freight forwarding companies in South East Asia, the Indian subcontinent, and the Middle East.' 
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, [adminCountry]);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('about_section')
        .select('*')
        .eq('country', adminCountry)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setRecordId(data.id);
        setTitle(data.title || 'About Us');
        setSubtitle(data.subtitle || '15 Years Excellence in Logistics Industry');
        setDescription(data.description || 'GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly experienced team of logistics professionals with over 30 years of industry expertise, GC has swiftly emerged as one of the fastest-growing logistics and freight forwarding companies in South East Asia, the Indian subcontinent, and the Middle East.');
        setImagePreview(data.image_url);
        setCurrentImagePath(data.image_path);
        setOriginalData({
          title: data.title || 'About Us',
          subtitle: data.subtitle || '15 Years Excellence in Logistics Industry',
          description: data.description || 'GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly experienced team of logistics professionals with over 30 years of industry expertise, GC has swiftly emerged as one of the fastest-growing logistics and freight forwarding companies in South East Asia, the Indian subcontinent, and the Middle East.'
        });
      }
    } catch (error: any) {
      console.warn("Supabase fetch failed, checking local fallback:", error.message);
      const local = localStorage.getItem('fallback_about_section');
      if (local) {
        const parsed = JSON.parse(local);
        setTitle(parsed.title);
        setSubtitle(parsed.subtitle);
        setDescription(parsed.description);
        setOriginalData(parsed);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if any fields have been changed from their original values
  useEffect(() => {
    const hasChanges = title !== originalData.title || 
                       subtitle !== originalData.subtitle || 
                       description !== originalData.description || 
                       imageFile !== null;
    setIsDirty(hasChanges);
  }, [title, subtitle, description, imageFile, originalData]);

  // Warn the user if they try to close or refresh the page with unsaved changes
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!title || !subtitle || !description) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill all text fields." });
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = imagePreview;
      let finalImagePath = currentImagePath;

      // Upload new image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('about-images')
          .upload(fileName, imageFile);
          
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('about-images')
          .getPublicUrl(fileName);

        finalImageUrl = publicUrl;
        finalImagePath = fileName;

        // Delete old image if it existed in the bucket
        if (currentImagePath) {
          await supabase.storage.from('about-images').remove([currentImagePath]);
        }
      }

      const updateData = {
        ...(recordId ? { id: recordId } : {}),
        country: adminCountry,
        title,
        subtitle,
        description,
        image_url: finalImageUrl,
        image_path: finalImagePath,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('about_section')
        .upsert(updateData)
        .select();

      
      if (error) throw error;
      localStorage.setItem('fallback_about_section', JSON.stringify(updateData));

      setCurrentImagePath(finalImagePath);
      setImageFile(null);
      setOriginalData({ title, subtitle, description });
      
      // Log Notification
      const newNotif = { message: "About Section was updated", time: new Date().toISOString() };
      const existing = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
      localStorage.setItem('admin_notifications', JSON.stringify([newNotif, ...existing].slice(0, 20)));
      window.dispatchEvent(new Event('website_updated'));

      toast({ title: "About Section updated successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">About Section Settings</h1>
          <p className="text-slate-500 mt-1">Manage the home page About section for {ADMIN_COUNTRIES.find(c => c.value === adminCountry)?.label || adminCountry}.</p>
        </div>
        <Select value={adminCountry} onValueChange={setAdminCountry}>
          <SelectTrigger className="w-[200px] h-12 rounded-xl bg-slate-50 border-slate-200 font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D4A62A]" />
              <SelectValue placeholder="Select Country" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {ADMIN_COUNTRIES.map(country => (
              <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isDirty && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-md text-sm border border-yellow-200 font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
          ⚠️ You have unsaved changes. Don't forget to click "Save Changes" before leaving!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Subtitle (Highlight)</Label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description Paragraph</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
          </div>
          <div className="space-y-2">
            <Label>Right Side Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-full max-w-md h-auto rounded-lg shadow-sm" />}
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default AboutAdmin;
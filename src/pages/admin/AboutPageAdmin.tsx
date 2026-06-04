import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const AboutPageAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);
  
  const [originalData, setOriginalData] = useState({ title: '', content: '', mission: '', vision: '' });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchAboutPageData();
  }, []);

  const fetchAboutPageData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('about_page_content')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setTitle(data.title || '');
        setContent(data.content || '');
        setMission(data.mission || '');
        setVision(data.vision || '');
        setImagePreview(data.image_url);
        setCurrentImagePath(data.image_path);
        setOriginalData({
          title: data.title || '',
          content: data.content || '',
          mission: data.mission || '',
          vision: data.vision || ''
        });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error fetching data", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasChanges = title !== originalData.title || 
                       content !== originalData.content || 
                       mission !== originalData.mission || 
                       vision !== originalData.vision || 
                       imageFile !== null;
    setIsDirty(hasChanges);
  }, [title, content, mission, vision, imageFile, originalData]);

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

        // Delete old image if it existed
        if (currentImagePath) {
          await supabase.storage.from('about-images').remove([currentImagePath]);
        }
      }

      const updateData = {
        title,
        content,
        mission,
        vision,
        image_url: finalImageUrl,
        image_path: finalImagePath,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('about_page_content').upsert({ id: 1, ...updateData });
      if (error) throw error;
      
      setCurrentImagePath(finalImagePath);
      setImageFile(null);
      setOriginalData({ title, content, mission, vision });
      
      toast({ title: "About Us Page updated successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">About Us Page Settings</h1>
        <p className="text-muted-foreground">Manage the content for your dedicated About Us page.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Page Content</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2"><Label>Main Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="space-y-2"><Label>Main Description Paragraph</Label><Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} /></div>
          <div className="space-y-2"><Label>Mission Statement</Label><Textarea value={mission} onChange={(e) => setMission(e.target.value)} rows={3} /></div>
          <div className="space-y-2"><Label>Vision Statement</Label><Textarea value={vision} onChange={(e) => setVision(e.target.value)} rows={3} /></div>
          <div className="space-y-2">
            <Label>Page Image</Label>
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
export default AboutPageAdmin;
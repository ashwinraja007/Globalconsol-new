import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Slide {
  id?: number;
  title: string;
  description: string;
  image_url: string;
  image_path?: string;
  order_index: number;
}

const defaultSlides: Slide[] = [
  { title: "GLOBAL CONSOL", description: "Singapore-based global freight forwarding and logistics solutions provider.", image_url: "/h1.png", order_index: 0 },
  { title: "LOGISTICS SERVICES", description: "Supported through own offices and network of key partners around the world.", image_url: "/h2.png", order_index: 1 },
  { title: "WAREHOUSE MANAGEMENT", description: "A cutting edge solutions with advanced WMS .", image_url: "/h3.png", order_index: 2 },
  { title: "MULTIPLE CARRIER OPTION", description: "Assublue space with contracted rates to major trade routes .", image_url: "/h4.png", order_index: 3 }
];

const HeroAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [imageFiles, setImageFiles] = useState<Record<number, File | null>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<number, string | null>>({});

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true });

      if (error && error.code !== 'PGRST116') throw error;

      if (data && data.length > 0) {
        const loadedSlides = [...defaultSlides];
        data.forEach(d => {
          if (d.order_index >= 0 && d.order_index < 4) {
            loadedSlides[d.order_index] = d;
          }
        });
        setSlides(loadedSlides);
      }
    } catch (error: any) {
      console.warn("Using default fallback content. Database fetch error:", error.message);
      const local = localStorage.getItem('fallback_hero_slides');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length === 4) setSlides(parsed);
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFiles(prev => ({ ...prev, [index]: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews(prev => ({ ...prev, [index]: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSlideChange = (index: number, field: keyof Slide, value: string) => {
    setSlides(prev => {
      const newSlides = [...prev];
      newSlides[index] = { ...newSlides[index], [field]: value };
      return newSlides;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedSlides = [...slides];

      for (let i = 0; i < 4; i++) {
        if (imageFiles[i]) {
          const file = imageFiles[i]!;
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('hero-images')
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('hero-images')
            .getPublicUrl(fileName);

          if (updatedSlides[i].image_path) {
            await supabase.storage.from('hero-images').remove([updatedSlides[i].image_path!]);
          }

          updatedSlides[i].image_url = publicUrl;
          updatedSlides[i].image_path = fileName;
        }
      }

      const { data, error } = await supabase.from('hero_slides').upsert(updatedSlides.map(s => ({
        ...(s.id ? { id: s.id } : {}),
        title: s.title,
        description: s.description,
        image_url: s.image_url,
        image_path: s.image_path,
        order_index: s.order_index
      }))).select();

      if (data) {
        data.forEach(d => {
          if (d.order_index >= 0 && d.order_index < 4) {
            updatedSlides[d.order_index] = { ...updatedSlides[d.order_index], id: d.id };
          }
        });
      }
      
      if (error) throw error;
      localStorage.setItem('fallback_hero_slides', JSON.stringify(updatedSlides));

      setSlides(updatedSlides);
      setImageFiles({});
      setImagePreviews({});
      
      // Trigger global event so the frontend updates instantly
      window.dispatchEvent(new Event('website_updated'));
      toast({ title: "Hero slides updated successfully" });
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
        <h1 className="text-2xl font-bold tracking-tight">Hero Section Settings</h1>
        <p className="text-muted-foreground">Manage the 4 sliding banners and images on the home page.</p>
      </div>

      <Tabs defaultValue="slide-0">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="slide-0">Slide 1</TabsTrigger>
          <TabsTrigger value="slide-1">Slide 2</TabsTrigger>
          <TabsTrigger value="slide-2">Slide 3</TabsTrigger>
          <TabsTrigger value="slide-3">Slide 4</TabsTrigger>
        </TabsList>
        
        {[0, 1, 2, 3].map((index) => (
          <TabsContent key={index} value={`slide-${index}`} className="mt-4">
            <Card>
              <CardHeader><CardTitle>Edit Slide {index + 1} Content</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Main Title</Label>
                  <Input value={slides[index].title} onChange={(e) => handleSlideChange(index, 'title', e.target.value)} placeholder="e.g. GLOBAL CONSOL" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={slides[index].description} onChange={(e) => handleSlideChange(index, 'description', e.target.value)} rows={3} placeholder="Providing seamless supply chain solutions..." />
                </div>
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(index, e)} />
                  {(imagePreviews[index] || slides[index].image_url) && (
                    <div className="mt-4 border rounded-lg overflow-hidden relative aspect-[21/9] bg-slate-100 max-w-2xl">
                      <img src={imagePreviews[index] || slides[index].image_url} alt={`Slide ${index + 1} Preview`} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Button onClick={handleSave} disabled={saving} className="w-full max-w-md bg-[#1565C0] hover:bg-[#0D47A1] text-white">
        <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save All Slides'}
      </Button>
    </div>
  );
};

export default HeroAdmin;
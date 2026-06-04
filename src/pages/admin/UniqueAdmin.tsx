import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const UniqueAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    main_title: 'What Makes Us Unique?',
    f1_title: 'Bespoke Logistics Solutions', 
    f1_desc: 'Efficient, cost-effective and innovative bespoke global logistics solutions with a wide range of services comprising of end-to-end logistics packages.',
    f2_title: 'Overseas Network', 
    f2_desc: 'Through our extensive network of international representatives, we are able to offer you a comprehensive range of high-quality logistical freight services.',
    f3_title: 'Service Driven', 
    f3_desc: 'We provide the highest quality of service and is widely recognized as the most customer-driven logistics company.',
    f4_title: 'Built To Deliver', 
    f4_desc: 'We provide the most reliable & cost effective logistics solutions thereby creating a long-term partnership with our clients.',
  });

  const [originalData, setOriginalData] = useState(formData);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('unique_section')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      
      const fetchedData = {
        main_title: data.main_title,
        f1_title: data.f1_title, f1_desc: data.f1_desc,
        f2_title: data.f2_title, f2_desc: data.f2_desc,
        f3_title: data.f3_title, f3_desc: data.f3_desc,
        f4_title: data.f4_title, f4_desc: data.f4_desc,
      };
      setFormData(fetchedData);
      setOriginalData(fetchedData);
    } catch (error: any) {
      console.warn("Supabase fetch failed, checking local fallback:", error.message);
      const local = localStorage.getItem('fallback_unique_section');
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
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setIsDirty(hasChanges);
  }, [formData, originalData]);

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
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('unique_section')
        .upsert({ id: 1, ...updateData });

      // Always save to local storage as a fallback in case Supabase fails
      localStorage.setItem('fallback_unique_section', JSON.stringify(updateData));

      if (error) console.warn("Supabase save failed, but saved locally:", error.message);

      setOriginalData(formData);

      const newNotif = { message: "Unique Section was updated", time: new Date().toISOString() };
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">What Makes Us Unique Settings</h1>
        <p className="text-muted-foreground">Manage the 4 unique features on the home page.</p>
      </div>

      {isDirty && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-md text-sm border border-yellow-200 font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
          ⚠️ You have unsaved changes. Don't forget to click "Save Changes" before leaving!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Main Section Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Input value={formData.main_title} onChange={(e) => handleChange('main_title', e.target.value)} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((num) => (
          <Card key={num}>
            <CardHeader>
              <CardTitle className="text-lg">Feature Box {num}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData[`f${num}_title` as keyof typeof formData]} onChange={(e) => handleChange(`f${num}_title`, e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData[`f${num}_desc` as keyof typeof formData]} onChange={(e) => handleChange(`f${num}_desc`, e.target.value)} rows={4} />
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

export default UniqueAdmin;
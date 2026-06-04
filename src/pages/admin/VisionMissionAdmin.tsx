import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const VisionMissionAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [mainTitle, setMainTitle] = useState('Our Vision & Mission');
  const [visionTitle, setVisionTitle] = useState('Our Vision');
  const [visionDescription, setVisionDescription] = useState('Our aim is to maintain our position as a leading global logistics solutions provider by utilizing advanced systems and the expertise of our skilled logistics professionals.');
  const [missionTitle, setMissionTitle] = useState('Our Mission');
  const [missionDescription, setMissionDescription] = useState("To be customers' first choice for logistics solutions like FCL, LCL, Air Freight, Project Cargo, Warehousing, 3PL, Liquid Transportation, and Liner Agency");

  const [originalData, setOriginalData] = useState({
    mainTitle: 'Our Vision & Mission', 
    visionTitle: 'Our Vision', 
    visionDescription: 'Our aim is to maintain our position as a leading global logistics solutions provider by utilizing advanced systems and the expertise of our skilled logistics professionals.', 
    missionTitle: 'Our Mission', 
    missionDescription: "To be customers' first choice for logistics solutions like FCL, LCL, Air Freight, Project Cargo, Warehousing, 3PL, Liquid Transportation, and Liner Agency"
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vision_mission_section')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;

      setMainTitle(data.main_title);
      setVisionTitle(data.vision_title);
      setVisionDescription(data.vision_description);
      setMissionTitle(data.mission_title);
      setMissionDescription(data.mission_description);

      setOriginalData({
        mainTitle: data.main_title,
        visionTitle: data.vision_title,
        visionDescription: data.vision_description,
        missionTitle: data.mission_title,
        missionDescription: data.mission_description,
      });
    } catch (error: any) {
      console.warn("Supabase fetch failed, checking local fallback:", error.message);
      const local = localStorage.getItem('fallback_vision_section');
      if (local) {
        const parsed = JSON.parse(local);
        setMainTitle(parsed.main_title); setVisionTitle(parsed.vision_title);
        setVisionDescription(parsed.vision_description); setMissionTitle(parsed.mission_title);
        setMissionDescription(parsed.mission_description);
        setOriginalData({ mainTitle: parsed.main_title, visionTitle: parsed.vision_title, visionDescription: parsed.vision_description, missionTitle: parsed.mission_title, missionDescription: parsed.mission_description });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasChanges = mainTitle !== originalData.mainTitle ||
                       visionTitle !== originalData.visionTitle ||
                       visionDescription !== originalData.visionDescription ||
                       missionTitle !== originalData.missionTitle ||
                       missionDescription !== originalData.missionDescription;
    setIsDirty(hasChanges);
  }, [mainTitle, visionTitle, visionDescription, missionTitle, missionDescription, originalData]);

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
    if (!mainTitle || !visionTitle || !visionDescription || !missionTitle || !missionDescription) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill all text fields." });
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        main_title: mainTitle,
        vision_title: visionTitle,
        vision_description: visionDescription,
        mission_title: missionTitle,
        mission_description: missionDescription,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('vision_mission_section')
        .upsert({ id: 1, ...updateData });

      // Always save to local storage as a fallback
      localStorage.setItem('fallback_vision_section', JSON.stringify(updateData));

      if (error) console.warn("Supabase save failed, but saved locally:", error.message);
      
      setOriginalData({ mainTitle, visionTitle, visionDescription, missionTitle, missionDescription });
      
      const newNotif = { message: "Vision & Mission Section was updated", time: new Date().toISOString() };
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vision & Mission Settings</h1>
        <p className="text-muted-foreground">Manage the Vision and Mission content on the home page.</p>
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
            <Label>Main Section Title</Label>
            <Input value={mainTitle} onChange={(e) => setMainTitle(e.target.value)} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Vision Title</Label>
                <Input value={visionTitle} onChange={(e) => setVisionTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Vision Description</Label>
                <Textarea value={visionDescription} onChange={(e) => setVisionDescription(e.target.value)} rows={5} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Mission Title</Label>
                <Input value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Mission Description</Label>
                <Textarea value={missionDescription} onChange={(e) => setMissionDescription(e.target.value)} rows={5} />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisionMissionAdmin;
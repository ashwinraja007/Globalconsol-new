import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText } from "lucide-react";

const PopupAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [isActive, setIsActive] = useState(true);
  const [title, setTitle] = useState('Important Notice');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>('/force majeure notice pdf.pdf');
  const [currentPdfPath, setCurrentPdfPath] = useState<string | null>(null);

  useEffect(() => {
    fetchPopupData();
  }, []);

  const fetchPopupData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('popup_section')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setIsActive(data.is_active ?? true);
        setTitle(data.title || 'Important Notice');
        setCurrentPdfUrl(data.pdf_url || '/force majeure notice pdf.pdf');
        setCurrentPdfPath(data.pdf_path || null);
      }
    } catch (error: any) {
      console.warn("Using fallback content. Database fetch error:", error.message);
      const local = localStorage.getItem('fallback_popup_section');
      if (local) {
        const parsed = JSON.parse(local);
        setIsActive(parsed.is_active ?? true);
        setTitle(parsed.title || 'Important Notice');
        setCurrentPdfUrl(parsed.pdf_url || '/force majeure notice pdf.pdf');
        setCurrentPdfPath(parsed.pdf_path || null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPdfFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalPdfUrl = currentPdfUrl;
      let finalPdfPath = currentPdfPath;

      if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('popup-docs')
          .upload(fileName, pdfFile);
          
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('popup-docs')
          .getPublicUrl(fileName);

        if (currentPdfPath) {
          await supabase.storage.from('popup-docs').remove([currentPdfPath]);
        }

        finalPdfUrl = publicUrl;
        finalPdfPath = fileName;
      }

      const updateData = {
        id: 1,
        is_active: isActive,
        title: title,
        pdf_url: finalPdfUrl,
        pdf_path: finalPdfPath,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('popup_section').upsert(updateData).select();

      localStorage.setItem('fallback_popup_section', JSON.stringify(updateData));
      setCurrentPdfUrl(finalPdfUrl);
      setCurrentPdfPath(finalPdfPath);
      setPdfFile(null);
      
      window.dispatchEvent(new Event('website_updated'));
      if (error) throw error;
      
      toast({ title: "Popup settings updated successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div><h1 className="text-2xl font-bold tracking-tight">Popup Management</h1><p className="text-muted-foreground">Manage the global document popup shown to visitors.</p></div>
      <Card>
        <CardHeader><CardTitle>Popup Settings</CardTitle><CardDescription>Toggle the popup and update the displayed PDF document.</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50"><div className="space-y-0.5"><Label className="text-base font-semibold">Enable Popup</Label><p className="text-sm text-gray-500">Show the popup to all website visitors 3 seconds after loading.</p></div><Switch checked={isActive} onCheckedChange={setIsActive} /></div>
          <div className="space-y-2"><Label>Internal Title / Reference</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Admission Notice 2024" /></div>
          <div className="space-y-2"><Label>PDF Document</Label><Input type="file" accept="application/pdf" onChange={handleFileChange} />{currentPdfUrl && !pdfFile && (<div className="mt-2 text-sm text-blue-600 flex items-center gap-2"><FileText className="w-4 h-4"/> <a href={currentPdfUrl} target="_blank" rel="noreferrer" className="hover:underline">View Current PDF</a></div>)}</div>
          <Button onClick={handleSave} disabled={saving} className="w-full bg-[#1565C0] hover:bg-[#0D47A1] text-white"><Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Settings'}</Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default PopupAdmin;
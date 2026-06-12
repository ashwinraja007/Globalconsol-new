import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Search } from "lucide-react";

interface SeoMetadata {
  id?: string;
  page_path: string;
  title: string;
  description: string;
  keywords: string;
  updated_at?: string;
}

const SeoAdmin = () => {
  const [metadata, setMetadata] = useState<SeoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<SeoMetadata>({
    page_path: '',
    title: '',
    description: '',
    keywords: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .order('page_path', { ascending: true });
      
      if (error) throw error;
      setMetadata(data || []);
    } catch (error: any) {
      console.error("Error fetching SEO data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.page_path) {
      toast({ title: "Error", description: "Page path is required", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('seo_metadata')
        .upsert({
          ...(editingId ? { id: editingId } : {}),
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({ title: "Success", description: "SEO metadata saved successfully" });
      resetForm();
      fetchMetadata();
      
      window.dispatchEvent(new Event('website_updated'));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: SeoMetadata) => {
    setFormData({
      page_path: item.page_path,
      title: item.title,
      description: item.description,
      keywords: item.keywords
    });
    setEditingId(item.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SEO configuration?")) return;
    
    try {
      const { error } = await supabase.from('seo_metadata').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Deleted", description: "SEO configuration removed" });
      fetchMetadata();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({ page_path: '', title: '', description: '', keywords: '' });
    setEditingId(null);
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading SEO configurations...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Search className="text-[#1565C0]" /> SEO Management
          </h1>
          <p className="text-slate-500 mt-1">Configure search engine metadata for all site pages.</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-slate-100 rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg text-[#1565C0]">{editingId ? 'Edit Configuration' : 'Add New Configuration'}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Page Path (e.g. /about-us)</label>
                <Input value={formData.page_path} onChange={(e) => setFormData({...formData, page_path: e.target.value})} placeholder="/" className="bg-slate-50" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Meta Title</label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Page Title | Global Consol" className="bg-slate-50" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Meta Description</label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Brief summary of the page..." className="bg-slate-50" rows={3} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Keywords (comma separated)</label>
              <Input value={formData.keywords} onChange={(e) => setFormData({...formData, keywords: e.target.value})} placeholder="logistics, shipping..." className="bg-slate-50" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-[#1565C0] hover:bg-[#0D47A1] text-white h-11 px-8 rounded-xl font-bold transition-all">
                <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save SEO Data"}
              </Button>
              {editingId && <Button type="button" variant="outline" onClick={resetForm} className="h-11 px-6 rounded-xl">Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-2">Existing Configurations</h2>
        <div className="grid gap-4">
          {metadata.map((item) => (
            <Card key={item.id} className="border-0 shadow-sm ring-1 ring-slate-100 rounded-2xl overflow-hidden hover:ring-[#1565C0]/30 transition-all">
              <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase tracking-wider">{item.page_path}</span>
                    <h3 className="font-bold text-slate-800">{item.title || "No Title Set"}</h3>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1 italic">{item.description || "No description provided."}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-[#1565C0]">Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id!)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeoAdmin;
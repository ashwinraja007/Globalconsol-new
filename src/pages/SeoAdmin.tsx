import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Search, Globe, Info, Layout, MousePointer2 } from "lucide-react";
import { useAuth, ADMIN_COUNTRIES } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_PATHS = [
  { label: "Home Page", value: "/" },
  { label: "About Us", value: "/about-us" },
  { label: "Services Overview", value: "/services" },
  { label: "Contact Us", value: "/contact" },
  { label: "Gallery", value: "/gallery" },
  { label: "Career Page", value: "/career" },
  { label: "Blog", value: "/blog" },
  { label: "Projects", value: "/projects" },
  { label: "Sea Freight", value: "/services/sea-freight" },
  { label: "Air Freight", value: "/services/air-freight" },
  { label: "Customs Clearance", value: "/services/customs-clearance" },
  { label: "Warehousing", value: "/services/warehousing" },
  { label: "Consolidation", value: "/services/consolidation" },
  { label: "Project Cargo", value: "/services/project-cargo" },
  { label: "Transhipment", value: "/services/transhipment" },
  { label: "Liquid Cargo", value: "/services/liquid-cargo" },
  { label: "3PL Logistics", value: "/services/third-party-logistics" },
  { label: "Liner Agency", value: "/services/liner-agency" },
];

interface SeoMetadata {
  id?: string;
  page_path: string;
  title: string;
  description: string;
  keywords: string;
  country?: string;
  updated_at?: string;
}

const SeoAdmin = () => {
  const [metadata, setMetadata] = useState<SeoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { adminCountry, setAdminCountry } = useAuth();

  const [formData, setFormData] = useState<SeoMetadata>({
    page_path: '',
    title: '',
    description: '',
    keywords: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    resetForm();
    fetchMetadata();
  }, [adminCountry]);

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('country', adminCountry)
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
          country: adminCountry,
          updated_at: new Date().toISOString()
        }, {
          onConflict: editingId ? 'id' : 'country,page_path'
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
          <p className="text-slate-500 mt-1">Manage metadata for <strong>{ADMIN_COUNTRIES.find(c => c.value === adminCountry)?.label || adminCountry}</strong></p>
        </div>
        <div className="flex items-center gap-4">
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
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-slate-100 rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg text-[#1565C0]">{editingId ? 'Edit Configuration' : 'Add New Configuration'}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-[#D4A62A]" /> Select or Type Page Path
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input 
                      value={formData.page_path} 
                      onChange={(e) => setFormData({...formData, page_path: e.target.value})} 
                      placeholder="e.g. /about-us" 
                      className="bg-slate-50 h-11 rounded-xl" 
                      required 
                    />
                  </div>
                  <Select onValueChange={(val) => setFormData({...formData, page_path: val})}>
                    <SelectTrigger className="w-[180px] h-11 rounded-xl bg-slate-100 border-none">
                      <SelectValue placeholder="Quick Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Main Pages</SelectLabel>
                        {SUGGESTED_PATHS.map(path => (
                          <SelectItem key={path.value} value={path.value}>{path.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#D4A62A]" /> Meta Title
                </label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Page Title | Global Consol" className="bg-slate-50 h-11 rounded-xl" />
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
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-800">Existing Configurations</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
            {metadata.length} Pages Configured
          </Badge>
        </div>
        <div className="grid gap-4">
          {metadata.map((item) => (
            <Card key={item.id} className="border-0 shadow-sm ring-1 ring-slate-100 rounded-2xl overflow-hidden hover:ring-[#1565C0]/30 transition-all">
              <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-slate-800 text-white font-mono">{item.page_path}</Badge>
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
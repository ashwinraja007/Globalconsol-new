import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Image as ImageIcon, Plus, Trash2, Globe } from "lucide-react";
import { useAuth, ADMIN_COUNTRIES } from "@/contexts/AuthContext";

const AboutUsAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { adminCountry, setAdminCountry } = useAuth();
  const [recordId, setRecordId] = useState<number | null>(null);

  const [data, setData] = useState({
    hero_title: 'About',
    hero_highlight: 'GC',
    hero_subtitle: 'Your premier global freight forwarding and logistics solutions provider',
    heading: '15 Years Excellence in Logistics Industry',
    paragraph_1: 'GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly experienced team of logistics professionals with over 30 years of industry expertise, GC has swiftly emerged as one of the fastest-growing logistics and freight forwarding companies in South East Asia, the Indian subcontinent, and the Middle East.',
    paragraph_2: 'Our competitive advantage lies in our dedicated warehouse facilities and owned fleet of trucks strategically located at key hubs, enabling us to deliver top-notch logistics services to our valued customers.',
    hero_image_url: '/customclearance.png',
    sl_cert_image_1_url: '/srilanka.jpg',
    sl_cert_image_2_url: '/Certificatesr.jpg',
    sl_heading: 'Certifications',
    sl_paragraph: 'Proud recipient of the <strong>Sri Lanka Brand Leadership Award 2024</strong> and certified to the <strong>ISO 9001:2015</strong> standard by <strong>TÜV NORD CERT GmbH (Germany)</strong>, GC Sri Lanka has earned its place as one of the region’s most trusted logistics partners. This internationally recognized certification, accredited by <strong>DAkkS (Germany’s National Accreditation Body)</strong>, demonstrates our commitment to global quality standards and continuous improvement.',
    sl_bullets: [
      'Industry recognition for <strong>Brand leadership</strong>',
      'ISO 9001:2015 certified by <strong>TÜV NORD CERT GmbH (Germany)</strong>, accredited by <strong>DAkkS</strong>'
    ],
    features: [
      "Global freight forwarding expertise",
      "Reliable network of agents",
      "30+ years industry experience",
      "Dedicated warehouse facilities",
      "Own fleet of trucks",
      "Strategic location advantages",
    ],
    stats: [
      { number: "15+", label: "Years Experience", icon: "TrendingUp" },
      { number: "500+", label: "Global Clients", icon: "Users" },
      { number: "50+", label: "Countries Served", icon: "Globe" },
      { number: "99%", label: "Customer Satisfaction", icon: "Award" },
    ]
  });

  useEffect(() => {
    fetchData();
  }, [adminCountry]);

  const fetchData = async () => {
    try {
      const { data: pageData, error } = await supabase.from('about_us_page').select('*').eq('country', adminCountry).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (pageData) {
        setRecordId(pageData.id);
        setData(prev => ({
          hero_title: pageData.hero_title || prev.hero_title,
          hero_highlight: pageData.hero_highlight || prev.hero_highlight,
          hero_subtitle: pageData.hero_subtitle || prev.hero_subtitle,
          heading: pageData.heading || prev.heading,
          paragraph_1: pageData.paragraph_1 || prev.paragraph_1,
          paragraph_2: pageData.paragraph_2 || prev.paragraph_2,
          hero_image_url: pageData.hero_image_url || prev.hero_image_url,
          sl_cert_image_1_url: pageData.sl_cert_image_1_url || prev.sl_cert_image_1_url,
          sl_cert_image_2_url: pageData.sl_cert_image_2_url || prev.sl_cert_image_2_url,
          sl_heading: pageData.sl_heading || prev.sl_heading,
          sl_paragraph: pageData.sl_paragraph || prev.sl_paragraph,
          sl_bullets: Array.isArray(pageData.sl_bullets) && pageData.sl_bullets.length > 0 ? pageData.sl_bullets : prev.sl_bullets,
          features: Array.isArray(pageData.features) && pageData.features.length > 0 ? pageData.features : prev.features,
          stats: Array.isArray(pageData.stats) && pageData.stats.length > 0 ? pageData.stats : prev.stats
        }));
      } else {
        setRecordId(null);
      }
    } catch (error: any) {
      console.log("Using default fallback content. Database fetch error:", error.message);
      // Recover from local storage if Supabase is offline/failing
      const local = localStorage.getItem('fallback_about_us_page');
      if (local) {
        try {
          setData(prev => ({ ...prev, ...JSON.parse(local) }));
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        ...(recordId ? { id: recordId } : {}),
        country: adminCountry,
        ...data,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('about_us_page').upsert(updateData);
      if (error) {
        throw error;
      }
      
      // Trigger notification for the header
      const newNotif = { message: "About Us page content was updated", time: new Date().toISOString() };
      const existing = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
      localStorage.setItem('admin_notifications', JSON.stringify([newNotif, ...existing].slice(0, 20)));
      window.dispatchEvent(new Event('website_updated'));

      toast({ title: "Success", description: "About Us page updated successfully." });
    } catch (error: any) {
      toast({ title: "Error saving data", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof typeof data, value: string) => {
    setData({ ...data, [field]: value });
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...data.sl_bullets];
    newBullets[index] = value;
    setData({ ...data, sl_bullets: newBullets });
  };

  const addBullet = () => setData({ ...data, sl_bullets: [...data.sl_bullets, ""] });
  const removeBullet = (index: number) => setData({ ...data, sl_bullets: data.sl_bullets.filter((_, i) => i !== index) });

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...data.features];
    newFeatures[index] = value;
    setData({ ...data, features: newFeatures });
  };
  const addFeature = () => setData({ ...data, features: [...data.features, ""] });
  const removeFeature = (index: number) => setData({ ...data, features: data.features.filter((_, i) => i !== index) });

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setData({ ...data, stats: newStats });
  };
  const addStat = () => setData({ ...data, stats: [...data.stats, { number: "", label: "", icon: "Star" }] });
  const removeStat = (index: number) => setData({ ...data, stats: data.stats.filter((_, i) => i !== index) });

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading content...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">About Us Page</h1>
          <p className="text-slate-500 mt-1">Manage the content for {ADMIN_COUNTRIES.find(c => c.value === adminCountry)?.label || adminCountry}.</p>
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
          <Button onClick={handleSave} disabled={saving} className="bg-[#1565C0] hover:bg-[#0D47A1] text-white shadow-lg shadow-[#1565C0]/25 border-0 h-12 px-6 rounded-xl font-bold transition-all duration-300">
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* HERO SECTION */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-100 rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg text-[#1565C0]">Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Main Title (e.g. About)</label>
                <Input value={data.hero_title} onChange={(e) => updateField('hero_title', e.target.value)} className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Highlighted Text (e.g. GC)</label>
                <Input value={data.hero_highlight} onChange={(e) => updateField('hero_highlight', e.target.value)} className="bg-slate-50" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Hero Subtitle</label>
              <Textarea value={data.hero_subtitle} onChange={(e) => updateField('hero_subtitle', e.target.value)} className="bg-slate-50" rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* COMPANY OVERVIEW */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-100 rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg text-[#1565C0]">Company Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Section Heading</label>
                  <Input value={data.heading} onChange={(e) => updateField('heading', e.target.value)} className="bg-slate-50 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">First Paragraph</label>
                  <Textarea value={data.paragraph_1} onChange={(e) => updateField('paragraph_1', e.target.value)} className="bg-slate-50" rows={5} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Second Paragraph</label>
                  <Textarea value={data.paragraph_2} onChange={(e) => updateField('paragraph_2', e.target.value)} className="bg-slate-50" rows={3} />
                </div>

                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                   <div className="flex justify-between items-center">
                     <label className="text-sm font-bold text-slate-700">Key Features</label>
                     <Button type="button" onClick={addFeature} size="sm" variant="outline" className="h-8 border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white"><Plus className="w-3 h-3 mr-1"/> Add Feature</Button>
                   </div>
                   {data.features.map((feature, idx) => (
                     <div key={idx} className="flex items-center gap-2">
                       <Input value={feature} onChange={(e) => updateFeature(idx, e.target.value)} className="bg-white" />
                       <Button variant="ghost" size="icon" onClick={() => removeFeature(idx)} className="text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0"><Trash2 className="w-4 h-4"/></Button>
                     </div>
                   ))}
                </div>

                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mt-6">
                   <div className="flex justify-between items-center">
                     <label className="text-sm font-bold text-slate-700">Company Stats</label>
                     <Button type="button" onClick={addStat} size="sm" variant="outline" className="h-8 border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white"><Plus className="w-3 h-3 mr-1"/> Add Stat</Button>
                   </div>
                   {data.stats.map((stat, idx) => (
                     <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                       <div className="space-y-1">
                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Number</label>
                         <Input value={stat.number} onChange={(e) => updateStat(idx, 'number', e.target.value)} placeholder="15+" />
                       </div>
                       <div className="space-y-1 sm:col-span-2">
                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Label</label>
                         <Input value={stat.label} onChange={(e) => updateStat(idx, 'label', e.target.value)} placeholder="Years Experience" />
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="space-y-1 flex-1">
                           <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Icon</label>
                           <Select value={stat.icon} onValueChange={(val) => updateStat(idx, 'icon', val)}>
                             <SelectTrigger><SelectValue/></SelectTrigger>
                             <SelectContent>
                               <SelectItem value="TrendingUp">TrendingUp</SelectItem>
                               <SelectItem value="Users">Users</SelectItem>
                               <SelectItem value="Globe">Globe</SelectItem>
                               <SelectItem value="Award">Award</SelectItem>
                               <SelectItem value="Truck">Truck</SelectItem>
                               <SelectItem value="Ship">Ship</SelectItem>
                               <SelectItem value="Star">Star</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                         <Button variant="ghost" size="icon" onClick={() => removeStat(idx)} className="text-red-500 hover:bg-red-50 hover:text-red-600 mb-0.5"><Trash2 className="w-4 h-4"/></Button>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Overview Image URL</label>
                <Input value={data.hero_image_url} onChange={(e) => updateField('hero_image_url', e.target.value)} className="bg-slate-50" placeholder="/customclearance.png" />
                {data.hero_image_url && (
                  <div className="mt-3 aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img src={data.hero_image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SRI LANKA CERTIFICATIONS */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-100 rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg text-[#1565C0]">Sri Lanka Certifications (LK Only)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Heading</label>
                <Input value={data.sl_heading} onChange={(e) => updateField('sl_heading', e.target.value)} className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description (HTML allowed)</label>
                <Textarea value={data.sl_paragraph} onChange={(e) => updateField('sl_paragraph', e.target.value)} className="bg-slate-50" rows={4} />
              </div>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex justify-between items-center">
                 <label className="text-sm font-bold text-slate-700">Bullet Points</label>
                 <Button type="button" onClick={addBullet} size="sm" variant="outline" className="h-8 border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white"><Plus className="w-3 h-3 mr-1"/> Add Bullet</Button>
               </div>
               {data.sl_bullets.map((bullet, idx) => (
                 <div key={idx} className="flex items-start gap-2">
                   <Textarea value={bullet} onChange={(e) => updateBullet(idx, e.target.value)} className="bg-white min-h-[40px] py-2" rows={1} />
                   <Button variant="ghost" size="icon" onClick={() => removeBullet(idx)} className="text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0"><Trash2 className="w-4 h-4"/></Button>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Certificate 1 Image URL</label>
                <Input value={data.sl_cert_image_1_url} onChange={(e) => updateField('sl_cert_image_1_url', e.target.value)} className="bg-slate-50" />
                {data.sl_cert_image_1_url && (
                  <div className="mt-3 aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 p-2">
                    <img src={data.sl_cert_image_1_url} alt="Certificate 1 Preview" className="w-full h-full object-contain bg-white rounded-lg" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Certificate 2 Image URL</label>
                <Input value={data.sl_cert_image_2_url} onChange={(e) => updateField('sl_cert_image_2_url', e.target.value)} className="bg-slate-50" />
                {data.sl_cert_image_2_url && (
                  <div className="mt-3 aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 p-2">
                    <img src={data.sl_cert_image_2_url} alt="Certificate 2 Preview" className="w-full h-full object-contain bg-white rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AboutUsAdmin;
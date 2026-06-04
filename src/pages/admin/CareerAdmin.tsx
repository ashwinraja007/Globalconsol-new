import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2 } from "lucide-react";

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

interface Job {
  title: string;
  description: string;
  location: string;
  type: string;
  department: string;
  link?: string;
}

const defaultData = {
  hero_title: 'Join Our Global Team',
  hero_description: 'Build your career with a leading logistics company that operates across Asia Pacific. We\'re always looking for talented individuals to join our growing family.',
  why_title: 'Why Work With Us',
  why_description: 'Join a company that values innovation, growth, and employee well-being',
  benefits: [
    { icon: "Users", title: "Great Team Culture", description: "Work with passionate professionals in a collaborative environment" },
    { icon: "TrendingUp", title: "Career Growth", description: "Opportunities for professional development and career advancement" },
    { icon: "Award", title: "Competitive Benefits", description: "Comprehensive health coverage, performance bonuses, and more" }
  ] as Benefit[],
  openings_title: 'Current Openings',
  openings_description: 'Explore exciting career opportunities across our global operations',
  jobs: [] as Job[],
  contact_title: 'Ready to Start Your Journey?',
  contact_description: 'Join our team and be part of a company that\'s shaping the future of logistics in Asia Pacific.'
};

const CareerAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [data, setData] = useState(defaultData);
  const [originalData, setOriginalData] = useState(defaultData);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: pageData, error } = await supabase.from('career_page').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;

      if (pageData) {
        const fetchedData = {
          hero_title: pageData.hero_title || defaultData.hero_title,
          hero_description: pageData.hero_description || defaultData.hero_description,
          why_title: pageData.why_title || defaultData.why_title,
          why_description: pageData.why_description || defaultData.why_description,
          benefits: Array.isArray(pageData.benefits) && pageData.benefits.length > 0 ? pageData.benefits : defaultData.benefits,
          openings_title: pageData.openings_title || defaultData.openings_title,
          openings_description: pageData.openings_description || defaultData.openings_description,
          jobs: Array.isArray(pageData.jobs) ? pageData.jobs : [],
          contact_title: pageData.contact_title || defaultData.contact_title,
          contact_description: pageData.contact_description || defaultData.contact_description
        };
        setData(fetchedData);
        setOriginalData(fetchedData);
      }
    } catch (error: any) {
      console.warn("Using fallback content. Database fetch error:", error.message);
      const local = localStorage.getItem('fallback_career_page');
      if (local) {
        const parsed = JSON.parse(local);
        setData(prev => ({ ...prev, ...parsed }));
        setOriginalData(prev => ({ ...prev, ...parsed }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);
    setIsDirty(hasChanges);
  }, [data, originalData]);

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
        id: 1,
        ...data,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('career_page').upsert(updateData).select();

      localStorage.setItem('fallback_career_page', JSON.stringify(updateData));
      setOriginalData(data);
      window.dispatchEvent(new Event('website_updated'));
      
      if (error) throw error;
      toast({ title: "Career page updated successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof typeof data, value: any) => setData(prev => ({ ...prev, [field]: value }));

  // Benefits
  const updateBenefit = (idx: number, field: keyof Benefit, value: string) => {
    const newBenefits = [...data.benefits];
    newBenefits[idx] = { ...newBenefits[idx], [field]: value };
    updateField('benefits', newBenefits);
  };
  const addBenefit = () => updateField('benefits', [...data.benefits, { icon: 'Star', title: 'New Benefit', description: '' }]);
  const removeBenefit = (idx: number) => updateField('benefits', data.benefits.filter((_, i) => i !== idx));

  // Jobs
  const updateJob = (idx: number, field: keyof Job, value: string) => {
    const newJobs = [...data.jobs];
    newJobs[idx] = { ...newJobs[idx], [field]: value };
    updateField('jobs', newJobs);
  };
  const addJob = () => updateField('jobs', [...data.jobs, { title: 'New Job Position', description: '', location: 'Singapore', type: 'Full-time', department: 'Operations' }]);
  const removeJob = (idx: number) => updateField('jobs', data.jobs.filter((_, i) => i !== idx));

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career Page Settings</h1>
        <p className="text-muted-foreground">Manage the content, benefits, and job openings for the Career page.</p>
      </div>

      {isDirty && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-md text-sm border border-yellow-200 font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
          ⚠️ You have unsaved changes. Don't forget to click "Save Changes" before leaving!
        </div>
      )}

      <Tabs defaultValue="hero">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="hero">Text Content</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="jobs">Job Openings</TabsTrigger>
          <TabsTrigger value="contact">Contact CTA</TabsTrigger>
        </TabsList>
        
        {/* Text Content */}
        <TabsContent value="hero" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={data.hero_title} onChange={(e) => updateField('hero_title', e.target.value)} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={data.hero_description} onChange={(e) => updateField('hero_description', e.target.value)} rows={3} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Why Work With Us Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={data.why_title} onChange={(e) => updateField('why_title', e.target.value)} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={data.why_description} onChange={(e) => updateField('why_description', e.target.value)} rows={2} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Openings Section Header</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={data.openings_title} onChange={(e) => updateField('openings_title', e.target.value)} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={data.openings_description} onChange={(e) => updateField('openings_description', e.target.value)} rows={2} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits */}
        <TabsContent value="benefits" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Company Benefits</CardTitle><CardDescription>Edit the 3 core benefits shown on the page.</CardDescription></div>
              <Button variant="outline" size="sm" onClick={addBenefit}><Plus className="w-4 h-4 mr-2"/> Add Benefit</Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.benefits.map((benefit, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-slate-50 relative group">
                  <Button variant="ghost" size="icon" onClick={() => removeBenefit(idx)} className="absolute top-2 right-2 text-red-500 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <Label>Title</Label>
                      <Input value={benefit.title} onChange={(e) => updateBenefit(idx, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label>Icon</Label>
                      <Select value={benefit.icon} onValueChange={(v) => updateBenefit(idx, 'icon', v)}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Users">Users</SelectItem>
                          <SelectItem value="TrendingUp">TrendingUp</SelectItem>
                          <SelectItem value="Award">Award</SelectItem>
                          <SelectItem value="Heart">Heart</SelectItem>
                          <SelectItem value="Star">Star</SelectItem>
                          <SelectItem value="Coffee">Coffee / Break</SelectItem>
                          <SelectItem value="Globe">Globe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Textarea value={benefit.description} onChange={(e) => updateBenefit(idx, 'description', e.target.value)} rows={2} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs */}
        <TabsContent value="jobs" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Job Openings</CardTitle><CardDescription>List your currently available positions.</CardDescription></div>
              <Button variant="outline" size="sm" onClick={addJob}><Plus className="w-4 h-4 mr-2"/> Add Job</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.jobs.length === 0 && <p className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">No open positions right now.</p>}
              {data.jobs.map((job, idx) => (
                <div key={idx} className="p-4 border rounded-lg relative">
                  <Button variant="ghost" size="icon" onClick={() => removeJob(idx)} className="absolute top-2 right-2 text-red-500 hover:bg-red-100"><Trash2 className="w-4 h-4"/></Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                    <div className="space-y-1"><Label>Job Title</Label><Input value={job.title} onChange={(e) => updateJob(idx, 'title', e.target.value)} placeholder="e.g. Logistics Coordinator" /></div>
                    <div className="space-y-1"><Label>Department</Label><Input value={job.department} onChange={(e) => updateJob(idx, 'department', e.target.value)} placeholder="e.g. Operations" /></div>
                    <div className="space-y-1"><Label>Location</Label><Input value={job.location} onChange={(e) => updateJob(idx, 'location', e.target.value)} placeholder="e.g. Singapore (Remote)" /></div>
                    <div className="space-y-1"><Label>Employment Type</Label><Input value={job.type} onChange={(e) => updateJob(idx, 'type', e.target.value)} placeholder="e.g. Full-time" /></div>
                  </div>
                  <div className="space-y-1 mb-4"><Label>Short Description</Label><Textarea value={job.description} onChange={(e) => updateJob(idx, 'description', e.target.value)} rows={2} /></div>
                  <div className="space-y-1"><Label>External Link (Optional)</Label><Input value={job.link || ''} onChange={(e) => updateJob(idx, 'link', e.target.value)} placeholder="https://..." /></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact */}
        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Bottom Contact CTA</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={data.contact_title} onChange={(e) => updateField('contact_title', e.target.value)} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={data.contact_description} onChange={(e) => updateField('contact_description', e.target.value)} rows={3} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-[#1565C0] hover:bg-[#0D47A1] text-white mt-6">
        <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
};
export default CareerAdmin;
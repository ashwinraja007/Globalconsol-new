import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Briefcase, Users, Award, TrendingUp, Heart, Star, Coffee, Globe } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ElementType> = {
  Users: Users,
  TrendingUp: TrendingUp,
  Award: Award,
  Heart: Heart,
  Star: Star,
  Coffee: Coffee,
  Globe: Globe,
  Briefcase: Briefcase
};

const Career = () => {
  const [pageData, setPageData] = useState({
    hero_title: 'Join Our Global Team',
    hero_description: 'Build your career with a leading logistics company that operates across Asia Pacific. We\'re always looking for talented individuals to join our growing family.',
    why_title: 'Why Work With Us',
    why_description: 'Join a company that values innovation, growth, and employee well-being',
    benefits: [
      { icon: "Users", title: "Great Team Culture", description: "Work with passionate professionals in a collaborative environment" },
      { icon: "TrendingUp", title: "Career Growth", description: "Opportunities for professional development and career advancement" },
      { icon: "Award", title: "Competitive Benefits", description: "Comprehensive health coverage, performance bonuses, and more" }
    ],
    openings_title: 'Current Openings',
    openings_description: 'Explore exciting career opportunities across our global operations',
    jobs: [] as any[],
    contact_title: 'Ready to Start Your Journey?',
    contact_description: 'Join our team and be part of a company that\'s shaping the future of logistics in Asia Pacific.'
  });

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const { data, error } = await supabase.from('career_page').select('*').eq('id', 1).single();
        if (error) throw error;
        if (data) {
          setPageData({
            hero_title: data.hero_title || pageData.hero_title,
            hero_description: data.hero_description || pageData.hero_description,
            why_title: data.why_title || pageData.why_title,
            why_description: data.why_description || pageData.why_description,
            benefits: Array.isArray(data.benefits) ? data.benefits : pageData.benefits,
            openings_title: data.openings_title || pageData.openings_title,
            openings_description: data.openings_description || pageData.openings_description,
            jobs: Array.isArray(data.jobs) ? data.jobs : [],
            contact_title: data.contact_title || pageData.contact_title,
            contact_description: data.contact_description || pageData.contact_description
          });
        }
      } catch (err) {
        const local = localStorage.getItem('fallback_career_page');
        if (local) {
          const parsed = JSON.parse(local);
          setPageData(prev => ({ ...prev, ...parsed }));
        }
      }
    };

    fetchCareerData();
    
    window.addEventListener('website_updated', fetchCareerData);
    return () => window.removeEventListener('website_updated', fetchCareerData);
  }, []);

  const scrollToOpenings = () => {
    document.getElementById('current-openings')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{pageData.hero_title}</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {pageData.hero_description}
            </p>
            <Button onClick={scrollToOpenings} className="bg-gc-gold hover:bg-gc-bronze text-white px-8 py-3 text-lg">
              View Open Positions
            </Button>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{pageData.why_title}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {pageData.why_description}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pageData.benefits.map((benefit, index) => {
                const IconComponent = iconMap[benefit.icon] || Star;
                return (
                <Card key={index} className="text-center p-6 border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-gc-gold" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              )})}
            </div>
          </div>
        </section>

        {/* Current Openings */}
        <section id="current-openings" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{pageData.openings_title}</h2>
              <p className="text-lg text-gray-600">
                {pageData.openings_description}
              </p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {pageData.jobs.length === 0 && (
                <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Openings Available</h3>
                  <p className="text-gray-500">Please check back later for new career opportunities.</p>
                </div>
              )}
              {pageData.jobs.map((job, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Link to={job.link || "/contact"}>
                        <Button className="bg-gc-gold hover:bg-gc-bronze text-white px-6">
                          Apply Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-lg mb-6">Don't see the right position? We'd still love to hear from you!</p>
              <Link to="/contact">
                <Button variant="outline" className="border-gc-gold text-gc-gold hover:bg-gc-gold hover:text-white px-8 py-3">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">{pageData.contact_title}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {pageData.contact_description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-gc-gold hover:bg-gc-bronze text-white px-8 py-3 w-full sm:w-auto">
                  Contact HR Team
                </Button>
              </Link>
              <Link to="/about-us">
                <Button variant="outline" className="border-white text-black hover:bg-white hover:text-gray-900 px-8 py-3 w-full sm:w-auto">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Career;

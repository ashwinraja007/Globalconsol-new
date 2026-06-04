import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CalendarIcon, Clock, User, ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured_image?: string;
  published_at: string;
}

const BlogDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  const fetchArticle = async (articleSlug: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', articleSlug)
        .single();

      if (error || !data) {
        console.log('Article not found in Supabase');
        setArticle(null);
      } else {
        setArticle(data);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setArticle(null);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getImageUrl = (article: Article) => {
    return article.featured_image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 pt-24 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 pt-24 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-red-600 hover:text-red-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <article>
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>OECL Team</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{getReadTime(article.content)}</span>
                </div>
              </div>
              
              <img 
                src={getImageUrl(article)} 
                alt={article.title} 
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-8" 
              />
            </header>
            
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
              />
            </div>
          </article>
          
          <div className="mt-12 pt-8 border-t">
            <Link to="/blog">
              <Button variant="outline" className="hover:bg-red-50 hover:border-red-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;

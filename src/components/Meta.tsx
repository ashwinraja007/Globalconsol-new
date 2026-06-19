import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import meta from '@/data/meta';
import { getCurrentCountryFromPath } from "@/services/countryDetection";
import { supabase } from "@/integrations/supabase/client";

const countries = ['singapore', 'sri-lanka', 'myanmar', 'bangladesh', 'pakistan', 'home'];

const Meta = () => {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  let pathKey = '/' + parts.join('/');

  if (parts.length > 0 && countries.includes(parts[0])) {
    pathKey = '/' + parts.slice(1).join('/');
  }

  if (pathKey === '/' || pathKey === '') {
    pathKey = '/';
  }

  if (pathKey === '/home') {
    pathKey = '/';
  }

  const defaultMeta = meta[pathKey] || meta['/'];
  const [metaData, setMetaData] = useState(defaultMeta);

  useEffect(() => {
    const fetchSEOMetadata = async () => {
      try {
        const currentCountry = getCurrentCountryFromPath(pathname);
        const countrySlug = currentCountry.name.toLowerCase().replace(/\s+/g, '');
        console.log(`[SEO Debug] Fetching SEO for PathKey: "${pathKey}", Country: "${countrySlug}"`);
        
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('seo_metadata' as any)
          .select('*')
          .eq('country', countrySlug)
          .eq('page_path', pathKey)
          .maybeSingle();

        if (error) {
          console.error('[SEO Debug] Supabase query error:', error);
        }

        if (data && !error) {
          console.log('[SEO Debug] Found matching SEO metadata in DB:', data);
          setMetaData({
            title: data.title || defaultMeta.title,
            description: data.description || defaultMeta.description,
            keywords: data.keywords || defaultMeta.keywords,
          });
        } else {
          console.log('[SEO Debug] No custom metadata found or query error occurred. Falling back to defaults:', defaultMeta);
          setMetaData(defaultMeta);
        }
      } catch (err) {
        console.error('[SEO Debug] Catch block error:', err);
        setMetaData(defaultMeta);
      }
    };

    fetchSEOMetadata();

    // Listen for admin changes (from website_updated event)
    const handleUpdate = () => fetchSEOMetadata();
    window.addEventListener('website_updated', handleUpdate);
    
    return () => {
      window.removeEventListener('website_updated', handleUpdate);
    };
  }, [pathname, pathKey, defaultMeta]);

  useEffect(() => {
    document.title = metaData.title;

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', metaData.description);
    setMeta('keywords', metaData.keywords);
  }, [metaData]);

  return null;
};

export default Meta;


import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMetaForPath, MetaInfo } from '@/data/meta';
import { getCurrentCountryFromPath } from "@/services/countryDetection";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook to dynamically update document head tags (title, description, keywords)
 * based on the current route and data from Supabase.
 */
export const useSEO = () => {
  const { pathname } = useLocation();
  const [dynamicMeta, setDynamicMeta] = useState<Record<string, MetaInfo>>({});

  // Fetch the latest SEO data from the database
  useEffect(() => {
    const fetchSEOMetadata = async () => {
      try {
        const currentCountry = getCurrentCountryFromPath(pathname);
        const countrySlug = currentCountry.name.toLowerCase().replace(/\s+/g, '');

        const { data, error } = await supabase
          .from('seo_metadata' as any)
          .select('*')
          .eq('country', countrySlug);

        if (data && !error) {
          const metaMap = data.reduce((acc: Record<string, MetaInfo>, item: any) => {
            acc[item.page_path] = {
              title: item.title,
              description: item.description,
              keywords: item.keywords,
            };
            return acc;
          }, {});
          setDynamicMeta(metaMap);
        }
      } catch (err) {
        console.error('SEO Fetch error:', err);
      }
    };

    fetchSEOMetadata();

    // Listen for admin changes
    const handleUpdate = () => fetchSEOMetadata();
    window.addEventListener('website_updated', handleUpdate);
    
    return () => {
      window.removeEventListener('website_updated', handleUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    const meta = getMetaForPath(pathname, dynamicMeta);

    document.title = meta.title;

    const updateOrCreateMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOrCreateMeta('description', meta.description);
    updateOrCreateMeta('keywords', meta.keywords);
  }, [pathname, dynamicMeta]);
};
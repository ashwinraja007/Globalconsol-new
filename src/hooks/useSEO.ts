import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMetaForPath, MetaInfo } from '@/data/meta';

/**
 * Custom hook to dynamically update document head tags (title, description, keywords)
 * based on the current route and data from the SEO API.
 */
export const useSEO = () => {
  const { pathname } = useLocation();
  const [dynamicMeta, setDynamicMeta] = useState<Record<string, MetaInfo>>({});

  // Fetch the latest SEO data from the database via the API
  useEffect(() => {
    fetch('/api/seo')
      .then((res) => res.json())
      .then((data) => {
        const metaMap = data.reduce((acc: Record<string, MetaInfo>, item: any) => {
          acc[item.page_path] = {
            title: item.title,
            description: item.description,
            keywords: item.keywords,
          };
          return acc;
        }, {});
        setDynamicMeta(metaMap);
      })
      .catch((err) => console.error('SEO Fetch error:', err));
  }, []);

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
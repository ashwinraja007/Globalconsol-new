-- Create a table for SEO metadata
CREATE TABLE IF NOT EXISTS public.seo_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT,
  country TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_country_page_path UNIQUE (country, page_path)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read seo_metadata" ON public.seo_metadata;
DROP POLICY IF EXISTS "Anyone can insert seo_metadata" ON public.seo_metadata;
DROP POLICY IF EXISTS "Anyone can update seo_metadata" ON public.seo_metadata;
DROP POLICY IF EXISTS "Anyone can delete seo_metadata" ON public.seo_metadata;

-- Create policies to allow public access (matching other tables in this admin setup)
CREATE POLICY "Anyone can read seo_metadata" 
  ON public.seo_metadata 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert seo_metadata" 
  ON public.seo_metadata 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update seo_metadata" 
  ON public.seo_metadata 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete seo_metadata" 
  ON public.seo_metadata 
  FOR DELETE 
  USING (true);


-- Update RLS policies for articles table to allow public operations
-- (since you're using a simple login system without Supabase auth)
DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON public.articles;

CREATE POLICY "Anyone can create articles" ON public.articles
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update articles" ON public.articles
FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete articles" ON public.articles
FOR DELETE USING (true);

-- Update RLS policies for gallery table to allow public operations
DROP POLICY IF EXISTS "Authenticated users can manage gallery images" ON public.gallery;

CREATE POLICY "Anyone can manage gallery images" ON public.gallery
FOR ALL USING (true) WITH CHECK (true);

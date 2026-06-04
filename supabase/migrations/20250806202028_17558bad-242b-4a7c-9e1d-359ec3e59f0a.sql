
-- Update RLS policies for storage buckets to allow public uploads
-- First, let's check and update the blog-images bucket policy
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;

-- Create policies for blog-images bucket
CREATE POLICY "Anyone can upload to blog-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anyone can view blog images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can update blog images" ON storage.objects
FOR UPDATE USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can delete blog images" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images');

-- Create policies for gallery buckets
CREATE POLICY "Anyone can upload to gallery buckets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('gallery-singapore', 'gallery-myanmar', 'gallery-bangladesh', 'gallery-pakistan', 'gallery-srilanka'));

CREATE POLICY "Anyone can view gallery images" ON storage.objects
FOR SELECT USING (bucket_id IN ('gallery-singapore', 'gallery-myanmar', 'gallery-bangladesh', 'gallery-pakistan', 'gallery-srilanka'));

CREATE POLICY "Anyone can update gallery images" ON storage.objects
FOR UPDATE USING (bucket_id IN ('gallery-singapore', 'gallery-myanmar', 'gallery-bangladesh', 'gallery-pakistan', 'gallery-srilanka'));

CREATE POLICY "Anyone can delete gallery images" ON storage.objects
FOR DELETE USING (bucket_id IN ('gallery-singapore', 'gallery-myanmar', 'gallery-bangladesh', 'gallery-pakistan', 'gallery-srilanka'));

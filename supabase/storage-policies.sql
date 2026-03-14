-- Storage policies for the 'biochemsafety' bucket
-- Allows authenticated users (admins) to upload, update, and delete files
-- Allows public read access for serving images on the site

-- Allow anyone to view/download files (public bucket)
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
CREATE POLICY "Allow public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'biochemsafety');

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'biochemsafety');

-- Allow authenticated users to update their uploads
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
CREATE POLICY "Allow authenticated updates"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'biochemsafety');

-- Allow authenticated users to delete files
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
CREATE POLICY "Allow authenticated deletes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'biochemsafety');

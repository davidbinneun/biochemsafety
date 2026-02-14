-- Update all service image URLs to use Supabase Storage
-- Run this after uploading images to your Supabase Storage bucket

-- Update Chemistry safety service
UPDATE public.services
SET
  icon_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/beakers1.png',
  image_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/DBPIndChem.png'
WHERE slug = 'Chemical safety-Risk Assessment in Chemical processes';

-- Update Biological safety service
UPDATE public.services
SET
  icon_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/microscope1.png',
  image_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/workingathoodpng.png'
WHERE slug = 'biological-safety-consulting';

-- Update Occupational health service
UPDATE public.services
SET
  icon_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/health_icon.png',
  image_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/health_image.png'
WHERE slug = 'occupational-health';

-- Update Nanosafety service
UPDATE public.services
SET
  icon_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/carbon-nanotube.png',
  image_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/scientist-nanotech.png'
WHERE slug = 'Nanosafety';

-- Update Quality Assurance service
UPDATE public.services
SET
  icon_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/reliability.png',
  image_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/avpovi.png'
WHERE slug = 'Quality Assurance & Reliability';

-- Update Poisons permit service
UPDATE public.services
SET
  icon_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/chemistry.png',
  image_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/scientist-bottles.png'
WHERE slug = 'Poisons permit';

-- Update Risk management service
UPDATE public.services
SET
  icon_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/risk-assessment.png',
  image_url = 'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/risk-image.png'
WHERE slug = 'risk-management';

-- Verify the updates
SELECT slug, icon_url, image_url
FROM public.services
ORDER BY "order";

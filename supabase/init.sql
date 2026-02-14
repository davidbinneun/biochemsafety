-- Supabase initialization schema for Biochemical Safety application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Services table (for biochemical safety services)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  benefits TEXT,
  process TEXT,
  icon_url TEXT,
  image_url TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_sample BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by TEXT
);

-- Add missing columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'slug') THEN
    ALTER TABLE public.services ADD COLUMN slug TEXT;
    ALTER TABLE public.services ADD CONSTRAINT services_slug_key UNIQUE (slug);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'short_description') THEN
    ALTER TABLE public.services ADD COLUMN short_description TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'full_description') THEN
    ALTER TABLE public.services ADD COLUMN full_description TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'benefits') THEN
    ALTER TABLE public.services ADD COLUMN benefits TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'process') THEN
    ALTER TABLE public.services ADD COLUMN process TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'icon_url') THEN
    ALTER TABLE public.services ADD COLUMN icon_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'image_url') THEN
    ALTER TABLE public.services ADD COLUMN image_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'order') THEN
    ALTER TABLE public.services ADD COLUMN "order" INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'created_by') THEN
    ALTER TABLE public.services ADD COLUMN created_by TEXT;
  END IF;
END $$;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Policies for services table
DROP POLICY IF EXISTS "Services are viewable by everyone." ON public.services;
CREATE POLICY "Services are viewable by everyone."
  ON public.services FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only authenticated users can manage services." ON public.services;
CREATE POLICY "Only authenticated users can manage services."
  ON public.services FOR ALL
  USING (auth.uid() IS NOT NULL);

DROP TRIGGER IF EXISTS handle_services_updated_at ON public.services;
CREATE TRIGGER handle_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Content blocks table (for page content management)
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  title TEXT,
  content TEXT,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  is_sample BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by TEXT
);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

-- Policies for content_blocks table
DROP POLICY IF EXISTS "Content blocks are viewable by everyone." ON public.content_blocks;
CREATE POLICY "Content blocks are viewable by everyone."
  ON public.content_blocks FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only authenticated users can manage content blocks." ON public.content_blocks;
CREATE POLICY "Only authenticated users can manage content blocks."
  ON public.content_blocks FOR ALL
  USING (auth.uid() IS NOT NULL);

DROP TRIGGER IF EXISTS handle_content_blocks_updated_at ON public.content_blocks;
CREATE TRIGGER handle_content_blocks_updated_at
  BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for contact_inquiries table
DROP POLICY IF EXISTS "Anyone can submit contact inquiries." ON public.contact_inquiries;
CREATE POLICY "Anyone can submit contact inquiries."
  ON public.contact_inquiries FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only authenticated users can view contact inquiries." ON public.contact_inquiries;
CREATE POLICY "Only authenticated users can view contact inquiries."
  ON public.contact_inquiries FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP TRIGGER IF EXISTS handle_contact_inquiries_updated_at ON public.contact_inquiries;
CREATE TRIGGER handle_contact_inquiries_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert Services data (only if not already exists)
INSERT INTO public.services (title, slug, short_description, full_description, benefits, process, icon_url, image_url, "order", created_by)
SELECT * FROM (VALUES
('בטיחות בכימיה - ניהול סיכונים בתהליכים כימיים', 'Chemical safety-Risk Assessment in Chemical processes',
'<p class="ql-align-right"><strong>"מתגובה למניעה":</strong> <strong>ייעוץ מקצועי שמחבר בין כימיה, תהליך ועבודה בשטח</strong>.</p><p class="ql-align-right">העבודה עם חומרים ותהליכים כימיים מחייבת הסתכלות מעשית ולא רק נהלים כתובים. "הבטיחות התהליכית" מתמקדת בזיהוי, ניתוח והטמעת אמצעי שליטה בסיכונים הנובעים מחומרים מסוכנים ותהליכים.</p>',
'<h3 class="ql-align-right">הייעוץ בתחום הכימיה מבוסס על ניסיון מעבדתי רב והיכרות עם אתגרי העבודה, במטרה לזהות סיכונים בזמן, לצמצם חשיפה וליישם פתרונות בטיחות שמתאימים למציאות בשטח ולעמידה בדרישות ורגולציה והתקנים המתאימים </h3>',
'ניסיון מעשי בעבודה עם חומרים ותהליכים מסוכנים
ניהול שיח מקצועי בגובה העיניים עם צוותים
יכולת לתרגם רגולציה לפתרונות ישימים, ולא רק על הנייר',
'',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/beakers1.png',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/DBPIndChem.png',
1, 'davidbinneun@gmail.com'),

(' בטיחות ביולוגית - יעוץ וניהול סיכונים ביולוגיים ', 'biological-safety-consulting',
'<p class="ql-align-right"><strong>מתרגמים את הבטיחות הביולוגית לעבודה בטוחה עם גורמי סיכון ביולוגיים</strong></p><p class="ql-align-right">מחקר ופיתוח מואצים, ייצור אבחוני וגידול גורמים ביולוגיים כגון תאים, חיידקים ונגיפים, מציבים אתגר מתמשך המחייב פיתוח והתאמה של כלים מתקדמים לניהול סיכונים תוך שמירה על בריאות העובדים ומניעת חשיפתם לסיכון</p>',
'<h3 class="ql-align-right">ניהול סיכונים ביולוגיים במעבדות ובמקומות עבודה שונים נעשה על ידי מומחית שמבינה גם את המדע וגם את תהליכים, סביבות העבודה והרגולציה</h3>',
'ניסיון מעשי ומיומנויות בעבודה במעבדות מיקרוביולוגיות ורפואיות
ניהול שיח מקצועי בגובה העיניים עם צוותים
יכולת לתרגם רגולציה לפתרונות יישימים, ולא רק על הנייר',
'',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/microscope1.png',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/workingathoodpng.png',
2, 'davidbinneun@gmail.com'),

('גהות תעסוקתית - בריאות העובד', 'occupational-health',
'<p class="ql-align-justify"><strong>מחלת מקצוע אינה "גזירה משמיים" והחשוב מכל הוא שהיא ניתנת למניעה או לפיצוי</strong></p>',
'<h3 class="ql-align-right"><strong>מחלת מקצוע או מחלה תעסוקתית הינה פגיעה בריאותית הנגרמת עקב תנאי עבודה, חשיפה לחומרים או עיסוק ייחודי.</strong></h3>',
' מרצה בתחום בטיחות וגהות בעבודה באקדמיה, מכללות, קורסים וימי עיון
היכרות וניסיון רב עם מגוון תהליכים שמשפיעים על בריאות העובד
היכרות מעמיקה עם הרגולציה ויכולת התאמתה לנתונים בשטח',
'',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/health_icon.png',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/health_image.png',
3, 'davidbinneun@gmail.com'),

('בטיחות וגיהות בננו-טכנולוגיות', 'Nanosafety',
'<p class="ql-align-right"><strong>ננוטכנולוגיה: "פוטנציאל עצום במימדים הקטנים"</strong></p><p class="ql-align-right"><strong>NanoSafety | ננו-בטיחות: שליטה בגורמי סיכון בקנה מידה ננומטרי</strong></p>',
'<p class="ql-align-right"><strong>מהם ננו-חומרים - Nanomaterials?</strong></p><p class="ql-align-right">ננו חומרים הם חומרים בהם לפחות מימד אחד בין 1 - 100 ננומטר, בלתי נראים לעין ומתאפיינים בתכונות ייחודיות הנובעות מגודלם הזעיר.</p>',
'',
'',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/carbon-nanotube.png',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/scientist-nanotech.png',
4, 'davidbinneun@gmail.com'),

('הבטחת איכות ואמינות', 'Quality Assurance & Reliability',
'<p class="ql-align-right"><strong>"ייזום עקבי במקום תיקון ותגובה לכשל"</strong></p><p class="ql-align-right"><strong><u>יעוץ והדרכות לאיכות</u>: אבינועם פורת , MsC מהנדס תעשיה וניהול מוסמך אמינות והבטחת איכות</strong></p>',
'<p class="ql-align-right"><strong>אמינות</strong> המוצר היא תכונה שמאפשרת הפעלה שוטפת לאורך מחזור חיי המוצר, תוך כדי שמירה על האיכות</p>',
'מומחיות
עתיר ידע ונסיון
מרצה מוערך',
'',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/reliability.png',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/avpovi.png',
5, 'davidbinneun@gmail.com'),

('היתר רעלים', 'Poisons permit',
'<p class="ql-align-right"><strong>כל עסק שברשותו חומרים מסוכנים נדרש להחזיק ולטפל בחומרים אלו ברישיון</strong></p>',
'<h3 class="ql-align-right"><strong>מהי בקשה להיתר רעלים</strong></h3><p class="ql-align-right">לצורך קבלת היתר רעלים נדרש מבקש ההיתר למלא אחר הדרישות של המשרד להגנת הסביבה</p>',
'ידע מקצועי וניסיון רב בעבודה עם חומרים מסוכנים
משלבת בין דרישות החוק, בטיחות והכרת תהליכי העבודה בפועל – לא רק תיאוריה
היתרי רעלים שנבנים מתוך היכרות אמיתית עם החומרים, השימוש והסיכונים בפועל',
'',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/chemistry.png',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/scientist-bottles.png',
6, 'davidbinneun@gmail.com'),

('ניהול סיכונים', 'risk-management',
'<h3 class="ql-align-right"><strong>ניהול סיכונים | סקר סיכונים כימיים| סקר סיכונים ביולוגיים | ייעוץ מקצועי מותאם לעסק תוך חסכון בזמן ובטעויות בדרך</strong></h3>',
'<h3 class="ql-align-right"><strong>"אם משהו יכול להשתבש במוקדם או מאוחר זה יקרה"</strong></h3><h3 class="ql-align-right">בניהול סיכונים <strong>חוק מרפי</strong> הידוע תמיד נמצא לפנינו</h3>',
'עבודה משותפת של מומחים : כימיה|ביולוגיה| הנדסה|
ידע וניסיון מצטבר',
'',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/risk-assessment.png',
'https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/risk-image.png',
7, 'davidbinneun@gmail.com')
) AS v(title, slug, short_description, full_description, benefits, process, icon_url, image_url, "order", created_by)
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE slug = v.slug);

-- Insert Content Blocks data (sample entries - you can add more as needed)
INSERT INTO public.content_blocks (page, section, title, content, icon, "order", created_by)
SELECT * FROM (VALUES
('home', 'hero', 'שם מלא', 'ד"ר דיאנה בלנק-פורת', '', 1, 'davidbinneun@gmail.com'),
('home', 'hero', 'שם חברה', 'BioChem Safety & Health', '', 2, 'davidbinneun@gmail.com'),
('home', 'hero', 'תפקיד 1', 'ביוכימאית בכירה', '', 3, 'davidbinneun@gmail.com'),
('home', 'hero', 'תפקיד 2', 'מוסמכת בריאות תעסוקתית וסביבתית', '', 4, 'davidbinneun@gmail.com'),
('home', 'hero', 'תפקיד 3', 'ממונה בטיחות וגהות בעבודה', '', 5, 'davidbinneun@gmail.com'),
('home', 'services-title', 'כותרת תחומי התמחות', 'תחומי התמחות', '', 1, 'davidbinneun@gmail.com'),
('home', 'contact-title', 'כותרת יצירת קשר', 'יצירת קשר', '', 1, 'davidbinneun@gmail.com'),
('home', 'contact-subtitle', 'תת כותרת יצירת קשר', 'BioChem Safety & Health - נשמח לעמוד לשירותכם ולענות על כל שאלה', '', 1, 'davidbinneun@gmail.com'),
('about', 'title', 'כותרת ראשית', 'אודות', '', 1, 'davidbinneun@gmail.com'),
('about', 'education', 'education', '[{"degree":"PHD","field":"מדעי החיים. מחקר באונקולוגיה ופרמקולוגיה","institution":"אוניברסיטת בר-אילן"},{"degree":" MPH","field":" בריאות הציבור: בריאות סביבתית וגהות תעסוקתית ","institution":"אוניברסיטת חיפה"},{"degree":" MHA","field":"   בריאות הציבור וניהול מערכות בריאות ","institution":"אוניברסיטת בר אילן"},{"degree":"  MSC","field":"מוסמכת ביוכימיה","institution":"אוניברסיטת סנטה פה, ארגנטינה"},{"degree":"הסמכה","field":"ממונה בטיחות וגהות","institution":"משרד העבודה, מנהל הבטיחות"}]', '', 0, 'blankporat@gmail.com'),
('contact', 'title', 'כותרת ראשית', 'יצירת קשר', '', 1, 'davidbinneun@gmail.com'),
('contact', 'professional-title', 'שם מקצועי', 'ד"ר דיאנה בלנק-פורת', '', 1, 'davidbinneun@gmail.com'),
('contact', 'professional-title', 'שם חברה', 'BioChem Safety & Health', '', 2, 'davidbinneun@gmail.com'),
('layout', 'footer', 'שם מלא', 'ד"ר דיאנה בלנק-פורת', '', 1, 'davidbinneun@gmail.com'),
('layout', 'footer', 'תיאור', 'ביוכימאית בכירה
מוסמכת בריאות תעסוקתית וסביבתית
ממונה בטיחות וגהות בעבודה', '', 2, 'davidbinneun@gmail.com'),
('layout', 'footer-links', 'כותרת קישורים', 'קישורים מהירים', '', 1, 'davidbinneun@gmail.com'),
('layout', 'footer-contact', 'כותרת יצירת קשר', 'יצירת קשר', '', 1, 'davidbinneun@gmail.com'),
('layout', 'footer-copyright', 'זכויות יוצרים', 'ד"ר דיאנה בלנק-פורת - BioChem Safety & Health. כל הזכויות שמורות.', '', 1, 'davidbinneun@gmail.com')
) AS v(page, section, title, content, icon, "order", created_by)
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_blocks
  WHERE page = v.page AND section = v.section AND title = v.title
);

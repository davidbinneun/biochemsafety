/**
 * Migration: Seed editable content blocks for pages that previously had hardcoded text.
 *
 * Creates content blocks for:
 * - Contact page: title, subtitle, details title, business hours, about section
 * - Services page: title, subtitle
 * - About page: "תחומי עיסוק" title
 *
 * Skips blocks that already exist (safe to re-run).
 *
 * Usage: node scripts/migrate-editable-content.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const envFile = readFileSync(resolve(ROOT, '.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^(\w+)=(.+)$/);
  if (match) env[match[1]] = match[2].trim();
});

const supabaseUrl = `https://${env.VITE_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = env.VITE_SUPABASE_SECRET_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const blocks = [
  // Contact page
  { page: 'contact', section: 'page-title', title: 'כותרת עמוד', content: 'יצירת קשר', order: 0 },
  { page: 'contact', section: 'page-subtitle', title: 'תת כותרת', content: 'נשמח לעמוד לשירותכם ולענות על כל שאלה', order: 1 },
  { page: 'contact', section: 'contact-details-title', title: 'כותרת פרטי התקשרות', content: 'פרטי התקשרות', order: 2 },
  { page: 'contact', section: 'business-hours', title: 'שעות פעילות', content: 'ראשון - חמישי: 9:00 - 18:00', order: 3 },
  {
    page: 'contact', section: 'about-section', title: 'סקשן אודות', order: 4,
    content: `<h3>ד"ר דיאנה בלנק-פורת</h3><p>ביוכימאית בכירה עם ניסיון רב בתחומי הבטיחות והבריאות התעסוקתית.</p><p>מוסמכת בריאות תעסוקתית וסביבתית, ממונה בטיחות וגהות בעבודה.</p><p><strong>התמחויות:</strong></p><ul><li>בטיחות כימית וביולוגית</li><li>גהות תעסוקתית</li><li>הסמכת נאמני בטיחות</li><li>ניהול בטיחות ואיכות</li></ul>`
  },

  // Services page
  { page: 'services-page', section: 'page-title', title: 'כותרת עמוד', content: 'תחומי התמחות', order: 0 },
  { page: 'services-page', section: 'page-subtitle', title: 'תת כותרת', content: 'שירותים מקצועיים לבטיחות ובריאות תעסוקתית', order: 1 },

  // About page - fields title
  { page: 'about', section: 'fields-title', title: 'כותרת תחומי עיסוק', content: 'תחומי עיסוק', order: 0 },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const block of blocks) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('content_blocks')
      .select('id')
      .eq('page', block.page)
      .eq('section', block.section)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`  SKIP: ${block.page}/${block.section} (already exists)`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('content_blocks')
      .insert(block);

    if (error) {
      console.error(`  ERROR: ${block.page}/${block.section}:`, error.message);
    } else {
      console.log(`  CREATE: ${block.page}/${block.section}`);
      created++;
    }
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
}

main();

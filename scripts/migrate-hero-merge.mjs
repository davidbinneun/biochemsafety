/**
 * Migration script: Merge separate hero content blocks into a single block.
 *
 * Reads existing hero blocks (שם מלא, שם חברה, תפקיד 1-4),
 * concatenates their HTML content into one block titled 'תוכן',
 * then deletes the old individual blocks.
 *
 * Usage: node scripts/migrate-hero-merge.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Read env from .env.local
const envFile = readFileSync(resolve(ROOT, '.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^(\w+)=(.+)$/);
  if (match) env[match[1]] = match[2].trim();
});

const supabaseUrl = `https://${env.VITE_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = env.VITE_SUPABASE_SECRET_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Fetch all hero content blocks
  const { data: heroBlocks, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('page', 'home')
    .eq('section', 'hero')
    .order('order');

  if (error) {
    console.error('Error fetching hero blocks:', error);
    process.exit(1);
  }

  if (!heroBlocks || heroBlocks.length === 0) {
    console.log('No hero blocks found. Nothing to migrate.');
    return;
  }

  // Check if already migrated (single block titled 'תוכן')
  if (heroBlocks.length === 1 && heroBlocks[0].title === 'תוכן') {
    console.log('Already migrated. Nothing to do.');
    return;
  }

  const getContent = (title) => {
    const item = heroBlocks.find(b => b.title === title);
    return item?.content || '';
  };

  // Build merged HTML preserving the original layout structure
  const parts = [];

  const name = getContent('שם מלא');
  if (name) parts.push(name);

  const company = getContent('שם חברה');
  if (company) parts.push(company);

  const roles = ['תפקיד 1', 'תפקיד 2', 'תפקיד 3', 'תפקיד 4']
    .map(t => getContent(t))
    .filter(Boolean);
  if (roles.length > 0) {
    parts.push(roles.join(''));
  }

  const mergedContent = parts.join('');

  console.log('Merged content preview:');
  console.log(mergedContent.substring(0, 200) + '...');
  console.log('');

  // Insert the new merged block
  const { data: newBlock, error: insertError } = await supabase
    .from('content_blocks')
    .insert({
      page: 'home',
      section: 'hero',
      title: 'תוכן',
      content: mergedContent,
      order: 0
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error creating merged block:', insertError);
    process.exit(1);
  }

  console.log(`Created merged block with id: ${newBlock.id}`);

  // Delete old individual blocks
  const oldIds = heroBlocks.map(b => b.id);
  const { error: deleteError } = await supabase
    .from('content_blocks')
    .delete()
    .in('id', oldIds);

  if (deleteError) {
    console.error('Error deleting old blocks:', deleteError);
    process.exit(1);
  }

  console.log(`Deleted ${oldIds.length} old hero blocks.`);
  console.log('Migration complete!');
}

main();

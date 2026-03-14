/**
 * Migration: Set up storage RLS policies for the 'biochemsafety' bucket.
 *
 * This script connects to Supabase's database via the pooled connection
 * and creates storage policies to allow authenticated uploads.
 *
 * Usage: node scripts/migrate-storage-policies.mjs
 *
 * Requires: SUPABASE_DB_URL in .env.local (pooled connection string from Supabase Dashboard > Settings > Database)
 *   Example: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
 *
 * If no DB URL is available, you can run the SQL manually in the Supabase SQL Editor:
 *   See supabase/storage-policies.sql
 */

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

const dbUrl = env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.log('='.repeat(60));
  console.log('No SUPABASE_DB_URL found in .env.local');
  console.log('');
  console.log('To run this migration automatically, add your pooled');
  console.log('database connection string to .env.local:');
  console.log('');
  console.log('  SUPABASE_DB_URL=postgresql://postgres.[ref]:[pass]@...:6543/postgres');
  console.log('');
  console.log('Alternatively, run the following SQL manually in the');
  console.log('Supabase Dashboard > SQL Editor:');
  console.log('='.repeat(60));
  console.log('');
  const sql = readFileSync(resolve(ROOT, 'supabase/storage-policies.sql'), 'utf-8');
  console.log(sql);
  process.exit(0);
}

// Dynamic import pg since it may not be installed
let pg;
try {
  pg = await import('pg');
} catch {
  console.log('Installing pg...');
  const { execSync } = await import('child_process');
  execSync('npm install pg', { cwd: ROOT, stdio: 'inherit' });
  pg = await import('pg');
}

const { Client } = pg.default || pg;
const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log('Connected to database.');

  const sql = readFileSync(resolve(ROOT, 'supabase/storage-policies.sql'), 'utf-8');
  await client.query(sql);

  console.log('Storage policies created successfully!');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
} finally {
  await client.end();
}

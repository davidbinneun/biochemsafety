-- Migration: Merge separate hero content blocks into a single rich-text block
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- Step 1: Build the combined HTML from existing hero blocks and insert as a new single block
INSERT INTO content_blocks (page, section, title, content, "order")
SELECT
  'home' AS page,
  'hero' AS section,
  'hero-content' AS title,
  COALESCE(
    '<h1>' || (SELECT content FROM content_blocks WHERE page = 'home' AND section = 'hero' AND title = 'שם מלא' LIMIT 1) || '</h1>' ||
    '<h2 style="color: #8B1538;">' || (SELECT content FROM content_blocks WHERE page = 'home' AND section = 'hero' AND title = 'שם חברה' LIMIT 1) || '</h2>' ||
    '<p><strong>' || COALESCE((SELECT content FROM content_blocks WHERE page = 'home' AND section = 'hero' AND title = 'תפקיד 1' LIMIT 1), '') || '</strong></p>' ||
    '<p>' || COALESCE((SELECT content FROM content_blocks WHERE page = 'home' AND section = 'hero' AND title = 'תפקיד 2' LIMIT 1), '') || '</p>' ||
    '<p>' || COALESCE((SELECT content FROM content_blocks WHERE page = 'home' AND section = 'hero' AND title = 'תפקיד 3' LIMIT 1), '') || '</p>' ||
    '<p><strong style="color: #8B1538;">' || COALESCE((SELECT content FROM content_blocks WHERE page = 'home' AND section = 'hero' AND title = 'תפקיד 4' LIMIT 1), '') || '</strong></p>',
    ''
  ) AS content,
  0 AS "order";

-- Step 2: Delete the old individual hero blocks (keep only the new merged one)
DELETE FROM content_blocks
WHERE page = 'home'
  AND section = 'hero'
  AND title IN ('שם מלא', 'שם חברה', 'תפקיד 1', 'תפקיד 2', 'תפקיד 3', 'תפקיד 4');

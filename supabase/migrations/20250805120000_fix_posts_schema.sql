-- Fix database schema to match application expectations
-- This migration adds missing columns that the application code expects

-- Add excerpt column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS excerpt text;

-- Add status column to posts table (mapping from is_published)
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'published'));

-- Populate status column based on existing is_published values
UPDATE posts 
SET status = CASE 
  WHEN is_published = true THEN 'published'
  ELSE 'draft'
END
WHERE status IS NULL;

-- Make status column non-null after populating
ALTER TABLE posts 
ALTER COLUMN status SET NOT NULL;

-- Create index on status for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_type_status ON posts(type, status);

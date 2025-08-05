-- Performance optimization migrations
-- Add indexes to improve query performance

-- Add indexes on posts table for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_posts_type_published ON posts(type, is_published);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type_published_created ON posts(type, is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Add indexes on icc_rankings table for better performance
CREATE INDEX IF NOT EXISTS idx_icc_rankings_format_category_rank ON icc_rankings(format, category, rank);
CREATE INDEX IF NOT EXISTS idx_icc_rankings_updated_at ON icc_rankings(updated_at DESC);

-- Add index on support_inquiries for admin dashboard
CREATE INDEX IF NOT EXISTS idx_support_inquiries_status_created ON support_inquiries(status, created_at DESC);

-- Add text search index for posts
CREATE INDEX IF NOT EXISTS idx_posts_title_search ON posts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_posts_content_search ON posts USING gin(to_tsvector('english', content));

-- Create a materialized view for frequently accessed post summaries
CREATE MATERIALIZED VIEW IF NOT EXISTS post_summaries AS
SELECT 
  id,
  title,
  slug,
  LEFT(REGEXP_REPLACE(content, '<[^>]*>', '', 'g'), 200) as excerpt,
  category,
  type,
  thumbnail_url,
  is_published,
  created_at,
  updated_at
FROM posts
WHERE is_published = true;

-- Create index on the materialized view
CREATE INDEX IF NOT EXISTS idx_post_summaries_type_created ON post_summaries(type, created_at DESC);

-- Refresh function for the materialized view
CREATE OR REPLACE FUNCTION refresh_post_summaries()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY post_summaries;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh materialized view when posts are updated
DROP TRIGGER IF EXISTS trigger_refresh_post_summaries ON posts;
CREATE TRIGGER trigger_refresh_post_summaries
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_post_summaries();

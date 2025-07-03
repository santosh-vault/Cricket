ALTER TABLE posts
  DROP CONSTRAINT IF EXISTS posts_type_check;

ALTER TABLE posts
  ADD CONSTRAINT posts_type_check CHECK (type IN ('news', 'blog', 'feature'));

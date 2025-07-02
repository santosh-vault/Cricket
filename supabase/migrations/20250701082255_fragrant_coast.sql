/*
  # Create Initial Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (text, default 'user')
      - `created_at` (timestamp)
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `content` (text)
      - `category` (text)
      - `type` (text, 'news' or 'blog')
      - `tags` (text array)
      - `author_id` (uuid, references users)
      - `thumbnail_url` (text, nullable)
      - `is_published` (boolean, default false)
      - `published_at` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `fixtures`
      - `id` (uuid, primary key)
      - `match_id` (text, unique)
      - `team1` (text)
      - `team2` (text)
      - `venue` (text)
      - `match_date` (timestamp)
      - `status` (text, default 'upcoming')
      - `tournament` (text)
      - `created_at` (timestamp)
    - `scorecards`
      - `id` (uuid, primary key)
      - `match_id` (text, references fixtures.match_id)
      - `json_data` (jsonb)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for public read access to published content
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT '',
  type text NOT NULL CHECK (type IN ('news', 'blog')),
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES users(id) ON DELETE CASCADE,
  thumbnail_url text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fixtures table
CREATE TABLE IF NOT EXISTS fixtures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id text UNIQUE NOT NULL,
  team1 text NOT NULL,
  team2 text NOT NULL,
  venue text NOT NULL,
  match_date timestamptz NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  tournament text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create scorecards table
CREATE TABLE IF NOT EXISTS scorecards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id text REFERENCES fixtures(match_id) ON DELETE CASCADE,
  json_data jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Posts policies
CREATE POLICY "Anyone can read published posts"
  ON posts
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Authors can read own posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Admin can read all posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin can insert posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin can update posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin can delete posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Fixtures policies
CREATE POLICY "Anyone can read fixtures"
  ON fixtures
  FOR SELECT
  TO anon, authenticated;

CREATE POLICY "Admin can manage fixtures"
  ON fixtures
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Scorecards policies
CREATE POLICY "Anyone can read scorecards"
  ON scorecards
  FOR SELECT
  TO anon, authenticated;

CREATE POLICY "Admin can manage scorecards"
  ON scorecards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_type_published ON posts(type, is_published);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fixtures_status ON fixtures(status);
CREATE INDEX IF NOT EXISTS idx_fixtures_match_date ON fixtures(match_date);
CREATE INDEX IF NOT EXISTS idx_fixtures_match_id ON fixtures(match_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scorecards_updated_at
  BEFORE UPDATE ON scorecards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 1. Update all posts to use the correct author_id
UPDATE posts
SET author_id = '76335a82-b8f5-4912-a59f-01236c7a1828'
WHERE author_id = '00000000-0000-0000-0000-000000000000';

-- 2. Insert the correct admin user (if not already present)
INSERT INTO users (id, email, role)
VALUES ('76335a82-b8f5-4912-a59f-01236c7a1828', 'admin@cricnews.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin', email = 'admin@cricnews.com';

-- 3. (Optional) Delete the old user row with the all-zeros UUID
DELETE FROM users
WHERE id = '00000000-0000-0000-0000-000000000000';
-- Create admin user if it doesn't exist
-- This migration ensures the admin user exists in the users table

-- Insert the admin user if it doesn't exist
INSERT INTO users (id, email, role)
SELECT 
  auth.uid(), 
  'admin@cricnews.com', 
  'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@cricnews.com'
)
AND auth.uid() IS NOT NULL;

-- Also create a fallback entry with a specific UUID for the admin user
INSERT INTO users (id, email, role)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'admin@cricnews.com', 'admin')
ON CONFLICT (email) DO UPDATE SET 
  role = 'admin',
  id = EXCLUDED.id;

-- Update the RLS policies to be more permissive for admin operations
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin can insert posts" ON posts;
DROP POLICY IF EXISTS "Admin can update posts" ON posts;
DROP POLICY IF EXISTS "Admin can delete posts" ON posts;
DROP POLICY IF EXISTS "Admin can read all posts" ON posts;

-- Create new, more robust admin policies for posts
CREATE POLICY "Admin users can manage posts"
  ON posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
    OR
    -- Fallback: allow if user email is in admin list
    auth.email() IN ('admin@cricnews.com', 'superfreundnp@gmail.com')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
    OR
    -- Fallback: allow if user email is in admin list
    auth.email() IN ('admin@cricnews.com', 'superfreundnp@gmail.com')
  );

-- Also create a function to automatically create user records for authenticated users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Determine role based on email
  DECLARE
    user_role text := 'user';
  BEGIN
    IF NEW.email IN ('admin@cricnews.com', 'superfreundnp@gmail.com') THEN
      user_role := 'admin';
    END IF;
    
    -- Insert into public.users
    INSERT INTO public.users (id, email, role)
    VALUES (NEW.id, NEW.email, user_role)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      role = EXCLUDED.role;
    
    RETURN NEW;
  END;
END;
$$;

-- Create trigger to automatically create user records
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Also handle existing users
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

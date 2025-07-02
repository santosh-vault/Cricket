/*
  # Add Default Admin User

  1. New Changes
    - Insert a default admin user into the users table
    - This user will have admin privileges and can be used for initial login

  2. Default Admin Credentials
    - Email: admin@cricnews.com
    - Password: CricNews2024!
    - Role: admin

  Note: This creates the user record in our users table. 
  The actual authentication record needs to be created through Supabase Auth.
*/

-- Insert default admin user
INSERT INTO users (id, email, role, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@cricnews.com',
  'admin',
  now()
) ON CONFLICT (email) DO NOTHING;

-- Insert some sample data for demonstration
INSERT INTO posts (
  title,
  slug,
  content,
  category,
  type,
  tags,
  author_id,
  thumbnail_url,
  is_published,
  published_at,
  created_at,
  updated_at
) VALUES 
(
  'India Wins Historic Test Series Against Australia',
  'india-wins-historic-test-series-australia',
  '<p>In a thrilling conclusion to one of the most anticipated Test series of the year, India secured a historic 3-1 victory against Australia on home soil. The series, which showcased exceptional cricket from both sides, will be remembered for outstanding individual performances and nail-biting finishes.</p>

<p>The turning point came in the third Test when Virat Kohli scored a magnificent double century, his first in over two years. The innings was a masterclass in patience and technique, as Kohli faced 312 balls and hit 24 boundaries in his unbeaten 201.</p>

<p>"This series win means everything to us," said captain Rohit Sharma in the post-match presentation. "The team showed incredible character, especially after losing the first Test. The way we bounced back shows the depth and resilience of this squad."</p>

<p>Australia''s Pat Cummins praised the Indian team''s performance: "They outplayed us in all departments. Credit to India for the way they adapted to the conditions and executed their plans."</p>

<p>The series also marked the emergence of young fast bowler Akash Deep, who took 18 wickets in four matches and was named Player of the Series. His ability to swing the ball both ways troubled the Australian batsmen throughout the series.</p>

<p>This victory strengthens India''s position in the World Test Championship standings and sets up an exciting finale to the current cycle.</p>',
  'International',
  'news',
  ARRAY['India', 'Australia', 'Test Cricket', 'Virat Kohli', 'World Test Championship'],
  '00000000-0000-0000-0000-000000000001',
  'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg',
  true,
  now(),
  now(),
  now()
),
(
  'IPL 2024: Mumbai Indians'' Road to Glory',
  'ipl-2024-mumbai-indians-road-to-glory',
  '<p>The Mumbai Indians'' journey to their sixth IPL title was nothing short of spectacular. After a slow start to the tournament, the five-time champions found their rhythm at the perfect time, winning eight consecutive matches to claim the trophy.</p>

<p>The transformation began with the return of Jasprit Bumrah from injury. His presence immediately strengthened the bowling attack, and his leadership of the pace unit was evident in the team''s improved death bowling statistics.</p>

<p>Rohit Sharma''s captaincy was once again exemplary. His tactical acumen, particularly in the powerplay overs and field placements, made the difference in crucial moments. The skipper also led from the front with the bat, scoring 512 runs in the tournament.</p>

<p>The emergence of young talents like Tilak Varma and Nehal Wadhera provided the perfect balance to the experienced core. Varma''s fearless approach in the middle overs and Wadhera''s finishing abilities were crucial in the team''s success.</p>

<p>In the final against Chennai Super Kings, Mumbai Indians chased down 192 with two balls to spare. Suryakumar Yadav''s unbeaten 78 off 44 balls was a masterpiece of T20 batting, showcasing his 360-degree game.</p>

<p>"This title is special because of how we fought back," said Rohit Sharma after lifting the trophy. "The character shown by the boys, especially the youngsters, has been phenomenal."</p>',
  'IPL',
  'news',
  ARRAY['IPL', 'Mumbai Indians', 'Rohit Sharma', 'Jasprit Bumrah', 'T20 Cricket'],
  '00000000-0000-0000-0000-000000000001',
  'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg',
  true,
  now(),
  now(),
  now()
),
(
  'The Evolution of T20 Cricket: A Tactical Analysis',
  'evolution-t20-cricket-tactical-analysis',
  '<p>Twenty years since its inception, T20 cricket has evolved from a simple entertainment format to a sophisticated tactical battleground. The game that once prioritized power hitting above all else now demands strategic depth, adaptability, and innovative thinking.</p>

<p>The most significant change has been in bowling strategies. Gone are the days when fast bowlers simply aimed for yorkers in the death overs. Today''s bowlers employ a variety of tactics: slower balls, wide yorkers, bouncers, and even the occasional full toss to keep batsmen guessing.</p>

<p>Field placements have become increasingly creative. Captains now use unconventional fields like having five fielders on one side of the wicket or placing a deep point for specific batsmen. The use of data analytics has made these decisions more precise and effective.</p>

<p>Batting approaches have also transformed dramatically. The concept of "batting through the innings" has given way to role-specific batting. Teams now have designated powerplay specialists, middle-overs accumulators, and death-overs finishers.</p>

<p>The impact player rule in recent tournaments has added another layer of strategy. Teams can now substitute a player mid-game, leading to tactical decisions about when to use this option for maximum advantage.</p>

<p>Perhaps the most interesting development is the emergence of "mystery spinners" and their counter-strategies. Batsmen have developed new techniques like the reverse sweep, switch hit, and ramp shots to combat these bowlers.</p>

<p>As T20 cricket continues to evolve, we can expect even more innovations in tactics, training methods, and player roles. The format that was once considered a "slogfest" has proven to be cricket''s most dynamic and strategically complex version.</p>',
  'Analysis',
  'blog',
  ARRAY['T20 Cricket', 'Tactics', 'Strategy', 'Evolution', 'Analysis'],
  '00000000-0000-0000-0000-000000000001',
  'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg',
  true,
  now(),
  now(),
  now()
);

-- Insert sample fixtures
INSERT INTO fixtures (
  match_id,
  team1,
  team2,
  venue,
  match_date,
  status,
  tournament,
  created_at
) VALUES 
(
  'IND_vs_AUS_2024_T20_001',
  'India',
  'Australia',
  'Wankhede Stadium, Mumbai',
  now() + interval '2 days',
  'upcoming',
  'T20 International Series',
  now()
),
(
  'ENG_vs_PAK_2024_ODI_001',
  'England',
  'Pakistan',
  'Lord''s Cricket Ground, London',
  now() + interval '5 days',
  'upcoming',
  'ODI Series',
  now()
),
(
  'SA_vs_NZ_2024_TEST_001',
  'South Africa',
  'New Zealand',
  'Newlands, Cape Town',
  now() + interval '1 week',
  'upcoming',
  'Test Series',
  now()
),
(
  'MI_vs_CSK_2024_IPL_FINAL',
  'Mumbai Indians',
  'Chennai Super Kings',
  'Narendra Modi Stadium, Ahmedabad',
  now() - interval '1 day',
  'completed',
  'Indian Premier League',
  now()
),
(
  'RCB_vs_KKR_2024_IPL_001',
  'Royal Challengers Bangalore',
  'Kolkata Knight Riders',
  'M. Chinnaswamy Stadium, Bangalore',
  now() + interval '3 hours',
  'live',
  'Indian Premier League',
  now()
);

-- Insert sample scorecard for the live match
INSERT INTO scorecards (
  match_id,
  json_data,
  updated_at
) VALUES (
  'RCB_vs_KKR_2024_IPL_001',
  '{
    "match_status": "live",
    "current_innings": 2,
    "team1": {
      "name": "Royal Challengers Bangalore",
      "short_name": "RCB",
      "innings": [
        {
          "runs": 187,
          "wickets": 8,
          "overs": 20.0,
          "run_rate": 9.35
        }
      ]
    },
    "team2": {
      "name": "Kolkata Knight Riders",
      "short_name": "KKR",
      "innings": [
        {
          "runs": 145,
          "wickets": 4,
          "overs": 16.2,
          "run_rate": 8.88
        }
      ]
    },
    "current_batsmen": [
      {
        "name": "Andre Russell",
        "runs": 67,
        "balls": 32,
        "fours": 4,
        "sixes": 5
      },
      {
        "name": "Rinku Singh",
        "runs": 28,
        "balls": 18,
        "fours": 2,
        "sixes": 1
      }
    ],
    "current_bowler": {
      "name": "Mohammed Siraj",
      "overs": 3.2,
      "maidens": 0,
      "runs": 28,
      "wickets": 2
    },
    "recent_overs": [
      {"over": 16, "runs": 12},
      {"over": 17, "runs": 8},
      {"over": 18, "runs": 15},
      {"over": 19, "runs": 11},
      {"over": 20, "runs": 9}
    ]
  }',
  now()
);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (new.id, new.email, 'user', now())
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user record when someone signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the default admin user to use the correct email
-- First, let's check if the admin user exists and update their role
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@cricnews.com';

-- If the admin user doesn't exist, create them
INSERT INTO users (id, email, role, created_at)
VALUES (
  gen_random_uuid(),
  'admin@cricnews.com',
  'admin',
  now()
) ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Fix RLS policies for users table
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admin can read all users" ON users;

-- Create more permissive policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to read all user data
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

-- Allow admins to manage all users
CREATE POLICY "Admin can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
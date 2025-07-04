CREATE TABLE IF NOT EXISTS icc_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  format text NOT NULL CHECK (format IN ('test', 'odi', 't20')),
  category text NOT NULL CHECK (category IN ('team', 'batter', 'bowler', 'allrounder')),
  rank integer NOT NULL,
  team_name text NOT NULL,
  flag_emoji text,
  rating integer NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Optional: Add index for fast lookup
CREATE INDEX IF NOT EXISTS idx_icc_rankings_format_category ON icc_rankings(format, category);

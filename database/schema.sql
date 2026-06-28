-- Soccer Community Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  match_time TIMESTAMPTZ NOT NULL,
  league TEXT,
  status TEXT DEFAULT 'upcoming',
  home_odds DECIMAL(5,2),
  draw_odds DECIMAL(5,2),
  away_odds DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  pick TEXT NOT NULL,
  reasoning TEXT,
  result TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Matches are public" ON matches FOR SELECT USING (true);
CREATE POLICY "Predictions are public" ON predictions FOR SELECT USING (true);
CREATE POLICY "Users can create predictions" ON predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- World Cup 2026 Group Stage Matches
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('Mexico', 'New Zealand', '2026-06-11 19:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 1.45, 4.20, 7.50),
  ('USA', 'Switzerland', '2026-06-12 19:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 2.10, 3.30, 3.40),
  ('Argentina', 'Uzbekistan', '2026-06-12 16:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 1.15, 7.00, 15.00),
  ('Senegal', 'Croatia', '2026-06-12 22:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 3.20, 3.40, 2.20),
  ('England', 'Iran', '2026-06-13 16:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 1.35, 4.80, 9.00),
  ('Denmark', 'Serbia', '2026-06-13 22:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 2.00, 3.50, 3.80),
  ('France', 'Tunisia', '2026-06-13 19:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 1.25, 5.50, 12.00),
  ('Netherlands', 'Ukraine', '2026-06-13 13:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 1.55, 4.00, 6.00),
  ('Spain', 'Egypt', '2026-06-14 16:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 1.30, 5.00, 10.00),
  ('Belgium', 'Morocco', '2026-06-14 22:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 1.70, 3.60, 5.00),
  ('Brazil', 'Cameroon', '2026-06-14 19:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 1.20, 6.00, 13.00),
  ('Portugal', 'Ghana', '2026-06-14 13:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 1.40, 4.50, 8.00),
  ('Germany', 'Japan', '2026-06-15 16:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 1.50, 4.20, 6.50),
  ('Poland', 'Ecuador', '2026-06-15 22:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 2.30, 3.30, 3.10),
  ('Italy', 'Saudi Arabia', '2026-06-15 19:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 1.25, 5.50, 12.00),
  ('Uruguay', 'South Korea', '2026-06-15 13:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 1.90, 3.40, 4.00),
  ('Mexico', 'Switzerland', '2026-06-16 22:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 1.65, 3.80, 5.20),
  ('USA', 'New Zealand', '2026-06-16 19:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 1.35, 4.80, 8.50),
  ('Argentina', 'Croatia', '2026-06-17 22:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 1.55, 4.00, 6.00),
  ('Senegal', 'Uzbekistan', '2026-06-17 19:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 1.80, 3.50, 4.50),
  ('England', 'Serbia', '2026-06-17 16:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 1.45, 4.20, 7.00),
  ('Denmark', 'Iran', '2026-06-17 13:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 1.70, 3.60, 5.00),
  ('France', 'Ukraine', '2026-06-18 22:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 1.30, 5.00, 10.00),
  ('Netherlands', 'Tunisia', '2026-06-18 19:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 1.40, 4.50, 7.50),
  ('Spain', 'Morocco', '2026-06-18 16:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 1.50, 4.00, 6.50),
  ('Belgium', 'Egypt', '2026-06-18 13:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 1.60, 3.80, 5.50),
  ('Brazil', 'Ghana', '2026-06-19 22:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 1.15, 7.00, 15.00),
  ('Portugal', 'Cameroon', '2026-06-19 19:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 1.30, 5.00, 10.00),
  ('Germany', 'Ecuador', '2026-06-19 16:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 1.45, 4.20, 7.50),
  ('Poland', 'Japan', '2026-06-19 13:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 2.40, 3.20, 3.00),
  ('Italy', 'South Korea', '2026-06-20 22:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 1.55, 4.00, 6.00),
  ('Uruguay', 'Saudi Arabia', '2026-06-20 19:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 1.45, 4.20, 7.50),
  ('Switzerland', 'New Zealand', '2026-06-21 19:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 1.80, 3.50, 4.50),
  ('Mexico', 'USA', '2026-06-21 22:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 2.20, 3.30, 3.30),
  ('Croatia', 'Uzbekistan', '2026-06-22 19:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 1.35, 4.80, 8.50),
  ('Argentina', 'Senegal', '2026-06-22 22:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 1.45, 4.20, 7.00),
  ('Iran', 'Serbia', '2026-06-22 16:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 2.80, 3.30, 2.50),
  ('England', 'Denmark', '2026-06-22 22:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 1.55, 4.00, 6.00),
  ('Tunisia', 'Ukraine', '2026-06-23 19:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 2.60, 3.20, 2.70),
  ('France', 'Netherlands', '2026-06-23 22:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 1.70, 3.60, 5.00),
  ('Egypt', 'Morocco', '2026-06-23 16:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 2.40, 3.20, 3.00),
  ('Spain', 'Belgium', '2026-06-23 22:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 1.65, 3.80, 5.20),
  ('Cameroon', 'Ghana', '2026-06-24 19:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 2.10, 3.30, 3.50),
  ('Brazil', 'Portugal', '2026-06-24 22:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 1.55, 4.00, 6.00),
  ('Japan', 'Ecuador', '2026-06-24 16:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 2.00, 3.40, 3.80),
  ('Germany', 'Poland', '2026-06-24 22:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 1.50, 4.20, 6.50),
  ('Saudi Arabia', 'South Korea', '2026-06-25 19:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 2.80, 3.30, 2.50),
  ('Italy', 'Uruguay', '2026-06-25 22:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 1.75, 3.50, 4.80),
  ('New Zealand', 'USA', '2026-06-26 19:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 4.50, 3.80, 1.75),
  ('Switzerland', 'Mexico', '2026-06-26 22:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 2.80, 3.30, 2.50),
  ('Uzbekistan', 'Senegal', '2026-06-27 19:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 3.50, 3.40, 2.10),
  ('Croatia', 'Argentina', '2026-06-27 22:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 2.60, 3.30, 2.70);

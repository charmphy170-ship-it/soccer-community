-- CORRECT World Cup 2026 Match Data (48 teams, 12 groups, 104 matches)
-- Based on official FIFA draw and schedule

-- Clear existing matches
DELETE FROM matches;

-- Group Stage Matches (72 matches total)
-- Each team plays 3 matches in their group

-- GROUP A: Mexico, South Korea, South Africa, Czechia
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('Mexico', 'South Africa', '2026-06-11 19:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 1.55, 3.80, 6.50),
  ('South Korea', 'Czechia', '2026-06-11 22:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 2.40, 3.20, 3.00),
  ('South Africa', 'Czechia', '2026-06-18 16:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 3.50, 3.40, 2.10),
  ('Mexico', 'South Korea', '2026-06-18 19:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 1.70, 3.60, 5.00),
  ('South Korea', 'South Africa', '2026-06-24 19:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 1.85, 3.50, 4.20),
  ('Czechia', 'Mexico', '2026-06-24 22:00:00+00', 'World Cup 2026 - Group A', 'upcoming', 2.80, 3.30, 2.50);

-- GROUP B: Canada, Bosnia and Herzegovina, Switzerland, Qatar
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('Canada', 'Bosnia and Herzegovina', '2026-06-12 16:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 1.80, 3.50, 4.50),
  ('Switzerland', 'Qatar', '2026-06-12 19:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 1.45, 4.20, 7.50),
  ('Bosnia and Herzegovina', 'Qatar', '2026-06-18 13:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 2.20, 3.30, 3.30),
  ('Canada', 'Switzerland', '2026-06-18 16:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 2.10, 3.30, 3.50),
  ('Switzerland', 'Bosnia and Herzegovina', '2026-06-24 16:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 1.60, 3.80, 5.50),
  ('Qatar', 'Canada', '2026-06-24 19:00:00+00', 'World Cup 2026 - Group B', 'upcoming', 3.20, 3.40, 2.20);

-- GROUP C: Brazil, Scotland, Morocco, Haiti
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('Brazil', 'Scotland', '2026-06-13 16:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 1.35, 4.80, 8.50),
  ('Morocco', 'Haiti', '2026-06-13 19:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 1.55, 4.00, 6.00),
  ('Scotland', 'Haiti', '2026-06-19 13:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 1.70, 3.60, 5.00),
  ('Brazil', 'Morocco', '2026-06-19 16:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 1.45, 4.20, 7.00),
  ('Morocco', 'Scotland', '2026-06-25 16:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 2.10, 3.30, 3.50),
  ('Haiti', 'Brazil', '2026-06-25 19:00:00+00', 'World Cup 2026 - Group C', 'upcoming', 6.50, 4.50, 1.45);

-- GROUP D: USA, Paraguay, Australia, Türkiye
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('USA', 'Paraguay', '2026-06-13 19:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 1.90, 3.40, 4.00),
  ('Australia', 'Türkiye', '2026-06-13 22:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 2.60, 3.30, 2.70),
  ('Paraguay', 'Türkiye', '2026-06-19 16:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 2.40, 3.20, 3.00),
  ('USA', 'Australia', '2026-06-19 19:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 1.75, 3.50, 4.80),
  ('Australia', 'Paraguay', '2026-06-25 19:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 2.20, 3.30, 3.30),
  ('Türkiye', 'USA', '2026-06-25 22:00:00+00', 'World Cup 2026 - Group D', 'upcoming', 2.30, 3.30, 3.10);

-- GROUP E: Germany, Curaçao, Ecuador, Ivory Coast
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('Germany', 'Curaçao', '2026-06-14 16:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 1.15, 7.00, 15.00),
  ('Ecuador', 'Ivory Coast', '2026-06-14 19:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 2.00, 3.40, 3.80),
  ('Curaçao', 'Ivory Coast', '2026-06-20 13:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 3.50, 3.40, 2.10),
  ('Germany', 'Ecuador', '2026-06-20 16:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 1.50, 4.20, 6.50),
  ('Ecuador', 'Curaçao', '2026-06-26 16:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 1.45, 4.20, 7.50),
  ('Ivory Coast', 'Germany', '2026-06-26 19:00:00+00', 'World Cup 2026 - Group E', 'upcoming', 5.50, 4.50, 1.55);

-- GROUP F: Netherlands, Tunisia, Japan, Sweden
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('Netherlands', 'Japan', '2026-06-14 19:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 1.60, 3.80, 5.50),
  ('Tunisia', 'Sweden', '2026-06-14 22:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 2.80, 3.30, 2.50),
  ('Japan', 'Sweden', '2026-06-20 16:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 2.10, 3.30, 3.50),
  ('Netherlands', 'Tunisia', '2026-06-20 19:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 1.40, 4.50, 7.50),
  ('Tunisia', 'Japan', '2026-06-26 19:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 2.60, 3.20, 2.70),
  ('Sweden', 'Netherlands', '2026-06-26 22:00:00+00', 'World Cup 2026 - Group F', 'upcoming', 3.20, 3.40, 2.20);

-- GROUP G: Belgium, New Zealand, Iran, Egypt
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('Belgium', 'New Zealand', '2026-06-15 16:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 1.35, 4.80, 9.00),
  ('Iran', 'Egypt', '2026-06-15 19:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 2.30, 3.30, 3.10),
  ('New Zealand', 'Egypt', '2026-06-21 13:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 2.80, 3.30, 2.50),
  ('Belgium', 'Iran', '2026-06-21 16:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 1.55, 4.00, 6.00),
  ('Iran', 'New Zealand', '2026-06-27 16:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 1.90, 3.40, 4.00),
  ('Egypt', 'Belgium', '2026-06-27 19:00:00+00', 'World Cup 2026 - Group G', 'upcoming', 3.50, 3.40, 2.10);

-- GROUP H: Spain, Cabo Verde, Uruguay, Saudi Arabia
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('Spain', 'Cabo Verde', '2026-06-15 19:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 1.25, 5.50, 12.00),
  ('Uruguay', 'Saudi Arabia', '2026-06-15 22:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 1.70, 3.60, 5.00),
  ('Cabo Verde', 'Saudi Arabia', '2026-06-21 16:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 2.40, 3.20, 3.00),
  ('Spain', 'Uruguay', '2026-06-21 19:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 1.55, 4.00, 6.00),
  ('Uruguay', 'Cabo Verde', '2026-06-27 19:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 1.45, 4.20, 7.50),
  ('Saudi Arabia', 'Spain', '2026-06-27 22:00:00+00', 'World Cup 2026 - Group H', 'upcoming', 5.50, 4.50, 1.55);

-- GROUP I: France, Iraq, Norway, Senegal
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('France', 'Iraq', '2026-06-16 16:00:00+00', 'World Cup 2026 - Group I', 'upcoming', 1.15, 7.00, 15.00),
  ('Norway', 'Senegal', '2026-06-16 19:00:00+00', 'World Cup 2026 - Group I', 'upcoming', 2.10, 3.30, 3.50),
  ('Iraq', 'Senegal', '2026-06-22 13:00:00+00', 'World Cup 2026 - Group I', 'upcoming', 2.80, 3.30, 2.50),
  ('France', 'Norway', '2026-06-22 16:00:00+00', 'World Cup 2026 - Group I', 'upcoming', 1.45, 4.20, 7.00),
  ('Norway', 'Iraq', '2026-06-28 16:00:00+00', 'World Cup 2026 - Group I', 'upcoming', 1.70, 3.60, 5.00),
  ('Senegal', 'France', '2026-06-28 19:00:00+00', 'World Cup 2026 - Group I', 'upcoming', 5.00, 4.00, 1.60);

-- GROUP J: Argentina, Algeria, Austria, Jordan
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('Argentina', 'Algeria', '2026-06-16 19:00:00+00', 'World Cup 2026 - Group J', 'upcoming', 1.30, 5.00, 10.00),
  ('Austria', 'Jordan', '2026-06-16 22:00:00+00', 'World Cup 2026 - Group J', 'upcoming', 1.55, 4.00, 6.00),
  ('Algeria', 'Jordan', '2026-06-22 16:00:00+00', 'World Cup 2026 - Group J', 'upcoming', 1.80, 3.50, 4.50),
  ('Argentina', 'Austria', '2026-06-22 19:00:00+00', 'World Cup 2026 - Group J', 'upcoming', 1.50, 4.20, 6.50),
  ('Austria', 'Algeria', '2026-06-28 19:00:00+00', 'World Cup 2026 - Group J', 'upcoming', 1.90, 3.40, 4.00),
  ('Jordan', 'Argentina', '2026-06-28 22:00:00+00', 'World Cup 2026 - Group J', 'upcoming', 6.00, 4.50, 1.50);

-- GROUP K: Portugal, DR Congo, Uzbekistan, Colombia
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('Portugal', 'DR Congo', '2026-06-17 16:00:00+00', 'World Cup 2026 - Group K', 'upcoming', 1.30, 5.00, 10.00),
  ('Uzbekistan', 'Colombia', '2026-06-17 19:00:00+00', 'World Cup 2026 - Group K', 'upcoming', 2.60, 3.30, 2.70),
  ('DR Congo', 'Colombia', '2026-06-23 13:00:00+00', 'World Cup 2026 - Group K', 'upcoming', 2.40, 3.20, 3.00),
  ('Portugal', 'Uzbekistan', '2026-06-23 16:00:00+00', 'World Cup 2026 - Group K', 'upcoming', 1.35, 4.80, 9.00),
  ('Uzbekistan', 'DR Congo', '2026-06-27 16:00:00+00', 'World Cup 2026 - Group K', 'upcoming', 2.10, 3.30, 3.50),
  ('Colombia', 'Portugal', '2026-06-27 19:00:00+00', 'World Cup 2026 - Group K', 'upcoming', 2.80, 3.30, 2.50);

-- GROUP L: England, Croatia, Ghana, Panama
INSERT INTO matches (home_team, away_team, match_time, league, status, home_odds, draw_odds, away_odds) VALUES
  ('England', 'Croatia', '2026-06-17 19:00:00+00', 'World Cup 2026 - Group L', 'upcoming', 1.70, 3.60, 5.00),
  ('Ghana', 'Panama', '2026-06-17 22:00:00+00', 'World Cup 2026 - Group L', 'upcoming', 1.80, 3.50, 4.50),
  ('Croatia', 'Panama', '2026-06-23 16:00:00+00', 'World Cup 2026 - Group L', 'upcoming', 1.55, 4.00, 6.00),
  ('England', 'Ghana', '2026-06-23 19:00:00+00', 'World Cup 2026 - Group L', 'upcoming', 1.45, 4.20, 7.00),
  ('Ghana', 'Croatia', '2026-06-27 19:00:00+00', 'World Cup 2026 - Group L', 'upcoming', 2.40, 3.20, 3.00),
  ('Panama', 'England', '2026-06-27 22:00:00+00', 'World Cup 2026 - Group L', 'upcoming', 4.50, 3.80, 1.75);

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  wins: number;
  losses: number;
  created_at: string;
}

export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  match_time: string;
  league: string;
  status: string;
  home_odds: number | null;
  draw_odds: number | null;
  away_odds: number | null;
}

export interface Prediction {
  id: string;
  user_id: string;
  match_id: string;
  pick: string;
  reasoning: string | null;
  result: string;
  created_at: string;
  user?: any;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at: string;
  read_at: string | null;
  sender?: any;
}

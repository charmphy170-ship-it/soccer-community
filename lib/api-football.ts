const BASE_URL = 'https://worldcup26.ir';

async function fetchAPI(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error ${res.status}: ${err}`);
  }

  return res.json();
}

// Get all World Cup 2026 matches
export async function getWorldCupMatches() {
  try {
    const data = await fetchAPI('/get/games');
    return data || [];
  } catch (err) {
    console.error('Failed to fetch World Cup matches:', err);
    return [];
  }
}

// Get group standings
export async function getGroupStandings() {
  try {
    const data = await fetchAPI('/get/groups');
    return data || [];
  } catch (err) {
    console.error('Failed to fetch groups:', err);
    return [];
  }
}

// Get all teams
export async function getTeams() {
  try {
    const data = await fetchAPI('/get/teams');
    return data || [];
  } catch (err) {
    console.error('Failed to fetch teams:', err);
    return [];
  }
}

// Transform API match to our format
export function transformMatch(apiMatch: any) {
  // Determine status based on match data
  let status = 'upcoming';
  if (apiMatch.score_home !== null && apiMatch.score_away !== null) {
    status = 'finished';
  } else if (apiMatch.is_live) {
    status = 'live';
  }

  return {
    id: apiMatch.id?.toString() || Math.random().toString(36).substr(2, 9),
    home_team: apiMatch.team_home || apiMatch.home_team || 'Unknown',
    away_team: apiMatch.team_away || apiMatch.away_team || 'Unknown',
    match_time: apiMatch.match_date || apiMatch.date || new Date().toISOString(),
    league: `World Cup 2026 - ${apiMatch.group || 'Group Stage'}`,
    status,
    home_odds: null,
    draw_odds: null,
    away_odds: null,
    home_score: apiMatch.score_home,
    away_score: apiMatch.score_away,
  };
}

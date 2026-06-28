import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getLiveMatches, getUpcomingMatches, transformMatch } from '@/lib/api-football';

// This route can be called by a cron job or manually to sync matches
export async function GET(request: NextRequest) {
  try {
    const secret = request.headers.get('x-sync-secret');
    if (secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch live and upcoming matches
    const [liveMatches, upcomingMatches] = await Promise.all([
      getLiveMatches().catch(() => []),
      getUpcomingMatches().catch(() => []),
    ]);

    const allMatches = [...liveMatches, ...upcomingMatches];
    const transformed = allMatches.map(transformMatch);

    // Upsert to database
    for (const match of transformed) {
      await supabase.from('matches').upsert({
        id: match.id,
        home_team: match.home_team,
        away_team: match.away_team,
        match_time: match.match_time,
        league: match.league,
        status: match.status,
        home_score: match.home_score,
        away_score: match.away_score,
      }, { onConflict: 'id' });
    }

    return NextResponse.json({ 
      success: true, 
      synced: transformed.length,
      live: liveMatches.length,
      upcoming: upcomingMatches.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

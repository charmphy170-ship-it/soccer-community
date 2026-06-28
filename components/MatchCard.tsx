import Link from 'next/link';

interface MatchCardProps {
  match: any;
}

export function MatchCard({ match }: MatchCardProps) {
  const matchTime = new Date(match.match_time);
  const isLive = match.status === 'live';
  const isPast = match.status === 'finished';
  const now = new Date();
  const isToday = matchTime.toDateString() === now.toDateString();
  const isTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString() === matchTime.toDateString();

  const timeStr = matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = matchTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const dayName = matchTime.toLocaleDateString([], { weekday: 'short' });

  // Calculate time until match
  const timeDiff = matchTime.getTime() - now.getTime();
  const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
  const daysUntil = Math.floor(hoursUntil / 24);

  let timeUntilText = '';
  if (!isPast && !isLive && timeDiff > 0) {
    if (daysUntil > 0) {
      timeUntilText = `in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`;
    } else if (hoursUntil > 0) {
      timeUntilText = `in ${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}`;
    } else {
      timeUntilText = 'starting soon';
    }
  }

  return (
    <Link href={`/match/${match.id}`}>
      <div className="bg-card rounded-xl p-4 border border-slate-700 hover:border-secondary transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400 font-medium">{match.league}</span>
          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-medium animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                LIVE
              </span>
            ) : isPast ? (
              <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded-full">Finished</span>
            ) : isToday ? (
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full font-medium">
                TODAY {timeStr}
              </span>
            ) : isTomorrow ? (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-medium">
                TOMORROW {timeStr}
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                {dayName} {dateStr} • {timeStr}
              </span>
            )}
            {timeUntilText && (
              <span className="text-xs text-slate-500">({timeUntilText})</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-lg font-bold text-white">{match.home_team}</div>
            {match.home_score !== undefined && match.home_score !== null && (
              <div className="text-2xl font-bold text-accent">{match.home_score}</div>
            )}
          </div>

          <div className="px-4 flex flex-col items-center">
            <div className="text-2xl font-bold text-accent">VS</div>
            {match.home_odds && (
              <div className="text-xs text-slate-500 mt-1">
                1:{match.home_odds} X:{match.draw_odds} 2:{match.away_odds}
              </div>
            )}
          </div>

          <div className="flex-1 text-right">
            <div className="text-lg font-bold text-white">{match.away_team}</div>
            {match.away_score !== undefined && match.away_score !== null && (
              <div className="text-2xl font-bold text-accent">{match.away_score}</div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {isLive ? '🔴 Match in progress - Click to predict!' : 'Tap to predict & chat'}
          </span>
          <span className="text-xs text-secondary font-medium">→</span>
        </div>
      </div>
    </Link>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { getMatches, getCurrentUser } from '@/lib/supabase';
import { MatchCard } from '@/components/MatchCard';
import Link from 'next/link';
import { RefreshCw, Calendar, AlertCircle } from 'lucide-react';

export default function FeedPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');
  const [lastUpdated, setLastUpdated] = useState('');

  const loadMatches = useCallback(async () => {
    setLoading(true);

    try {
      const allMatches = await getMatches();

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      const processedMatches = (allMatches || []).map((match: any) => {
        const matchDate = new Date(match.match_time).toISOString().split('T')[0];
        const matchDateObj = new Date(match.match_time);
        return {
          ...match,
          matchDate,
          isToday: matchDate === todayStr,
          isPast: matchDateObj < now && matchDate !== todayStr,
          isFuture: matchDateObj > now || (matchDate === todayStr && matchDateObj > now),
        };
      });

      setMatches(processedMatches);
      setLastUpdated(new Date().toLocaleTimeString());

      const userData = await getCurrentUser().catch(() => null);
      setUser(userData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 60 * 1000);
    return () => clearInterval(interval);
  }, [loadMatches]);

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Filter matches
  const filtered = matches.filter((m: any) => {
    if (filter === 'today') return m.isToday;
    if (filter === 'tomorrow') return m.matchDate === tomorrowStr;
    if (filter === 'upcoming') return m.isFuture && !m.isToday && m.matchDate !== tomorrowStr;
    if (filter === 'live') return m.status === 'live';
    if (filter === 'finished') return m.status === 'finished' || m.isPast;
    return true;
  });

  // Sort: Live first, then by time
  const sorted = filtered.sort((a: any, b: any) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (b.status === 'live' && a.status !== 'live') return 1;
    return new Date(a.match_time).getTime() - new Date(b.match_time).getTime();
  });

  // Count matches per tab
  const counts = {
    today: matches.filter((m: any) => m.isToday).length,
    tomorrow: matches.filter((m: any) => m.matchDate === tomorrowStr).length,
    upcoming: matches.filter((m: any) => m.isFuture && !m.isToday && m.matchDate !== tomorrowStr).length,
    live: matches.filter((m: any) => m.status === 'live').length,
    all: matches.length,
  };

  if (loading && matches.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">⚽ World Cup 2026</h1>
          <p className="text-xs text-slate-500 mt-1">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            {lastUpdated && ` • Updated: ${lastUpdated}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadMatches}
            disabled={loading}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Refresh matches"
          >
            <RefreshCw size={18} className={`text-accent ${loading ? 'animate-spin' : ''}`} />
          </button>
          {!user && (
            <Link href="/login" className="text-sm text-accent hover:underline">Login to predict</Link>
          )}
        </div>
      </div>

      {/* Date filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'today', label: 'Today' },
          { key: 'tomorrow', label: 'Tomorrow' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'live', label: 'Live' },
          { key: 'all', label: 'All' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.key ? 'bg-secondary text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
            {counts[tab.key as keyof typeof counts] > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                filter === tab.key ? 'bg-white text-secondary' : 'bg-slate-700 text-slate-300'
              }`}>
                {counts[tab.key as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-lg text-slate-400 mb-2">
              No matches {filter === 'today' ? 'today' : filter === 'tomorrow' ? 'tomorrow' : filter === 'live' ? 'currently live' : filter === 'upcoming' ? 'upcoming' : ''}
            </p>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {filter === 'today' && 'The World Cup 2026 group stage has ended. Check "All" to see past matches or wait for knockout rounds!'}
              {filter === 'tomorrow' && 'No matches scheduled for tomorrow. Check "Upcoming" or "All" tabs.'}
              {filter === 'upcoming' && 'No upcoming matches in the database. The tournament may have ended or data needs updating.'}
              {filter === 'live' && 'No matches are currently live. Check "Today" or "All" tabs.'}
              {filter === 'all' && 'No matches found in the database. Run the SQL seed script in Supabase.'}
            </p>
            {filter !== 'all' && (
              <button 
                onClick={() => setFilter('all')}
                className="mt-4 text-accent hover:underline text-sm"
              >
                View all matches →
              </button>
            )}
          </div>
        ) : (
          <>
            {filter === 'today' && counts.today > 0 && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 mb-4">
                <p className="text-accent text-sm font-medium text-center">
                  🏆 {counts.today} match{counts.today !== 1 ? 'es' : ''} today!
                </p>
              </div>
            )}
            {sorted.map((match: any) => <MatchCard key={match.id} match={match} />)}
          </>
        )}
      </div>
    </div>
  );
}

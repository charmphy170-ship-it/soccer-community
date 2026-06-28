'use client';

import { useEffect, useState, useCallback } from 'react';
import { getMatches, getCurrentUser } from '@/lib/supabase';
import { MatchCard } from '@/components/MatchCard';
import Link from 'next/link';
import { RefreshCw, Calendar } from 'lucide-react';

export default function FeedPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today'); // Default to TODAY
  const [lastUpdated, setLastUpdated] = useState('');

  const loadMatches = useCallback(async () => {
    setLoading(true);

    try {
      // Get all matches from database
      const allMatches = await getMatches();

      // Add today's date to each match for filtering
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      const processedMatches = (allMatches || []).map((match: any) => {
        const matchDate = new Date(match.match_time).toISOString().split('T')[0];
        return {
          ...match,
          matchDate,
          isToday: matchDate === todayStr,
          isPast: new Date(match.match_time) < now,
          isFuture: new Date(match.match_time) > now,
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

    // Auto-refresh every minute to catch live matches
    const interval = setInterval(loadMatches, 60 * 1000);
    return () => clearInterval(interval);
  }, [loadMatches]);

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Filter matches based on selected tab
  const filtered = matches.filter((m: any) => {
    if (filter === 'today') return m.isToday;
    if (filter === 'tomorrow') return m.matchDate === tomorrowStr;
    if (filter === 'upcoming') return m.isFuture && !m.isToday && m.matchDate !== tomorrowStr;
    if (filter === 'live') return m.status === 'live';
    if (filter === 'finished') return m.status === 'finished';
    return true; // 'all'
  });

  // Sort: Live first, then by time
  const sorted = filtered.sort((a: any, b: any) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (b.status === 'live' && a.status !== 'live') return 1;
    return new Date(a.match_time).getTime() - new Date(b.match_time).getTime();
  });

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
          { key: 'today', label: 'Today', icon: Calendar },
          { key: 'tomorrow', label: 'Tomorrow', icon: Calendar },
          { key: 'upcoming', label: 'Upcoming', icon: Calendar },
          { key: 'live', label: 'Live', icon: RefreshCw },
          { key: 'all', label: 'All', icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.key ? 'bg-secondary text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.key === 'today' && matches.filter((m: any) => m.isToday).length > 0 && (
              <span className="bg-accent text-dark text-xs font-bold px-1.5 py-0.5 rounded-full">
                {matches.filter((m: any) => m.isToday).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            <p className="text-lg mb-2">No matches {filter === 'today' ? 'today' : filter}</p>
            <p className="text-sm">Check back later or view upcoming matches!</p>
          </div>
        ) : (
          <>
            {filter === 'today' && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 mb-4">
                <p className="text-accent text-sm font-medium text-center">
                  🏆 {sorted.length} match{sorted.length !== 1 ? 'es' : ''} today!
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

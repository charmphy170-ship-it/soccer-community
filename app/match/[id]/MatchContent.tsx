'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMatch, getPredictionsForMatch, getCurrentUser, createPrediction } from '@/lib/supabase';
import { PredictionCard } from '@/components/PredictionCard';
import Link from 'next/link';

export default function MatchContent() {
  const params = useParams();
  const matchId = params.id as string;
  const [match, setMatch] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pick, setPick] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [matchData, predsData, userData] = await Promise.all([
          getMatch(matchId),
          getPredictionsForMatch(matchId),
          getCurrentUser().catch(() => null)
        ]);
        setMatch(matchData);
        setPredictions(predsData || []);
        setUser(userData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [matchId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await createPrediction({ user_id: user.id, match_id: matchId, pick, reasoning: reasoning || null });
      const preds = await getPredictionsForMatch(matchId);
      setPredictions(preds || []);
      setPick('');
      setReasoning('');
    } catch (err) {
      alert('Failed to post prediction');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!match) return <div className="text-center py-12">Match not found</div>;

  const matchTime = new Date(match.match_time).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div>
      <Link href="/feed" className="text-slate-400 hover:text-white text-sm mb-4 inline-block">← Back to Feed</Link>

      <div className="bg-card rounded-2xl p-6 mb-6 border border-slate-700">
        <div className="text-center text-slate-400 text-sm mb-4">{match.league} • {matchTime}</div>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-white">{match.home_team}</div>
          </div>
          <div className="px-4">
            <div className="text-3xl font-bold text-accent">VS</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-white">{match.away_team}</div>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="bg-slate-800 px-4 py-2 rounded-lg"><span className="text-slate-400">1 </span><span className="text-accent font-bold">{match.home_odds || '-'}</span></div>
          <div className="bg-slate-800 px-4 py-2 rounded-lg"><span className="text-slate-400">X </span><span className="text-accent font-bold">{match.draw_odds || '-'}</span></div>
          <div className="bg-slate-800 px-4 py-2 rounded-lg"><span className="text-slate-400">2 </span><span className="text-accent font-bold">{match.away_odds || '-'}</span></div>
        </div>
      </div>

      {user ? (
        <div className="bg-card rounded-2xl p-6 mb-6 border border-slate-700">
          <h2 className="text-lg font-bold text-white mb-4">Make Your Prediction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Your Pick</label>
              <select required value={pick} onChange={(e) => setPick(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-white">
                <option value="">Select outcome...</option>
                <option value="Home Win">Home Win (1)</option>
                <option value="Draw">Draw (X)</option>
                <option value="Away Win">Away Win (2)</option>
                <option value="Over 2.5">Over 2.5 Goals</option>
                <option value="Under 2.5">Under 2.5 Goals</option>
                <option value="BTTS Yes">Both Teams To Score - Yes</option>
                <option value="BTTS No">Both Teams To Score - No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Reasoning (optional)</label>
              <textarea value={reasoning} onChange={(e) => setReasoning(e.target.value)} rows={3}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-white resize-none"
                placeholder="Why do you think this will happen?" />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-secondary hover:bg-primary text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
              {submitting ? 'Posting...' : 'Post Prediction'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-6 mb-6 border border-slate-700 text-center">
          <p className="text-slate-400 mb-4">Login to make predictions</p>
          <Link href="/login" className="inline-block bg-secondary hover:bg-primary text-white font-semibold px-6 py-2 rounded-lg transition-colors">Login</Link>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-white mb-4">Predictions ({predictions.length})</h2>
        <div className="space-y-4">
          {predictions.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No predictions yet. Be the first!</div>
          ) : (
            predictions.map((pred: any) => <PredictionCard key={pred.id} prediction={pred} />)
          )}
        </div>
      </div>
    </div>
  );
}

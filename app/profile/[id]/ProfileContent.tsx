'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase, getCurrentUser } from '@/lib/supabase';
import Link from 'next/link';

export default function ProfileContent() {
  const params = useParams();
  const profileId = params.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [profileData, userData] = await Promise.all([
          supabase.from('users').select('*').eq('id', profileId).single().then((r: any) => r.data),
          getCurrentUser().catch(() => null)
        ]);
        setProfile(profileData);
        setCurrentUser(userData);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    load();
  }, [profileId]);

  const totalPredictions = (profile?.wins || 0) + (profile?.losses || 0);
  const winRate = totalPredictions > 0 ? Math.round((profile?.wins || 0) / totalPredictions * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!profile) return <div className="text-center py-12">User not found</div>;

  const isMe = currentUser?.id === profile.id;

  return (
    <div className="max-w-md mx-auto">
      <Link href="/feed" className="text-slate-400 hover:text-white text-sm mb-4 inline-block">← Back to Feed</Link>
      <div className="bg-card rounded-2xl p-8 border border-slate-700 text-center">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">{profile.username[0].toUpperCase()}</div>
        <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
        <p className="text-slate-400 text-sm mt-1">Member since {new Date(profile.created_at).toLocaleDateString()}</p>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-800 rounded-xl p-4"><div className="text-2xl font-bold text-accent">{profile.wins}</div><div className="text-xs text-slate-400">Wins</div></div>
          <div className="bg-slate-800 rounded-xl p-4"><div className="text-2xl font-bold text-red-400">{profile.losses}</div><div className="text-xs text-slate-400">Losses</div></div>
          <div className="bg-slate-800 rounded-xl p-4"><div className="text-2xl font-bold text-white">{winRate}%</div><div className="text-xs text-slate-400">Win Rate</div></div>
        </div>

        {!isMe && currentUser && (
          <Link href={`/chat/${profile.id}`} className="mt-6 block w-full bg-secondary hover:bg-primary text-white font-semibold py-3 rounded-lg transition-colors">Message {profile.username}</Link>
        )}
        {!currentUser && (
          <Link href="/login" className="mt-6 block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors">Login to Message</Link>
        )}
      </div>
    </div>
  );
}

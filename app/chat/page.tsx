'use client';

import { useEffect, useState } from 'react';
import { getConversations, getCurrentUser } from '@/lib/supabase';
import Link from 'next/link';

export default function ChatListPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const currentUser = await getCurrentUser().catch(() => null);
      if (!currentUser) { setLoading(false); return; }
      setUser(currentUser);
      const convos = await getConversations(currentUser.id);
      setConversations(convos || []);
      setLoading(false);
    }
    load();
  }, []);

  if (!user && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Login to access chat</p>
        <Link href="/login" className="bg-secondary hover:bg-primary text-white font-semibold px-6 py-2 rounded-lg transition-colors">Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>
      <div className="space-y-3">
        {conversations.length === 0 ? (
          <div className="text-center text-slate-500 py-12">No conversations yet. Start chatting from a user's profile!</div>
        ) : (
          conversations.map((convo: any) => (
            <Link key={convo.user.id} href={`/chat/${convo.user.id}`}
              className="flex items-center gap-4 bg-card p-4 rounded-xl border border-slate-700 hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg">{convo.user.username[0].toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white truncate">{convo.user.username}</h3>
                  <span className="text-xs text-slate-500">{new Date(convo.last_message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm text-slate-400 truncate mt-1">{convo.last_message.content}</p>
              </div>
              {convo.unread_count > 0 && (
                <div className="bg-accent text-dark text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">{convo.unread_count}</div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getMessages, getCurrentUser, sendMessage, markAsRead, supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ChatContent() {
  const params = useParams();
  const partnerId = params.id as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const currentUser = await getCurrentUser().catch(() => null);
      if (!currentUser) { setLoading(false); return; }
      setUser(currentUser);
      const msgs = await getMessages(currentUser.id, partnerId);
      setMessages(msgs || []);
      if (msgs.length > 0) {
        const partnerData = msgs[0].sender_id === currentUser.id ? null : msgs[0].sender;
        if (partnerData) setPartner(partnerData);
      }
      const unreadIds = msgs.filter((m: any) => m.receiver_id === currentUser.id && !m.read_at).map((m: any) => m.id);
      if (unreadIds.length > 0) await markAsRead(unreadIds);
      setLoading(false);
    }
    load();
  }, [partnerId]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'receiver_id=eq.' + user.id },
        (payload: any) => {
          const newMsg = payload.new;
          if (newMsg.sender_id === partnerId) { setMessages((prev: any[]) => [...prev, newMsg]); markAsRead([newMsg.id]); }
        }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, partnerId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    const content = newMessage.trim();
    setNewMessage('');
    try {
      const sent = await sendMessage(user.id, partnerId, content);
      setMessages((prev: any[]) => [...prev, sent]);
    } catch (err) { alert('Failed to send message'); }
  }

  if (!user && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Login to chat</p>
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
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
        <Link href="/chat" className="text-slate-400 hover:text-white">←</Link>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold">{partner?.username?.[0]?.toUpperCase() || '?'}</div>
        <div>
          <h2 className="font-semibold text-white">{partner?.username || 'User'}</h2>
          <p className="text-xs text-slate-400">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 py-12">No messages yet. Say hello!</div>
        ) : (
          messages.map((msg: any) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-secondary text-white rounded-br-md' : 'bg-slate-700 text-slate-200 rounded-bl-md'}`}>
                  {msg.content}
                  <div className={`text-[10px] mt-1 ${isMe ? 'text-green-200' : 'text-slate-400'}`}>
                    {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..."
          className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-white" />
        <button type="submit" className="bg-secondary hover:bg-primary text-white px-6 py-3 rounded-xl font-semibold transition-colors">Send</button>
      </form>
    </div>
  );
}

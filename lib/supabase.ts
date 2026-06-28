import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { username } }
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  // Try getSession first (more reliable for client-side)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();
  return data;
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (user: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();
      callback(data);
    } else {
      callback(null);
    }
  });
  return subscription;
}

export async function getMatches(status?: string) {
  let query = supabase.from('matches').select('*').order('match_time', { ascending: true });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getMatch(id: string) {
  const { data, error } = await supabase.from('matches').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getPredictionsForMatch(matchId: string) {
  const { data, error } = await supabase
    .from('predictions')
    .select('*, user:users(id, username, avatar, wins, losses)')
    .eq('match_id', matchId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createPrediction(prediction: any) {
  const { data, error } = await supabase.from('predictions').insert(prediction).select().single();
  if (error) throw error;
  return data;
}

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users!sender_id(*), receiver:users!receiver_id(*)')
    .or('sender_id.eq.' + userId + ',receiver_id.eq.' + userId)
    .order('sent_at', { ascending: false });
  if (error) throw error;
  const conversations = new Map();
  data?.forEach((msg: any) => {
    const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
    const partner = msg.sender_id === userId ? msg.receiver : msg.sender;
    if (!conversations.has(partnerId)) {
      conversations.set(partnerId, {
        user: partner,
        last_message: msg,
        unread_count: msg.receiver_id === userId && !msg.read_at ? 1 : 0
      });
    } else if (msg.receiver_id === userId && !msg.read_at) {
      conversations.get(partnerId).unread_count++;
    }
  });
  return Array.from(conversations.values());
}

export async function getMessages(userId: string, partnerId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users!sender_id(*)')
    .or('and(sender_id.eq.' + userId + ',receiver_id.eq.' + partnerId + '),and(sender_id.eq.' + partnerId + ',receiver_id.eq.' + userId + ')')
    .order('sent_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const { data, error } = await supabase.from('messages').insert({ sender_id: senderId, receiver_id: receiverId, content }).select().single();
  if (error) throw error;
  return data;
}

export async function markAsRead(messageIds: string[]) {
  await supabase.from('messages').update({ read_at: new Date().toISOString() }).in('id', messageIds);
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/supabase';
import { Home, MessageCircle, User as UserIcon, LogOut } from 'lucide-react';

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, [pathname]);

  async function handleLogout() {
    await signOut();
    setUser(null);
    window.location.href = '/login';
  }

  const navItems = [
    { href: '/feed', label: 'Feed', icon: Home },
    { href: '/chat', label: 'Chat', icon: MessageCircle },
  ];

  return (
    <>
      <nav className="bg-card/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/feed" className="text-xl font-bold text-accent">⚽ SoccerHub</Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href={`/profile/${user.id}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm">{user.username[0].toUpperCase()}</div>
                  <span className="hidden sm:inline">{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors" title="Logout"><LogOut size={20} /></button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Login</Link>
                <Link href="/signup" className="text-sm bg-secondary hover:bg-primary text-white px-4 py-2 rounded-lg transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-slate-700 md:hidden z-50">
        <div className="max-w-4xl mx-auto flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${isActive ? 'text-accent' : 'text-slate-400'}`}>
                <item.icon size={20} /><span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
          {user && (
            <Link href={`/profile/${user.id}`} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${pathname.startsWith('/profile') ? 'text-accent' : 'text-slate-400'}`}>
              <UserIcon size={20} /><span className="text-xs">Profile</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

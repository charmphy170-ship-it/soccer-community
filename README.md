# ⚽ SoccerHub - World Cup 2026

A soccer prediction community with live World Cup 2026 fixtures.

## Features
- Auth (email/password)
- World Cup 2026 match feed (48 group stage matches)
- Predictions with reasoning
- Real-time chat
- Tipster profiles with win/loss stats

## Quick Start

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Copy Project URL and Anon Key from Settings → API
3. In Supabase SQL Editor, run `database/schema.sql`
4. Set environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy on Vercel

## Tech Stack
- Next.js 14 + TypeScript + Tailwind CSS
- Supabase (Auth + PostgreSQL + Realtime)

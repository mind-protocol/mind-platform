import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';
const DEFAULT_USER_ID = '1864364329'; // Nicolas

// Simple in-memory cache (5s TTL)
let cachedData: { data: unknown; ts: number } | null = null;
const CACHE_TTL_MS = 5000;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedData && (now - cachedData.ts) < CACHE_TTL_MS) {
      return NextResponse.json(cachedData.data);
    }

    const res = await fetch(
      `${MANEMUS_URL}/spotify/now-playing-enriched/${DEFAULT_USER_ID}`,
      {
        cache: 'no-store',
        headers: { 'ngrok-skip-browser-warning': '1' },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ is_playing: false }, { status: 200 });
    }

    const data = await res.json();
    cachedData = { data, ts: now };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ is_playing: false }, { status: 200 });
  }
}

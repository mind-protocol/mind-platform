import { NextResponse } from 'next/server';
import { mindFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

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

    const res = await mindFetch(
      `/spotify/now-playing-enriched/${DEFAULT_USER_ID}`,
      { timeoutMs: 8000 }
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

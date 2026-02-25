import { NextResponse } from 'next/server';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5_000; // 5s cache for near-real-time

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const { data } = await manemusFetchJson('/house/state', {
      cache: 'no-store',
      timeoutMs: 8_000,
    });
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      ts: new Date().toISOString(),
      rooms: [],
      hallway: [],
      neon: {},
      ceiling: {},
      streets: { citizen_count: 0, garmin_linked: 0, recent: [] },
      meta: { room_count: 0, hallway_events: 0, has_neon: false, has_music: false },
      offline: true,
    });
  }
}

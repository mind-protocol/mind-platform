import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5_000; // 5s cache for near-real-time

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(`${MANEMUS_URL}/house/state`, {
      cache: 'no-store',
      headers: { 'ngrok-skip-browser-warning': '1' },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
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

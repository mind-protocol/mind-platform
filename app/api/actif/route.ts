import { NextResponse } from 'next/server';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 10_000; // 10s cache — biometrics don't change faster

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(`${MANEMUS_URL}/actif/state`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      ts: new Date().toISOString(),
      biometrics: {},
      workouts: [],
      activity: {},
      offline: true,
    });
  }
}

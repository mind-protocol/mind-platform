import { NextResponse } from 'next/server';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 10_000; // 10s cache — biometrics don't change faster

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const { data } = await manemusFetchJson('/actif/state', {
      cache: 'no-store',
      timeoutMs: 8_000,
    });
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

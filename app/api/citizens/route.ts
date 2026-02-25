import { NextResponse } from 'next/server';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 30_000; // 30s cache — citizen data changes rarely

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const { data } = await manemusFetchJson('/api/citizens', {
      cache: 'no-store',
    });
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      citizens: [],
      organizations: [],
      offline: true,
    });
  }
}

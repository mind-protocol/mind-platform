import { NextResponse } from 'next/server';
import { manemusFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

const DEFAULT_USER_ID = '1864364329'; // Nicolas

// Cache per track (analysis is static per song)
const analysisCache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL_MS = 600_000; // 10 minutes

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get('track_id');
    if (!trackId) {
      return NextResponse.json({ error: 'track_id required' }, { status: 400 });
    }

    // Check cache
    const cached = analysisCache.get(trackId);
    if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    const res = await manemusFetch(
      `/spotify/audio-analysis/${DEFAULT_USER_ID}/${encodeURIComponent(trackId)}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Analysis not available' }, { status: res.status });
    }

    const data = await res.json();
    analysisCache.set(trackId, { data, ts: Date.now() });

    // Prune old entries
    if (analysisCache.size > 20) {
      const oldest = [...analysisCache.entries()]
        .sort((a, b) => a[1].ts - b[1].ts)[0];
      if (oldest) analysisCache.delete(oldest[0]);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

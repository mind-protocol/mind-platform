import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

const STATS_FILE = join(process.cwd(), 'data', 'repo_stats.json');

// Cache in memory for 24h
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    if (!existsSync(STATS_FILE)) {
      return NextResponse.json({ error: 'Stats not generated yet. Run: python3 scripts/generate_repo_stats.py' }, { status: 404 });
    }

    const raw = readFileSync(STATS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read stats' }, { status: 500 });
  }
}

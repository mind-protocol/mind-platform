import { NextResponse } from 'next/server';

const L4_API_URL = process.env.L4_API_URL || 'http://localhost:8766';

let statsCache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 60_000;

export async function GET() {
  if (statsCache && Date.now() - statsCache.timestamp < CACHE_TTL) {
    return NextResponse.json(statsCache.data);
  }

  try {
    const [citizensRes, orgsRes] = await Promise.all([
      fetch(`${L4_API_URL}/registry/citizens?limit=0`),
      fetch(`${L4_API_URL}/registry/orgs?limit=0`),
    ]);

    const citizens = citizensRes.ok
      ? await citizensRes.json()
      : { count: 0 };
    const orgs = orgsRes.ok ? await orgsRes.json() : { count: 0 };

    const stats = {
      citizens: citizens.count ?? 0,
      orgs: orgs.count ?? 0,
      nodes: 0,
    };

    statsCache = { data: stats, timestamp: Date.now() };
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ citizens: 0, orgs: 0, nodes: 0 });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 30_000; // 30s cache — citizen data changes rarely

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(`${MANEMUS_URL}/api/citizens`, {
      cache: 'no-store',
      headers: { 'ngrok-skip-browser-warning': '1' },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch {
    // Return empty state when backend is unreachable
    return NextResponse.json({
      citizens: [],
      organizations: [],
      offline: true,
    });
  }
}

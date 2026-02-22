import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams.toString();
    const url = `${MANEMUS_URL}/api/tracker/stats${params ? `?${params}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

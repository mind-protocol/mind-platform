import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MIND_API_URL || process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${MANEMUS_URL}/api/tracker/yoga/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '1' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

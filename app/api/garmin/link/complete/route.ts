import { NextResponse } from 'next/server';

const MANEMUS_URL = process.env.MANEMUS_URL || 'http://localhost:8765';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${MANEMUS_URL}/garmin/link/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

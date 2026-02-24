import { NextRequest, NextResponse } from 'next/server';

const MANEMUS_URL = process.env.MANEMUS_URL || 'http://localhost:8765';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const days = req.nextUrl.searchParams.get('days') || '60';
  const url = `${MANEMUS_URL}/api/tracker/dependencies?days=${days}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': auth,
        'ngrok-skip-browser-warning': 'true',
      },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch {
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  const days = req.nextUrl.searchParams.get('days') || '30';

  try {
    const res = await fetch(`${MANEMUS_URL}/api/tracker/interactions?days=${days}`, {
      headers: {
        'ngrok-skip-browser-warning': '1',
        'X-User-Id': userId,
      },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

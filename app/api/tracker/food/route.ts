import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    const { searchParams } = new URL(req.url);
    const days = searchParams.get('days') || '7';
    const res = await fetch(`${MANEMUS_URL}/api/tracker/food?days=${days}`, {
      cache: 'no-store',
      headers: {
        'ngrok-skip-browser-warning': '1',
        'X-User-Id': userId,
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    const body = await req.json();
    const res = await fetch(`${MANEMUS_URL}/api/tracker/food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ ...body, user_id: userId }),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

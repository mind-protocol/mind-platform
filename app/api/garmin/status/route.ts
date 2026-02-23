import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    if (!userId) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 });
    }
    const res = await fetch(`${MANEMUS_URL}/garmin/auth/status/${encodeURIComponent(userId)}`, {
      cache: 'no-store',
      headers: { 'ngrok-skip-browser-warning': '1' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

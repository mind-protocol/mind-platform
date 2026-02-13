import { NextResponse } from 'next/server';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://unterse-jayden-nonverminously.ngrok-free.dev';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    if (!userId) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 });
    }
    const res = await fetch(`${MANEMUS_URL}/garmin/auth/status/${encodeURIComponent(userId)}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

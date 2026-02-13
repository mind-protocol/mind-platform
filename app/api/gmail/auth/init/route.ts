import { NextResponse } from 'next/server';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const linkCode = searchParams.get('link_code');
    const userId = searchParams.get('user_id');
    if (!linkCode || !userId) {
      return NextResponse.json({ error: 'link_code and user_id required' }, { status: 400 });
    }
    const res = await fetch(
      `${MANEMUS_URL}/gmail/auth/init?link_code=${encodeURIComponent(linkCode)}&user_id=${encodeURIComponent(userId)}`
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

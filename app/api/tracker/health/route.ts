import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const section = req.nextUrl.searchParams.get('section') || '';
    const url = section
      ? `${MANEMUS_URL}/api/medical-profile/${section}`
      : `${MANEMUS_URL}/api/medical-profile`;

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'ngrok-skip-browser-warning': '1',
        'Authorization': authHeader,
      },
    });
    const data = await res.json();

    const response = NextResponse.json(data, { status: res.status });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function GET() {
  try {
    const res = await fetch(`${MANEMUS_URL}/api/tracker/skybox`, {
      cache: 'no-store',
      headers: { 'ngrok-skip-browser-warning': '1' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const res = await fetch(`${MANEMUS_URL}/api/tracker/skybox`, {
      method: 'POST',
      headers: { 'ngrok-skip-browser-warning': '1' },
      body: formData,
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

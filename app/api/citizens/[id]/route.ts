import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`${MANEMUS_URL}/api/citizens/${encodeURIComponent(id)}`, {
      cache: 'no-store',
      headers: { 'ngrok-skip-browser-warning': '1' },
    });
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: 'Citizen not found' }, { status: 404 });
      }
      throw new Error(`${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

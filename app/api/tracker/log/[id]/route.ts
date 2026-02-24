import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MIND_API_URL || process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const res = await fetch(`${MANEMUS_URL}/api/tracker/log/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '1' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await fetch(`${MANEMUS_URL}/api/tracker/log/${id}`, {
      method: 'DELETE',
      headers: { 'ngrok-skip-browser-warning': '1' },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

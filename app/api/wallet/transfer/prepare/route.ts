import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sender, recipient, amount } = body;
    if (!sender || !recipient || amount === undefined) {
      return NextResponse.json({ error: 'sender, recipient, and amount required' }, { status: 400 });
    }
    const res = await fetch(`${MANEMUS_URL}/wallet/transfer/prepare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '1' },
      body: JSON.stringify({ sender, recipient, amount }),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

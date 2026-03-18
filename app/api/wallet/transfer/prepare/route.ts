import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { mindFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { sender, recipient, amount } = body;
    if (!sender || !recipient || amount === undefined) {
      return NextResponse.json({ error: 'sender, recipient, and amount required' }, { status: 400 });
    }
    const { data, status } = await mindFetchJson('/wallet/transfer/prepare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, recipient, amount }),
    });
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

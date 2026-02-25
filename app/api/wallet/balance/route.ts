import { NextResponse } from 'next/server';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');
    if (!address) {
      return NextResponse.json({ error: 'address required' }, { status: 400 });
    }
    const { data, status } = await manemusFetchJson(`/wallet/balance/${encodeURIComponent(address)}`);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

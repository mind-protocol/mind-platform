import { NextRequest, NextResponse } from 'next/server';
import { manemusFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const res = await manemusFetch('/api/tracker/environments/composite', {
      method: 'POST',
      body: formData,
      timeoutMs: 120_000, // 120s for multi-file composite uploads
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

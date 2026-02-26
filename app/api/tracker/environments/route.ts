import { NextRequest, NextResponse } from 'next/server';
import { manemusFetch, manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, status } = await manemusFetchJson('/api/tracker/environments');
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const res = await manemusFetch('/api/tracker/environments', {
      method: 'POST',
      body: formData,
      timeoutMs: 120_000, // 120s for large Scaniverse PLY uploads
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

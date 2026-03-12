import { NextRequest, NextResponse } from 'next/server';
import { manemusFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  try {
    const res = await manemusFetch(`/api/feed/mentions/search?q=${encodeURIComponent(q)}`);
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ results: [] });
  }
}

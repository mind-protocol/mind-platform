import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const userId = auth.user_id;
  const days = req.nextUrl.searchParams.get('days') || '30';

  try {
    const { data, status } = await manemusFetchJson(`/api/tracker/interactions?days=${days}`, {
      headers: { 'X-User-Id': userId },
      cache: 'no-store',
    });
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

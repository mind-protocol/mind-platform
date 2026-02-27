import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { manemusFetch } from '@/lib/api-fetch';

export async function GET(req: NextRequest) {
  const authResult = await requireSession(req);
  if (authResult instanceof NextResponse) return authResult;

  const userId = authResult.user_id;
  const days = req.nextUrl.searchParams.get('days') || '60';

  try {
    const res = await manemusFetch(`/api/tracker/dependencies?days=${days}`, {
      headers: {
        'X-User-Id': userId,
      },
    });
    const data = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch {
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { manemusFetch } from '@/lib/api-fetch';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = await getUserIdFromRequest(req);
  const days = req.nextUrl.searchParams.get('days') || '60';

  try {
    const res = await manemusFetch(`/api/tracker/dependencies?days=${days}`, {
      headers: {
        'Authorization': auth,
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

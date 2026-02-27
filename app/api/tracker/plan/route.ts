import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const userId = auth.user_id;
    const params = req.nextUrl.searchParams.toString();
    const path = `/api/tracker/plan${params ? `?${params}` : ''}`;
    const { data, status } = await manemusFetchJson(path, {
      cache: 'no-store',
      headers: { 'X-User-Id': userId },
    });
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const userId = auth.user_id;
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { data, status } = await manemusFetchJson('/api/tracker/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ ...body, user_id: userId }),
      cache: 'no-store',
    });
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

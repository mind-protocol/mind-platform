import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
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
  try {
    const userId = await getUserIdFromRequest(req);
    const body = await req.json();
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

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    const params = req.nextUrl.searchParams.toString();
    const path = `/api/tracker/correlation${params ? `?${params}` : ''}`;
    const { data, status } = await manemusFetchJson(path, {
      cache: 'no-store',
      headers: { 'X-User-Id': userId },
    });
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

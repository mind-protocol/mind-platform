import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await getUserIdFromRequest(req);
    const section = req.nextUrl.searchParams.get('section') || '';
    const path = section
      ? `/api/medical-profile/${section}`
      : '/api/medical-profile';

    const { data, status } = await manemusFetchJson(path, {
      cache: 'no-store',
      headers: {
        'Authorization': authHeader,
        'X-User-Id': userId,
      },
    });

    const response = NextResponse.json(data, { status });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

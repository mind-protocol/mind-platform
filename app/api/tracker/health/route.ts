import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { mindFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const userId = auth.user_id;
    const section = req.nextUrl.searchParams.get('section') || '';
    const path = section
      ? `/api/medical-profile/${section}`
      : '/api/medical-profile';

    const { data, status } = await mindFetchJson(path, {
      cache: 'no-store',
      headers: {
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

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { mindFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await requireSession(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const userId = auth.user_id;
    const { data, status } = await mindFetchJson('/api/tracker/environments/active', {
      headers: { 'X-User-Id': userId },
    });
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

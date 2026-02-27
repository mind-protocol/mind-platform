import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const userId = auth.user_id;
    const { id } = await params;
    const body = await req.json();
    const { data, status } = await manemusFetchJson(`/api/tracker/plan/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

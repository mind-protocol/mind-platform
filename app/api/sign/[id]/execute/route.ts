import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    const { data, status } = await manemusFetchJson(`/sign/${id}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': req.headers.get('x-forwarded-for') || '',
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

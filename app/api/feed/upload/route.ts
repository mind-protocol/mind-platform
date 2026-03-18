import { NextRequest, NextResponse } from 'next/server';
import { MIND_HOME_URL } from '@/lib/api-fetch';
import { requireSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await requireSession(request);
  if (auth instanceof NextResponse) return auth;
  const apiKey = process.env.MIND_HOME_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

  try {
    const formData = await request.formData();
    const res = await fetch(`${MIND_HOME_URL}/api/feed/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { manemusFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const userId = auth.user_id;
    const formData = await req.formData();
    formData.append('user_id', userId);
    const res = await manemusFetch('/api/health-profile/extract-document', {
      method: 'POST',
      headers: { 'X-User-Id': userId },
      body: formData,
      timeoutMs: 60_000,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { mindFetch } from '@/lib/api-fetch';
import { requireSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string; postId: string }> }
) {
  const auth = await requireSession(request);
  if (auth instanceof NextResponse) return auth;
  const { profileId, postId } = await params;
  const apiKey = process.env.MIND_HOME_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

  try {
    const res = await mindFetch(`/api/feed/${encodeURIComponent(profileId)}/${encodeURIComponent(postId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}`, 'X-User-Id': auth.user_id },
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

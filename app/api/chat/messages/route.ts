import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { manemusFetchJson } from '@/lib/api-fetch';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// 60 polls per 60s per user — generous but prevents abuse
const POLL_LIMIT_MAX = 60;
const POLL_LIMIT_WINDOW_MS = 60_000;

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const userId = auth.user_id;
  const rl = checkRateLimit(`poll:${userId}`, POLL_LIMIT_MAX, POLL_LIMIT_WINDOW_MS);
  if (rl.limited) {
    return NextResponse.json(
      { messages: [], throttled: true },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('thread_id');
    if (!threadId) {
      return NextResponse.json({ error: 'thread_id required' }, { status: 400 });
    }
    const since = searchParams.get('since') || '';
    const path = `/chat/messages/${encodeURIComponent(threadId)}${since ? `?since=${encodeURIComponent(since)}` : ''}`;
    const { data, status } = await manemusFetchJson(path);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

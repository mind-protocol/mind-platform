import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { manemusFetchJson } from '@/lib/api-fetch';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// 20 messages per 60s per user — frontend layer (backend has its own)
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  // Rate limit by user ID (authenticated) — more reliable than IP
  const userId = auth.user_id;
  const rl = checkRateLimit(`chat:${userId}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (rl.limited) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait a moment. / 消息过多，请稍后再试。' },
      {
        status: 429,
        headers: { 'Retry-After': String(rl.retryAfter) },
      },
    );
  }

  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { data, status } = await manemusFetchJson('/chat/send', {
      method: 'POST',
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

import { NextResponse } from 'next/server';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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

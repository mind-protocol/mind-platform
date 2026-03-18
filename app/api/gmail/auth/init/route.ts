import { NextResponse } from 'next/server';
import { mindFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const linkCode = searchParams.get('link_code');
    const userId = searchParams.get('user_id');
    if (!linkCode || !userId) {
      return NextResponse.json({ error: 'link_code and user_id required' }, { status: 400 });
    }
    const { data, status } = await mindFetchJson(
      `/gmail/auth/init?link_code=${encodeURIComponent(linkCode)}&user_id=${encodeURIComponent(userId)}`
    );
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

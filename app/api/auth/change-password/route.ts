import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { manemusFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    const body = await req.json();
    const { current_password, new_password } = body;

    if (!current_password || !new_password) {
      return NextResponse.json(
        { error: 'Current and new password are required' },
        { status: 400 },
      );
    }

    const res = await manemusFetch('/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ current_password, new_password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Password change failed' },
        { status: res.status },
      );
    }

    return NextResponse.json({ ok: true, message: data.message });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

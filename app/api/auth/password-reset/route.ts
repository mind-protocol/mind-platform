import { NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';
import { mindFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 },
      );
    }

    const res = await mindFetch('/auth/password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Reset failed' },
        { status: res.status },
      );
    }

    // Set session cookie so user is logged in after reset
    const response = NextResponse.json({
      ok: true,
      user_id: data.user_id,
      name: data.name,
      trust: data.trust,
    });

    if (data.token) {
      setSession(response, data.token);
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

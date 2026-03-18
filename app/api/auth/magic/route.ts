import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';
import { mindFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Magic token is required' },
        { status: 400 },
      );
    }

    const res = await mindFetch(
      `/auth/magic?token=${encodeURIComponent(token)}`
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Magic link invalid or expired' },
        { status: res.status },
      );
    }

    // Set the session cookie and return user data + optional redirect
    const response = NextResponse.json({
      user_id: data.user_id,
      name: data.name,
      trust: data.trust,
      redirect: data.redirect || '/',
    });

    setSession(response, data.token);
    return response;
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

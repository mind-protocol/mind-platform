import { NextResponse } from 'next/server';
import { MANEMUS_URL, setSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${MANEMUS_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Registration failed' },
        { status: res.status },
      );
    }

    // Set the session cookie and return user data
    const response = NextResponse.json({
      user_id: data.user_id,
      name: data.name,
      trust: data.trust,
    });

    setSession(response, data.token);
    return response;
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

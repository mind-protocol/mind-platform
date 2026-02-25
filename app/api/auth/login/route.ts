import { NextResponse } from 'next/server';
import { MANEMUS_URL, setSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const res = await fetch(`${MANEMUS_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Login failed' },
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

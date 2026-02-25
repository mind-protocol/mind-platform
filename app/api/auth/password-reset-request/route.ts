import { NextResponse } from 'next/server';
import { manemusFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const res = await manemusFetch('/auth/password-reset-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    // Always return success to prevent email enumeration
    return NextResponse.json({
      ok: true,
      message: data.message || 'If this email exists, a reset link has been generated.',
    });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearSession(response);
  return response;
}

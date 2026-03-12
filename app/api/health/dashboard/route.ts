import { NextResponse } from 'next/server';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data } = await manemusFetchJson('/health/dashboard', {
      cache: 'no-store',
      timeoutMs: 20_000, // systemd checks can be slow
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      overall_status: 'unreachable',
      timestamp: new Date().toISOString(),
      systems: {
        api: { name: 'Manemus API', status: 'down', error: 'Backend unreachable' },
      },
      citizens: { status: 'unknown' },
      uptime: {},
    });
  }
}

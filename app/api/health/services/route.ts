import { NextResponse } from 'next/server';
import { manemusFetchJson } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data } = await manemusFetchJson('/health/services', {
      cache: 'no-store',
      timeoutMs: 15_000, // WAHA check can be slow
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      status: 'unreachable',
      timestamp: new Date().toISOString(),
      services: {
        api: { name: 'Manemus API', status: 'down', error: 'Backend unreachable' },
      },
    });
  }
}

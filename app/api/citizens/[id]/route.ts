import { NextRequest, NextResponse } from 'next/server';
import { manemusFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await manemusFetch(`/api/citizens/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: 'Citizen not found' }, { status: 404 });
      }
      throw new Error(`${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

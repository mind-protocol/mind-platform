import { NextResponse } from 'next/server';
import { getOrgs } from '@/lib/l4-falkordb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orgs = await getOrgs();

    return NextResponse.json({
      status: orgs.length > 0 ? 'ok' : 'empty',
      timestamp: new Date().toISOString(),
      services: Object.fromEntries(
        orgs.map(org => [
          org.id,
          {
            name: org.name,
            status: org.endpoint ? 'registered' : 'no_endpoint',
            endpoint: org.endpoint,
            website: org.website,
          },
        ])
      ),
    });
  } catch (e: any) {
    return NextResponse.json({
      status: 'unreachable',
      timestamp: new Date().toISOString(),
      error: e?.message || 'Cannot connect to L4',
      services: {},
    });
  }
}

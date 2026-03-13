import { NextRequest, NextResponse } from 'next/server';
import registryData from '@/data/registry.json';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const org = registryData.orgs.find(
    (o) => o.id.toLowerCase() === id.toLowerCase()
  );

  if (!org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  const members = registryData.citizens.filter(
    (c) => c.org_membership === org.id
  );

  return NextResponse.json({ ...org, members });
}

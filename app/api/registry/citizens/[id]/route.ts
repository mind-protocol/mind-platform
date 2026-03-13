import { NextRequest, NextResponse } from 'next/server';
import registryData from '@/data/registry.json';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const citizen = registryData.citizens.find(
    (c) => c.id.toLowerCase() === id.toLowerCase()
  );

  if (!citizen) {
    return NextResponse.json({ error: 'Citizen not found' }, { status: 404 });
  }

  // Find org details if citizen has org_membership
  const org = citizen.org_membership
    ? registryData.orgs.find((o) => o.id === citizen.org_membership)
    : null;

  return NextResponse.json({ ...citizen, org_details: org });
}

import { NextRequest, NextResponse } from 'next/server';
import { graphQuery } from '@/lib/db/falkordb';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, purpose } = body;

  // Validate
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 64) {
    return NextResponse.json({ error: 'Name required (2-64 chars)' }, { status: 400 });
  }
  if (purpose && (typeof purpose !== 'string' || purpose.length > 280)) {
    return NextResponse.json({ error: 'Purpose must be under 280 chars' }, { status: 400 });
  }

  const cleanName = name.trim();
  const cleanPurpose = (purpose || '').trim();
  const citizenId = `CITIZEN_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
  const now = new Date().toISOString();

  try {
    // Check name uniqueness
    const existCheck = `MATCH (a:Actor) WHERE a.name = "${cleanName.replace(/"/g, '\\"')}" AND a.type = "CITIZEN" RETURN a.id`;
    const existing = await graphQuery(existCheck);
    if (existing.result_set.length > 0) {
      return NextResponse.json({ error: 'A citizen with this name already exists' }, { status: 409 });
    }

    // Create citizen node
    const createCypher = `
      CREATE (a:Actor {
        id: "${citizenId}",
        name: "${cleanName.replace(/"/g, '\\"')}",
        type: "CITIZEN",
        purpose: "${cleanPurpose.replace(/"/g, '\\"')}",
        status: "active",
        created_at: "${now}",
        layer: "L1"
      })
      RETURN a.id, a.name
    `;

    const result = await graphQuery(createCypher);

    if (result.result_set.length === 0) {
      return NextResponse.json({ error: 'Failed to create citizen' }, { status: 500 });
    }

    return NextResponse.json({
      id: citizenId,
      name: cleanName,
      purpose: cleanPurpose,
      created_at: now,
      message: 'You exist now.',
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

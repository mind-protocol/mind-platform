import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { graphQuery } from '@/lib/db/falkordb';

export const dynamic = 'force-dynamic';

/** Sanitize a string for safe Cypher interpolation: strip control chars, escape quotes and backslashes */
function cypherSafe(s: string): string {
  return s
    .replace(/\\/g, '\\\\')     // escape backslashes first
    .replace(/"/g, '\\"')        // escape double quotes
    .replace(/'/g, "\\'")        // escape single quotes
    .replace(/[\x00-\x1f]/g, '') // strip control characters (newlines, tabs, null bytes)
    .replace(/[\u2028\u2029]/g, ''); // strip Unicode line/paragraph separators
}

export async function POST(request: NextRequest) {
  const auth = await requireSession(request);
  if (auth instanceof NextResponse) return auth;
  const body = await request.json();
  const { name, purpose } = body;

  // Validate
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 64) {
    return NextResponse.json({ error: 'Name required (2-64 chars)' }, { status: 400 });
  }
  if (purpose && (typeof purpose !== 'string' || purpose.length > 280)) {
    return NextResponse.json({ error: 'Purpose must be under 280 chars' }, { status: 400 });
  }

  const cleanName = cypherSafe(name.trim());
  const cleanPurpose = cypherSafe((purpose || '').trim());
  const citizenId = `CITIZEN_${name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
  const nowS = Math.floor(Date.now() / 1000);
  const synthesis = cleanPurpose
    ? `Citizen ${cleanName}: ${cleanPurpose}`
    : `Citizen ${cleanName}`;

  try {
    // Check name uniqueness
    const existCheck = `MATCH (a:Actor) WHERE a.name = "${cleanName}" AND a.type = "CITIZEN" RETURN a.id`;
    const existing = await graphQuery(existCheck);
    if (existing.result_set.length > 0) {
      return NextResponse.json({ error: 'A citizen with this name already exists' }, { status: 409 });
    }

    // Create citizen node (v2.0 schema)
    const createCypher = `
      CREATE (a:Actor {
        id: "${citizenId}",
        name: "${cleanName}",
        type: "CITIZEN",
        node_type: "actor",
        content: "${cleanPurpose}",
        synthesis: "${cypherSafe(synthesis)}",
        weight: 1.0,
        energy: 0.0,
        stability: 0.0,
        recency: 1.0,
        activation_count: 0,
        in_working_memory: false,
        created_at_s: ${nowS},
        updated_at_s: ${nowS}
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
      content: cleanPurpose,
      created_at_s: nowS,
      message: 'You exist now.',
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

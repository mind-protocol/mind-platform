// DOCS: docs/registry/IMPLEMENTATION_Registry_Code.md
import { NextRequest, NextResponse } from 'next/server';
import { graphQuery } from '@/lib/db/falkordb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const verification = searchParams.get('verification') || 'all';
  const status = searchParams.get('status') || 'all';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    // Query spaces as orgs, counting their actor members
    const cypher = `
      MATCH (s:Space)
      WHERE s.type = "SPACE" AND s.id STARTS WITH "SPACE_"
      OPTIONAL MATCH (s)-[:LINK]->(a:Actor)
      RETURN s.id, s.name, s.content, s.type, count(a) as citizen_count
      SKIP ${offset} LIMIT ${limit}
    `;

    const countCypher = `
      MATCH (s:Space)
      WHERE s.type = "SPACE" AND s.id STARTS WITH "SPACE_"
      RETURN count(s) as cnt
    `;

    const [result, countResult] = await Promise.all([
      graphQuery(cypher),
      graphQuery(countCypher),
    ]);

    const items = result.result_set.map((row) => ({
      id: row[0] as string,
      name: row[1] as string || (row[0] as string).replace('space:', ''),
      wallet: null,
      citizen_count: (row[4] as number) || 0,
      status: 'active' as const,
      registered_date: '2025-01-01',
      verification: 'verified' as const,
      description: row[2] as string || `${row[3]} space`,
    }));

    const total = countResult.result_set[0]?.[0] as number || 0;

    // Filter by verification/status client-side
    let filtered = items;
    if (verification !== 'all') {
      filtered = filtered.filter((o) => o.verification === verification);
    }
    if (status !== 'all') {
      filtered = filtered.filter((o) => o.status === status);
    }

    return NextResponse.json({
      items: filtered,
      count: total,
      hasMore: total > offset + limit,
    });
  } catch (error) {
    console.error('Registry orgs query error:', error);
    return NextResponse.json(
      { items: [], count: 0, hasMore: false },
      { status: 500 },
    );
  }
}

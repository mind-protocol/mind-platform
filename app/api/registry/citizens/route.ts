// DOCS: docs/registry/IMPLEMENTATION_Registry_Code.md
import { NextRequest, NextResponse } from 'next/server';
import { graphQuery } from '@/lib/db/falkordb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const verification = searchParams.get('verification') || 'all';
  const statusParam = searchParams.get('status') || 'all';
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50') || 50, 1), 200);
  const offset = Math.max(parseInt(searchParams.get('offset') || '0') || 0, 0);

  // Allowlist for status to prevent Cypher injection
  const VALID_STATUSES = ['all', 'active', 'pending', 'inactive'];
  const status = VALID_STATUSES.includes(statusParam) ? statusParam : 'all';

  try {
    // Query actors with their org (space) membership
    const whereClause = status !== 'all' ? `AND a.status = "${status}"` : '';
    const cypher = `
      MATCH (s:Space)-[:LINK]->(a:Actor)
      WHERE (a.type = "AGENT" OR a.type = "CITIZEN") AND s.id STARTS WITH "SPACE_" ${whereClause}
      RETURN a.id, a.name, a.content, a.status, s.id, s.name
      SKIP ${offset} LIMIT ${limit}
    `;

    const countCypher = `
      MATCH (a:Actor) WHERE a.type = "AGENT" OR a.type = "CITIZEN"
      RETURN count(a) as cnt
    `;

    const [result, countResult] = await Promise.all([
      graphQuery(cypher),
      graphQuery(countCypher),
    ]);

    const items = result.result_set.map((row) => ({
      id: row[0] as string,
      name: row[1] as string,
      wallet: null,
      org_membership: row[4] as string || null,
      org_name: row[5] as string || (row[4] as string)?.replace('space:', '') || null,
      status: (row[3] as string) === 'ready' ? 'active' : 'pending',
      registered_date: '2025-01-01',
      capabilities: [],
      verification: 'verified' as const,
      description: row[2] as string,
    }));

    const total = countResult.result_set[0]?.[0] as number || 0;

    // Filter by verification client-side for now
    const filtered =
      verification !== 'all'
        ? items.filter((c) => c.verification === verification)
        : items;

    return NextResponse.json({
      items: filtered,
      count: total,
      hasMore: total > offset + limit,
    });
  } catch (error) {
    console.error('Registry citizens query error:', error);
    return NextResponse.json(
      { items: [], count: 0, hasMore: false },
      { status: 500 },
    );
  }
}

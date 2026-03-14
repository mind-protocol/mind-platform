/**
 * L4 FalkorDB client — query the protocol registry via ioredis.
 *
 * FalkorDB speaks Redis protocol. We use GRAPH.QUERY commands
 * over ioredis to query the L4 registry graph (mind_protocol).
 */

import Redis from 'ioredis';

const L4_HOST = process.env.L4_FALKORDB_HOST || process.env.FALKORDB_HOST || 'mind-protocol-falkordb';
const L4_PORT = parseInt(process.env.L4_FALKORDB_PORT || process.env.FALKORDB_PORT || '6379', 10);
const L4_GRAPH = process.env.L4_GRAPH || 'mind_protocol';

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis || _redis.status === 'end') {
    _redis = new Redis({
      host: L4_HOST,
      port: L4_PORT,
      lazyConnect: true,
      connectTimeout: 5000,
      commandTimeout: 10000,
      maxRetriesPerRequest: 1,
    });
  }
  return _redis;
}

export interface GraphRow {
  [key: string]: string | number | null;
}

/**
 * Execute a Cypher query against the L4 FalkorDB graph.
 * Returns parsed result rows.
 */
export async function l4Query(cypher: string): Promise<GraphRow[]> {
  const redis = getRedis();
  await redis.connect().catch(() => {}); // already connected is fine

  // GRAPH.QUERY returns [header, data, stats]
  const raw: any = await redis.call('GRAPH.QUERY', L4_GRAPH, cypher, '--compact');

  if (!raw || !Array.isArray(raw) || raw.length < 2) {
    return [];
  }

  const header = raw[0]; // [[type, name], ...]
  const data = raw[1];   // [[val, val, ...], ...]

  if (!Array.isArray(data)) return [];

  const columns = header.map((h: any) => {
    // h is [columnType, columnName] in compact format
    if (Array.isArray(h)) return String(h[1] || h[0]);
    return String(h);
  });

  return data.map((row: any) => {
    const obj: GraphRow = {};
    row.forEach((cell: any, i: number) => {
      const key = columns[i] || `col${i}`;
      // Compact format: [type, value]
      if (Array.isArray(cell)) {
        obj[key] = cell[cell.length - 1]; // last element is the value
      } else {
        obj[key] = cell;
      }
    });
    return obj;
  });
}

/**
 * Get all registered orgs from L4.
 */
export async function getOrgs(): Promise<{
  id: string;
  name: string;
  endpoint: string | null;
  website: string | null;
  status: string;
}[]> {
  try {
    const rows = await l4Query(
      "MATCH (o) WHERE o.type = 'ORGANIZATION' OR o.type = 'organization' " +
      "OPTIONAL MATCH (o)-[:link]->(e {type: 'endpoint'}) " +
      "RETURN o.id, o.name, e.content, o.website, o.status"
    );

    return rows.map(r => ({
      id: String(r['o.id'] || ''),
      name: String(r['o.name'] || r['o.id'] || ''),
      endpoint: r['e.content'] ? String(r['e.content']) : null,
      website: r['o.website'] ? String(r['o.website']) : null,
      status: String(r['o.status'] || 'active'),
    }));
  } catch (e) {
    console.error('L4 getOrgs failed:', e);
    return [];
  }
}

/**
 * Get citizen count per org from L4.
 */
export async function getCitizenCountByOrg(): Promise<Record<string, number>> {
  try {
    const rows = await l4Query(
      "MATCH (c)-[r:link]->(o) WHERE r.type = 'MEMBER_OF' AND c.type = 'citizen' " +
      "RETURN o.id, count(c) AS cnt"
    );

    const counts: Record<string, number> = {};
    for (const r of rows) {
      const orgId = String(r['o.id'] || '');
      counts[orgId] = Number(r['cnt'] || 0);
    }
    return counts;
  } catch {
    return {};
  }
}

/**
 * Disconnect from Redis (for cleanup).
 */
export async function disconnect() {
  if (_redis) {
    await _redis.quit().catch(() => {});
    _redis = null;
  }
}

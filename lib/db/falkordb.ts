// DOCS: docs/registry/IMPLEMENTATION_Registry_Code.md
import Redis from 'ioredis';

const FALKORDB_HOST = process.env.FALKORDB_HOST || 'localhost';
const FALKORDB_PORT = parseInt(process.env.FALKORDB_PORT || '6379');
const GRAPH_NAME = process.env.FALKORDB_GRAPH || 'mind_platform';

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      host: FALKORDB_HOST,
      port: FALKORDB_PORT,
      lazyConnect: true,
    });
  }
  return redis;
}

interface QueryResult {
  result_set: unknown[][];
  stats: string[];
}

export async function graphQuery(cypher: string): Promise<QueryResult> {
  const client = getRedis();

  try {
    // FalkorDB uses GRAPH.QUERY command
    const result = await client.call('GRAPH.QUERY', GRAPH_NAME, cypher) as unknown[];

    // Parse FalkorDB response format
    // [header, rows, stats]
    if (!Array.isArray(result) || result.length < 2) {
      return { result_set: [], stats: [] };
    }

    const rows = result[1] as unknown[][];
    const stats = result[2] as string[] || [];

    return { result_set: rows || [], stats };
  } catch (error) {
    console.error('FalkorDB query error:', error);
    return { result_set: [], stats: [] };
  }
}

export async function disconnect(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

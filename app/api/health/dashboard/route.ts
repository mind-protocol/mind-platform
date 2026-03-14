import { NextResponse } from 'next/server';
import { getOrgs, getCitizenCountByOrg } from '@/lib/l4-falkordb';

export const dynamic = 'force-dynamic';

interface OrgHealth {
  id: string;
  name: string;
  endpoint: string | null;
  website: string | null;
  citizens: number;
  status: 'up' | 'degraded' | 'down' | 'no_endpoint';
  health?: Record<string, unknown>;
  error?: string;
  response_ms?: number;
}

async function pingEndpoint(url: string, timeoutMs = 8000): Promise<{
  ok: boolean;
  data?: Record<string, unknown>;
  ms: number;
  error?: string;
}> {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Normalize: if endpoint is wss://, convert to https:// for health check
    let healthUrl = url.replace(/\/$/, '');
    if (healthUrl.startsWith('wss://')) {
      healthUrl = healthUrl.replace('wss://', 'https://');
    }
    if (healthUrl.startsWith('ws://')) {
      healthUrl = healthUrl.replace('ws://', 'http://');
    }
    if (!healthUrl.includes('/health')) {
      healthUrl += '/health';
    }

    const res = await fetch(healthUrl, {
      signal: controller.signal,
      cache: 'no-store',
    });
    const ms = Date.now() - start;

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, data, ms };
    }
    return { ok: false, ms, error: `HTTP ${res.status}` };
  } catch (e: any) {
    return { ok: false, ms: Date.now() - start, error: e?.message || 'unreachable' };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const start = Date.now();

  try {
    // Fetch orgs + citizen counts from L4
    const [orgs, citizenCounts] = await Promise.all([
      getOrgs(),
      getCitizenCountByOrg(),
    ]);

    // Ping each org's endpoint in parallel
    const orgHealthPromises = orgs.map(async (org): Promise<OrgHealth> => {
      const citizens = citizenCounts[org.id] || 0;

      if (!org.endpoint) {
        return {
          ...org,
          citizens,
          status: 'no_endpoint',
        };
      }

      const ping = await pingEndpoint(org.endpoint);

      return {
        ...org,
        citizens,
        status: ping.ok ? 'up' : 'down',
        health: ping.data,
        response_ms: ping.ms,
        error: ping.error,
      };
    });

    const orgHealthResults = await Promise.all(orgHealthPromises);

    // Compute overall status
    const totalOrgs = orgHealthResults.length;
    const upOrgs = orgHealthResults.filter(o => o.status === 'up').length;
    const downOrgs = orgHealthResults.filter(o => o.status === 'down').length;
    const totalCitizens = orgHealthResults.reduce((sum, o) => sum + o.citizens, 0);

    let overall: 'healthy' | 'degraded' | 'down' | 'unknown' = 'unknown';
    if (totalOrgs === 0) overall = 'unknown';
    else if (downOrgs === 0) overall = 'healthy';
    else if (upOrgs > 0) overall = 'degraded';
    else overall = 'down';

    // Build systems map (for backward compat with status page)
    const systems: Record<string, unknown> = {
      l4_registry: {
        name: 'L4 Registry (FalkorDB)',
        status: totalOrgs > 0 ? 'up' : 'down',
        details: { orgs: totalOrgs, citizens: totalCitizens },
      },
    };

    for (const org of orgHealthResults) {
      systems[org.id] = {
        name: org.name,
        status: org.status,
        details: {
          citizens: org.citizens,
          endpoint: org.endpoint,
          website: org.website,
          response_ms: org.response_ms,
          ...(org.health || {}),
        },
        error: org.error,
      };
    }

    return NextResponse.json({
      overall_status: overall,
      timestamp: new Date().toISOString(),
      check_duration_ms: Date.now() - start,
      systems,
      orgs: orgHealthResults,
      citizens: {
        total: totalCitizens,
        status: totalCitizens > 0 ? 'active' : 'empty',
      },
      uptime: {},
      incidents: { active: [], recent: [] },
      uptime_pct: {},
    });
  } catch (e: any) {
    return NextResponse.json({
      overall_status: 'unreachable',
      timestamp: new Date().toISOString(),
      check_duration_ms: Date.now() - start,
      systems: {
        l4_registry: {
          name: 'L4 Registry (FalkorDB)',
          status: 'down',
          error: e?.message || 'Cannot connect to L4',
        },
      },
      orgs: [],
      citizens: { total: 0, status: 'unknown' },
      uptime: {},
      incidents: { active: [], recent: [] },
      uptime_pct: {},
    });
  }
}

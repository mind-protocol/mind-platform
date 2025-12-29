# Registry Module Health

Monitoring and observability for the registry module.

```
STATUS: DESIGNING
```

---

## Health Signals

### L4 API Health

| Signal | Source | Healthy | Warning | Error |
|--------|--------|---------|---------|-------|
| L4 API reachable | `/api/registry/citizens` | < 500ms | < 2s | Timeout/error |
| L4 API response valid | Response parsing | Valid JSON | Partial data | Parse error |

### Performance Health

| Signal | Threshold | Measurement |
|--------|-----------|-------------|
| List load time | < 2s = healthy, > 3s = warn | Navigation timing |
| Search response | < 500ms = healthy, > 1s = warn | Fetch timing |
| Detail load time | < 1s = healthy, > 2s = warn | Navigation timing |

### Data Health

| Signal | Check | Frequency |
|--------|-------|-----------|
| Citizens available | `items.length > 0` after fetch | On load |
| Orgs available | `items.length > 0` after fetch | On load |
| Verification derivable | All entities have `verification` field | On transform |

---

## Health Check Endpoint

### `GET /api/registry/health`

Quick health check for registry data availability.

```json
{
  "status": "healthy",
  "checks": {
    "l4_api": {
      "status": "up",
      "latency_ms": 120
    },
    "citizens": {
      "status": "available",
      "count": 42
    },
    "orgs": {
      "status": "available",
      "count": 5
    }
  }
}
```

### Implementation

```typescript
// app/api/registry/health/route.ts

export async function GET() {
  const start = Date.now();

  try {
    const [citizensRes, orgsRes] = await Promise.all([
      fetch(`${L4_API_URL}/registry/citizens?limit=1`),
      fetch(`${L4_API_URL}/registry/orgs?limit=1`),
    ]);

    const latency = Date.now() - start;

    if (!citizensRes.ok || !orgsRes.ok) {
      return NextResponse.json({
        status: 'degraded',
        checks: {
          l4_api: { status: 'error', latency_ms: latency },
        },
      }, { status: 503 });
    }

    const citizens = await citizensRes.json();
    const orgs = await orgsRes.json();

    return NextResponse.json({
      status: 'healthy',
      checks: {
        l4_api: { status: 'up', latency_ms: latency },
        citizens: { status: 'available', count: citizens.count },
        orgs: { status: 'available', count: orgs.count },
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      checks: {
        l4_api: { status: 'unreachable' },
      },
    }, { status: 503 });
  }
}
```

---

## UI Health Indicators

### List View

| State | Indicator |
|-------|-----------|
| Loading | Skeleton cards |
| Loaded | Normal list |
| Empty | "No citizens registered yet" |
| Error | Error card with retry button |
| Stale (>60s) | Subtle "Last updated X ago" |

### L4 Connection

| State | Indicator |
|-------|-----------|
| Connected | No indicator (normal) |
| Slow | Yellow dot in header |
| Disconnected | Banner "Registry data may be stale" |

---

## Error Tracking

### Errors to Track

| Error | Severity | Action |
|-------|----------|--------|
| L4 API timeout | Warning | Log, show cached data |
| L4 API 5xx | Error | Log, show error state |
| L4 API 4xx | Error | Log, may be data issue |
| Parse error | Error | Log with payload sample |
| Verification derivation error | Warning | Log, show as "unknown" |

### Sentry Integration

```typescript
// Error boundary for registry

function RegistryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<RegistryErrorFallback />}
      onError={(error, info) => {
        Sentry.captureException(error, {
          tags: { module: 'registry' },
          extra: info,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

---

## Metrics to Track

| Category | Metric | Description |
|----------|--------|-------------|
| **Usage** | registry_views | Page views on registry |
| | citizen_detail_views | Citizen profile views |
| | org_detail_views | Org profile views |
| | registry_searches | Search queries |
| **Performance** | registry_load_time | Time to load list |
| | registry_search_time | Time for search results |
| | l4_api_latency | L4 API response time |
| **Errors** | l4_api_errors | L4 API failures |
| | registry_parse_errors | Data transformation failures |

---

## Alerting Rules

| Alert | Condition | Severity |
|-------|-----------|----------|
| L4 API Down | error_rate > 50% for 5min | Critical |
| L4 API Slow | p95 > 3s for 10min | Warning |
| No Citizens | citizens.count = 0 | Warning |
| Registry Errors | errors > 10/min | Warning |

---

## Runbooks

### L4 API Unreachable

1. Check L4 API health: `curl $L4_API_URL/health`
2. Check network connectivity from platform
3. Check L4 API logs for errors
4. If L4 is down, registry will show cached data
5. Escalate to L4 team if L4 is unhealthy

### High Registry Latency

1. Check L4 API latency: `/api/registry/health`
2. Check if graph size has grown significantly
3. Check for hot-spot queries (specific orgs with many citizens)
4. Consider adding pagination if counts are high

### Parse Errors

1. Check Sentry for payload samples
2. Compare with expected schema
3. L4 schema may have changed — check version
4. Update transformers if needed

---

## Current Implementation Status

### Implemented

- (None yet)

### Not Implemented

- Health endpoint
- Error tracking
- Metrics
- Alerting
- Runbooks

### Priority

1. Add `/api/registry/health` endpoint
2. Add error boundary with logging
3. Track basic metrics (views, latency)
4. Add alerting when in production

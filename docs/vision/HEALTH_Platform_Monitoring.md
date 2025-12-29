# Platform Health

Runtime verification, monitoring, and observability.

```
STATUS: DESIGNING
```

---

## Health Signals

### Connection Health

| Signal | Source | Healthy | Warning | Error |
|--------|--------|---------|---------|-------|
| SSE Connection | `/api/sse` | Connected | Reconnecting | Disconnected > 30s |
| Backend API | `/api/connectome/*` | < 500ms | < 2s | Timeout/error |
| L4 API | `/api/registry/*` | < 500ms | < 2s | Timeout/error |

**UI Indicators:**
- Status badge in header: green/yellow/red
- Tooltip shows last successful connection
- Auto-reconnect with exponential backoff

### Performance Health

| Signal | Threshold | Measurement |
|--------|-----------|-------------|
| Canvas FPS | < 30 = warn, < 15 = error | requestAnimationFrame timing |
| Time to Interactive | > 3s = warn, > 5s = error | Performance API |
| Bundle Size | > 200KB = warn, > 500KB = error | Build output |
| API Latency (p95) | > 1s = warn, > 3s = error | Response timing |

**Dev Mode Indicators:**
- FPS counter overlay (toggle with `?debug=fps`)
- Bundle analyzer in build output
- Slow query warnings in console

### Data Health

| Signal | Check | Frequency |
|--------|-------|-----------|
| Graph Loaded | nodes.length > 0 | On load |
| Search Functional | Query returns results | On first search |
| Session Valid | JWT not expired | On route change |
| Schema Synced | Version matches L4 | On app start |

---

## Health Endpoints

### `GET /api/health`

Platform health check for load balancers.

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "checks": {
    "backend": { "status": "up", "latency_ms": 45 },
    "l4_api": { "status": "up", "latency_ms": 120 },
    "database": { "status": "up" }
  }
}
```

### `GET /api/health/deep`

Deep health check including dependencies.

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime_seconds": 3600,
  "checks": {
    "backend": {
      "status": "up",
      "latency_ms": 45,
      "node_count": 1234,
      "link_count": 5678
    },
    "l4_api": {
      "status": "up",
      "latency_ms": 120,
      "citizen_count": 100,
      "org_count": 10
    },
    "sse": {
      "status": "up",
      "connections": 5
    }
  }
}
```

---

## Monitoring Dashboard (Planned)

### Metrics to Track

| Category | Metric | Description |
|----------|--------|-------------|
| **Traffic** | requests/min | Total API requests |
| | unique_users/day | Distinct sessions |
| | page_views/page | Per-page analytics |
| **Performance** | p50_latency | Median response time |
| | p95_latency | 95th percentile |
| | error_rate | 5xx / total |
| **Business** | graphs_loaded | Connectome usage |
| | searches | Search volume |
| | contributions | L3 submissions |

### Alerting Rules

| Alert | Condition | Severity |
|-------|-----------|----------|
| API Down | error_rate > 50% for 5min | Critical |
| High Latency | p95 > 3s for 10min | Warning |
| SSE Disconnects | reconnects > 10/min | Warning |
| Bundle Size | increase > 20% | Info |

---

## Runtime Assertions (Dev Mode)

### Connectome Assertions

```typescript
// In dev mode, assert performance budgets
if (process.env.NODE_ENV === 'development') {
  const frameTime = performance.now() - lastFrame;
  if (frameTime > 32) { // < 30fps
    console.warn(`Slow frame: ${frameTime.toFixed(1)}ms`);
  }
}
```

### API Assertions

```typescript
// Assert response shape
function assertAPIResponse<T>(data: unknown, schema: Schema<T>): T {
  if (process.env.NODE_ENV === 'development') {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error('API response validation failed:', result.error);
    }
  }
  return data as T;
}
```

### State Assertions

```typescript
// Assert state invariants
if (process.env.NODE_ENV === 'development') {
  useConnectomeStore.subscribe((state) => {
    if (state.ledger.length > 0 && !state.session_id) {
      console.error('Invariant violation: ledger without session');
    }
  });
}
```

---

## Error Tracking

### Sentry Integration (Planned)

```typescript
// Configure Sentry for error tracking
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Scrub sensitive data
    if (event.user) {
      delete event.user.email;
    }
    return event;
  },
});
```

### Error Boundaries

```typescript
// Wrap modules in error boundaries
<ErrorBoundary
  fallback={<ModuleErrorFallback module="connectome" />}
  onError={(error, info) => {
    Sentry.captureException(error, { extra: info });
  }}
>
  <Connectome />
</ErrorBoundary>
```

---

## Health Checks by Module

| Module | Health Check | Implementation |
|--------|--------------|----------------|
| `connectome` | Canvas renders, D3 simulation runs | FPS counter, render count |
| `registry` | L4 API reachable | Ping endpoint |
| `schema-explorer` | Schema loaded | Version check |
| `marketplace` | Templates load | Count check |
| `wallet` | Balance fetchable | API call |
| `auth` | Session valid | JWT validation |

Each module should implement:
1. `isHealthy(): boolean` — Quick check
2. `getHealthDetails(): HealthDetails` — Detailed status
3. Health indicator in UI when unhealthy

---

## Incident Response

### Severity Levels

| Level | Definition | Response Time |
|-------|------------|---------------|
| P0 | Platform down, all users affected | 15 min |
| P1 | Major feature broken | 1 hour |
| P2 | Minor feature degraded | 4 hours |
| P3 | Cosmetic issue | Next sprint |

### Runbooks (Planned)

- `runbooks/backend-down.md` — Backend unreachable
- `runbooks/l4-down.md` — L4 API unreachable
- `runbooks/high-latency.md` — Performance degradation
- `runbooks/auth-issues.md` — Login failures

---

## Current Health Status

### Implemented
- SSE health telemetry connection
- Basic connection status in UI
- Build-time bundle analysis

### Not Implemented
- `/api/health` endpoints
- Performance monitoring
- Error tracking (Sentry)
- Alerting
- Runbooks

### Priority
1. Add `/api/health` endpoint
2. Integrate error tracking
3. Add performance monitoring
4. Create runbooks

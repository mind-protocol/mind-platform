# Landing Page Health

Monitoring and observability for the landing page.

```
STATUS: DESIGNING
```

---

## Health Signals

### Page Load Health

| Signal | Source | Healthy | Warning | Error |
|--------|--------|---------|---------|-------|
| FCP | Performance API | < 1s | < 2s | > 2s |
| LCP | Performance API | < 2.5s | < 4s | > 4s |
| TTI | Performance API | < 3s | < 5s | > 5s |

### Data Fetch Health

| Signal | Source | Healthy | Warning | Error |
|--------|--------|---------|---------|-------|
| Stats API | `/api/stats` | < 500ms | < 1s | Timeout |
| Activity API | `/api/activity` | < 500ms | < 1s | Timeout |

### Animation Health

| Signal | Threshold | Measurement |
|--------|-----------|-------------|
| Graph FPS | < 30 = warn | requestAnimationFrame timing |
| Animation jank | > 50ms frame = warn | Long task detection |

---

## Metrics to Track

| Category | Metric | Description |
|----------|--------|-------------|
| **Traffic** | landing_views | Page views |
| | bounce_rate | Exit without interaction |
| | scroll_depth | How far users scroll |
| **Engagement** | cta_clicks | Clicks on primary CTAs |
| | connectome_click | Clicks to Connectome |
| | registry_click | Clicks to Registry |
| **Performance** | fcp | First Contentful Paint |
| | lcp | Largest Contentful Paint |
| | tti | Time to Interactive |
| **Errors** | stats_api_errors | Stats fetch failures |
| | activity_api_errors | Activity fetch failures |
| | render_errors | Client-side errors |

---

## Analytics Events

### Page View

```typescript
trackEvent('landing_view', {
  referrer: document.referrer,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
});
```

### CTA Click

```typescript
trackEvent('cta_click', {
  button: 'explore_connectome' | 'browse_registry' | 'get_started',
  section: 'hero' | 'action_cards',
});
```

### Scroll Depth

```typescript
trackEvent('scroll_depth', {
  depth: 25 | 50 | 75 | 100,
});
```

---

## Error Tracking

### Client Errors

```typescript
// Error boundary for landing components
function LandingErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<LandingFallback />}
      onError={(error, info) => {
        Sentry.captureException(error, {
          tags: { page: 'landing' },
          extra: info,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### API Errors

```typescript
// In stats fetch
try {
  const stats = await fetch('/api/stats').then(r => r.json());
  setStats(stats);
} catch (error) {
  Sentry.captureException(error, {
    tags: { api: 'stats', page: 'landing' },
  });
  // Graceful degradation: show dashes
  setStats(null);
}
```

---

## Performance Budgets

| Resource | Budget | Action if Exceeded |
|----------|--------|-------------------|
| Total JS | 100KB | Investigate, code split |
| Total CSS | 20KB | Purge unused styles |
| Images | 200KB | Compress, lazy load |
| First load | 300KB | Review dependencies |

### Build-Time Check

```typescript
// next.config.js
module.exports = {
  experimental: {
    webpackBuildWorker: true,
  },
  // Fail build if bundle exceeds limit
};
```

---

## Health Dashboard (Planned)

### Key Metrics Display

```
Landing Page Health

Performance
├── FCP: 0.8s ✓
├── LCP: 2.1s ✓
└── TTI: 2.8s ✓

Traffic (last 24h)
├── Views: 1,234
├── Bounce: 35%
└── Avg scroll: 72%

CTAs (last 24h)
├── Connectome: 18%
├── Registry: 12%
└── Get Started: 5%

Errors (last 24h)
├── Stats API: 0
└── Client: 2
```

---

## Alerting Rules

| Alert | Condition | Severity |
|-------|-----------|----------|
| High Bounce | bounce_rate > 60% for 1h | Warning |
| Slow LCP | lcp p95 > 4s for 30min | Warning |
| Stats API Down | error_rate > 50% for 5min | Error |
| Render Errors | errors > 10/min | Warning |

---

## A/B Testing (Future)

### Potential Tests

| Test | Variants | Metric |
|------|----------|--------|
| Hero headline | 3 options | CTR to Connectome |
| CTA color | Amber vs Blue | CTR |
| Layer diagram | Cards vs Timeline | Scroll depth |
| Stats visibility | Shown vs Hidden | Bounce rate |

---

## Current Implementation Status

### Implemented

- (None yet)

### Not Implemented

- Performance monitoring
- Analytics events
- Error tracking
- Alerting

### Priority

1. Add basic analytics (page view, CTA clicks)
2. Add performance monitoring (Core Web Vitals)
3. Add error tracking
4. Add scroll depth tracking

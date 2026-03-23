# Scaling & Infrastructure

Load balancing, scaling strategies, and production readiness patterns.

## Load Balancing Algorithms

**Round Robin** — distribute evenly

```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}
```

**Least Connections** — route to server with fewest connections

```nginx
upstream backend {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
}
```

**IP Hash** — same client → same server (session affinity)

```nginx
upstream backend {
    ip_hash;
    server backend1.example.com;
    server backend2.example.com;
}
```

## Health Checks

```typescript
app.get('/health', async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: await checkDatabase(),
    redis: await checkRedis(),
    memory: process.memoryUsage(),
  };
  const isHealthy = checks.database && checks.redis;
  res.status(isHealthy ? 200 : 503).json(checks);
});
```

## Horizontal vs Vertical Scaling

| Aspect           | Horizontal (Scale Out)  | Vertical (Scale Up)      |
| ---------------- | ----------------------- | ------------------------ |
| Fault tolerance  | Better                  | Single point of failure  |
| Ceiling          | Unlimited               | Hardware limits          |
| Complexity       | Higher                  | Lower                    |
| Data consistency | Harder                  | Easier                   |
| Best for         | High traffic, stateless | Monoliths, rapid scaling |

## Performance Monitoring

### Key Metrics

**Application:** Response time (p50, p95, p99), throughput (req/s), error rate, CPU/memory usage.

**Database:** Query execution time, connection pool saturation, cache hit rate, slow query log.

**Tools:**

- Prometheus + Grafana (metrics)
- New Relic / Datadog (APM)
- Sentry (error tracking)
- OpenTelemetry (distributed tracing)

## Production Readiness Checklist

### Database

- [ ] Indexes on frequently queried columns
- [ ] Connection pooling configured
- [ ] N+1 queries eliminated
- [ ] Slow query log monitored

### Caching

- [ ] Redis cache for hot data
- [ ] TTL configured appropriately
- [ ] Cache invalidation on writes
- [ ] CDN for static assets
- [ ] > 80% cache hit rate

### Application

- [ ] Async processing for long tasks
- [ ] Response compression enabled
- [ ] Load balancing configured
- [ ] Health checks implemented
- [ ] Resource limits set (CPU, memory)

### Monitoring

- [ ] APM tool configured
- [ ] Error tracking active
- [ ] Performance dashboards
- [ ] Alerting on key metrics

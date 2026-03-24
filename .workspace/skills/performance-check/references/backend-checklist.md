# Backend Performance Checklist

Quick-reference checklist for backend audits. For deep-dive patterns, see [backend-database.md](backend-database.md), [backend-caching.md](backend-caching.md), [backend-scaling.md](backend-scaling.md), [backend-hotpath.md](backend-hotpath.md).

## 1. Database Queries

- **Missing indexes**: Frequently queried columns indexed? Check WHERE, JOIN, ORDER BY.
- **N+1 queries**: Related data fetched in loops instead of JOINs/eager loading?
- **Unbounded queries**: Missing LIMIT/pagination on large tables?
- **Full table scans**: Run EXPLAIN ANALYZE on suspicious queries.
- **Unnecessary SELECT \***: Only needed columns selected?

```typescript
// BAD: N+1 query
const posts = await Post.findAll();
for (const post of posts) {
  post.author = await User.findById(post.authorId); // N queries!
}

// GOOD: Eager loading
const posts = await Post.findAll({
  include: [{ model: User, as: 'author' }],
});
```

## 2. Connection Pooling

- Connection pool configured (not per-request connections)?
- Pool sizes appropriate? (`connections = (core_count * 2) + effective_spindle_count`)
- Idle timeout and connection timeout set?
- Pool saturation monitored?

## 3. Caching

- **Hot data uncached**: Frequently accessed, rarely changing values cached (profiles, config, catalogs)?
- **Missing TTL**: Cache entries have appropriate expiration?
- **No invalidation on write**: Cache updated/invalidated when data changes?
- **Cache hit rate**: Monitored? Target >80%.

```typescript
// Cache-aside pattern
async function getUser(userId: string) {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(userId);
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
}
```

## 4. Synchronous Bottlenecks

- Long-running tasks (email, image processing, reports) blocking request handlers?
- Should they be offloaded to message queue (Bull, SQS, RabbitMQ)?
- External API calls awaited sequentially when parallelizable?

## 5. HTTP & CDN

- Static assets served via CDN?
- Appropriate Cache-Control headers set?
- Response compression (gzip/brotli) enabled?

## 6. Scaling Readiness

- Service stateless (horizontally scalable)?
- Read replicas used for read-heavy workloads?
- Health check endpoint for load balancer integration?

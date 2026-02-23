---
name: performance-check
description: Audit backend code for performance issues — missing indexes, N+1 queries, no caching, missing connection pooling, synchronous bottlenecks, unbounded queries. Use when reviewing backend performance, optimizing APIs, or before deploying database-heavy features.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [file path, module, or description of code to audit]
---

# Backend Performance Check

You are performing a systematic performance audit of backend code. Identify bottlenecks, missing optimizations, and scalability risks. Be specific and actionable.

## When to Activate

- Reviewing API endpoint performance
- Optimizing database queries
- Adding or reviewing caching layers
- Before deploying database-heavy features
- Investigating slow response times
- Scaling a service for higher traffic

## Performance Audit Checklist

### 1. Database Queries

- **Missing indexes**: Are frequently queried columns indexed? Check WHERE, JOIN, ORDER BY columns.
- **N+1 queries**: Is related data fetched in loops instead of using JOINs or eager loading?
- **Unbounded queries**: Are queries missing LIMIT/pagination on large tables?
- **Full table scans**: Run EXPLAIN ANALYZE on suspicious queries.
- **Unnecessary SELECT \***: Are only needed columns selected?

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

### 2. Connection Pooling

- Is a connection pool configured (not creating connections per request)?
- Are pool sizes appropriate? (`connections = (core_count * 2) + effective_spindle_count`)
- Are idle timeout and connection timeout set?
- Is connection pool saturation monitored?

### 3. Caching

- **Hot data uncached**: Are frequently accessed, rarely changing values cached (user profiles, config, catalogs)?
- **Missing TTL**: Do cache entries have appropriate expiration?
- **No invalidation on write**: Is the cache updated/invalidated when data changes?
- **Cache hit rate**: Is it being monitored? Target >80%.

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

### 4. Synchronous Bottlenecks

- Are long-running tasks (email, image processing, reports) blocking request handlers?
- Should these be offloaded to a message queue (Bull, SQS, RabbitMQ)?
- Are external API calls awaited sequentially when they could be parallelized?

### 5. HTTP & CDN

- Are static assets served via CDN?
- Are appropriate Cache-Control headers set?
- Is response compression (gzip/brotli) enabled?

### 6. Scaling Readiness

- Is the service stateless (can it horizontally scale)?
- Are read replicas used for read-heavy workloads?
- Is there a health check endpoint for load balancer integration?

## Output Format

For each finding:

- **Severity**: Critical / Warning / Suggestion
- **Category**: Database | Caching | Async | HTTP | Scaling
- **Location**: File and line reference
- **Issue**: What the performance problem is
- **Impact**: Estimated effect (e.g., "N+1 causes O(n) queries, ~100ms per additional record")
- **Fix**: Specific code change or pattern to apply

## Reference

See [backend-performance.md](references/backend-performance.md) for detailed patterns including:

- Indexing strategies (B-tree, Hash, GIN, GiST)
- Cache-aside, write-through, and invalidation patterns
- Load balancing algorithms (round robin, least connections, IP hash)
- Message queue setup with Bull
- Database sharding strategies
- Read replica configuration

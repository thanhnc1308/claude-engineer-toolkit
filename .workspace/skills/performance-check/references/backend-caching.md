# Caching & CDN Patterns

Deep-dive caching strategies and CDN configuration. See also [backend-database.md](backend-database.md) for query optimization.

## Cache-Aside Pattern (Lazy Loading)

**Impact:** 90% DB load reduction, 10-100x faster response

```typescript
async function getUser(userId: string) {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(userId);
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
}
```

## Write-Through Pattern

```typescript
async function updateUser(userId: string, data: UpdateUserDto) {
  const user = await db.users.update(userId, data);
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
}
```

## Cache Invalidation

```typescript
async function deleteUser(userId: string) {
  await db.users.delete(userId);
  await redis.del(`user:${userId}`);
  await redis.del(`user:${userId}:posts`); // Related caches
}
```

## Cache Layers

```
Client → CDN Cache (static assets, 50%+ latency reduction)
       → API Gateway Cache (public endpoints)
       → Application Cache (Redis)
       → Database Query Cache
       → Database
```

## Best Practices

1. Cache frequently accessed data — user profiles, config, product catalogs
2. Set appropriate TTL — balance freshness vs performance
3. Invalidate on write — keep cache consistent
4. Use structured keys — `resource:id:attribute` pattern
5. Monitor hit rates — target >80%

## Unbounded In-Memory Caches

```typescript
// BAD: Cache grows forever
const cache = new Map();
app.get('/users/:id', async (req, res) => {
  if (!cache.has(req.params.id)) {
    cache.set(req.params.id, await db.users.findById(req.params.id));
  }
  res.json(cache.get(req.params.id));
});

// GOOD: LRU cache with size limit
import { LRUCache } from 'lru-cache';
const cache = new LRUCache<string, User>({
  max: 1000,
  ttl: 1000 * 60 * 5,
});
```

## CDN Configuration

**Impact:** 50%+ latency reduction for global users

```typescript
// Cache-Control headers
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Static assets
res.setHeader('Cache-Control', 'public, max-age=3600'); // API responses
res.setHeader('Cache-Control', 'private, no-cache'); // User-specific
```

Providers: Cloudflare (generous free tier), AWS CloudFront (AWS integration), Fastly (real-time purging).

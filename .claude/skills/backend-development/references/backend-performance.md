# Backend Performance & Scalability

Performance optimization strategies, caching patterns, and scalability best practices (2025).

## Database Performance

### Query Optimization

#### Indexing Strategies

**Impact:** 30% disk I/O reduction, 10-100x query speedup

```sql
-- Create index on frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Composite index for multi-column queries
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Partial index for filtered queries
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM orders
WHERE user_id = 123 AND created_at > '2025-01-01';
```

**Index Types:**

- **B-tree** - Default, general-purpose (equality, range queries)
- **Hash** - Fast equality lookups, no range queries
- **GIN** - Full-text search, JSONB queries
- **GiST** - Geospatial queries, range types

**When NOT to Index:**

- Small tables (<1000 rows)
- Frequently updated columns
- Low-cardinality columns (e.g., boolean with 2 values)

### Connection Pooling

**Impact:** 5-10x performance improvement

```typescript
// PostgreSQL with pg-pool
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum connections
  min: 5, // Minimum connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Error if can't connect in 2s
});

// Use pool for queries
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

**Recommended Pool Sizes:**

- **Web servers:** `connections = (core_count * 2) + effective_spindle_count`
- **Typical:** 20-30 connections per app instance
- **Monitor:** Connection saturation in production

### N+1 Query Problem

**Bad: N+1 queries**

```typescript
// Fetches 1 query for posts, then N queries for authors
const posts = await Post.findAll();
for (const post of posts) {
  post.author = await User.findById(post.authorId); // N queries!
}
```

**Good: Join or eager loading**

```typescript
// Single query with JOIN
const posts = await Post.findAll({
  include: [{ model: User, as: 'author' }],
});
```

## Memory Leaks & Unbounded Collections

### Common Memory Leak Patterns

**Impact:** Gradual memory growth → OOM crashes, degraded performance over time

#### Unbounded In-Memory Collections

```typescript
// Bad: Cache grows forever
const cache = new Map();

app.get('/users/:id', async (req, res) => {
  if (!cache.has(req.params.id)) {
    cache.set(req.params.id, await db.users.findById(req.params.id));
  }
  res.json(cache.get(req.params.id));
});

// Good: Use LRU cache with size limit
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, User>({
  max: 1000, // Maximum 1000 entries
  ttl: 1000 * 60 * 5, // 5 minute TTL
});
```

#### Event Listener Leaks

```typescript
// Bad: Listeners accumulate on every request
app.get('/stream', (req, res) => {
  emitter.on('data', (data) => res.write(data));
});

// Good: Clean up on disconnect
app.get('/stream', (req, res) => {
  const handler = (data: string) => res.write(data);
  emitter.on('data', handler);
  req.on('close', () => emitter.off('data', handler));
});
```

#### Unreleased Resources

```typescript
// Bad: Connection never released on error
async function query(sql: string) {
  const conn = await pool.getConnection();
  const result = await conn.query(sql); // If this throws, connection leaks
  conn.release();
  return result;
}

// Good: Always release with try/finally
async function query(sql: string) {
  const conn = await pool.getConnection();
  try {
    return await conn.query(sql);
  } finally {
    conn.release();
  }
}
```

### Detection & Monitoring

```typescript
// Track memory usage in production
setInterval(() => {
  const usage = process.memoryUsage();
  metrics.gauge('memory.heapUsed', usage.heapUsed);
  metrics.gauge('memory.rss', usage.rss);
  metrics.gauge('memory.external', usage.external);
}, 30000);
```

**Tools:**

- `node --inspect` + Chrome DevTools (heap snapshots)
- `clinic.js` (flame graphs, memory profiling)
- `--max-old-space-size` flag to set heap limits

## Hot Path Optimization

### Identifying Hot Paths

**Impact:** 2-10x throughput improvement on critical endpoints

Hot paths are code executed on every request or in tight loops. Small inefficiencies here multiply across millions of executions.

**Profiling first, optimize second:**

```bash
# CPU profiling with clinic.js
npx clinic flame -- node server.js
# Load test the endpoint, then analyze the flame graph

# Built-in Node.js profiler
node --prof server.js
node --prof-process isolate-*.log > profile.txt
```

### Common Hot Path Anti-Patterns

#### Redundant Computation in Request Handlers

```typescript
// Bad: Parsing config on every request
app.get('/api/data', (req, res) => {
  const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
  // ... use config
});

// Good: Parse once at startup
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
app.get('/api/data', (req, res) => {
  // ... use config
});
```

#### Expensive Operations in Loops

```typescript
// Bad: Regex compiled on every iteration
function findMatches(items: string[]) {
  return items.filter((item) => new RegExp(pattern).test(item));
}

// Good: Compile regex once
const compiled = new RegExp(pattern);
function findMatches(items: string[]) {
  return items.filter((item) => compiled.test(item));
}
```

#### Synchronous Blocking in Async Code

```typescript
// Bad: Blocks event loop
app.get('/hash', (req, res) => {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  res.json({ hash: hash.toString('hex') });
});

// Good: Non-blocking
app.get('/hash', async (req, res) => {
  const hash = await crypto.pbkdf2(password, salt, 100000, 64, 'sha512');
  res.json({ hash: hash.toString('hex') });
});
```

#### Unnecessary Serialization

```typescript
// Bad: Serialize/deserialize in middleware chain
function middleware(req, res, next) {
  req.body = JSON.parse(JSON.stringify(req.body)); // Deep clone on every request
  next();
}

// Good: Clone only when mutation is needed
function middleware(req, res, next) {
  // Only clone if handler needs to mutate body
  if (req.needsMutation) {
    req.body = structuredClone(req.body);
  }
  next();
}
```

### Optimization Techniques

- **Memoize pure functions** — Cache results for repeated inputs
- **Batch operations** — Combine multiple DB writes into single transaction
- **Stream large payloads** — Avoid loading entire files into memory
- **Use worker threads** — Offload CPU-intensive work from the event loop
- **Precompute at startup** — Move invariant calculations out of request handlers

## Caching Strategies

### Redis Caching

**Impact:** 90% DB load reduction, 10-100x faster response

#### Cache-Aside Pattern (Lazy Loading)

```typescript
async function getUser(userId: string) {
  // Try cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  // Cache miss - fetch from DB
  const user = await db.users.findById(userId);

  // Store in cache (TTL: 1 hour)
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));

  return user;
}
```

#### Write-Through Pattern

```typescript
async function updateUser(userId: string, data: UpdateUserDto) {
  // Update database
  const user = await db.users.update(userId, data);

  // Update cache immediately
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));

  return user;
}
```

#### Cache Invalidation

```typescript
// Invalidate on update
async function deleteUser(userId: string) {
  await db.users.delete(userId);
  await redis.del(`user:${userId}`);
  await redis.del(`user:${userId}:posts`); // Invalidate related caches
}

// Pattern-based invalidation
await redis.keys('user:*').then((keys) => redis.del(...keys));
```

### Cache Layers

```
Client
  → CDN Cache (static assets, 50%+ latency reduction)
  → API Gateway Cache (public endpoints)
  → Application Cache (Redis)
  → Database Query Cache
  → Database
```

### Cache Best Practices

1. **Cache frequently accessed data** - User profiles, config, product catalogs
2. **Set appropriate TTL** - Balance freshness vs performance
3. **Invalidate on write** - Keep cache consistent
4. **Use cache keys wisely** - `resource:id:attribute` pattern
5. **Monitor hit rates** - Target >80% hit rate

## Load Balancing

### Algorithms

**Round Robin** - Distribute evenly across servers

```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}
```

**Least Connections** - Route to server with fewest connections

```nginx
upstream backend {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
}
```

**IP Hash** - Same client → same server (session affinity)

```nginx
upstream backend {
    ip_hash;
    server backend1.example.com;
    server backend2.example.com;
}
```

### Health Checks

```typescript
// Express health check endpoint
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

## Asynchronous Processing

### Message Queues for Long-Running Tasks

```typescript
// Producer - Add job to queue
import Queue from 'bull';

const emailQueue = new Queue('email', {
  redis: { host: 'localhost', port: 6379 },
});

await emailQueue.add('send-welcome', {
  userId: user.id,
  email: user.email,
});

// Consumer - Process jobs
emailQueue.process('send-welcome', async (job) => {
  await sendWelcomeEmail(job.data.email);
});
```

**Use Cases:**

- Email sending
- Image/video processing
- Report generation
- Data export
- Webhook delivery

## CDN (Content Delivery Network)

**Impact:** 50%+ latency reduction for global users

### Configuration

```typescript
// Cache-Control headers
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Static assets
res.setHeader('Cache-Control', 'public, max-age=3600'); // API responses
res.setHeader('Cache-Control', 'private, no-cache'); // User-specific data
```

**CDN Providers:**

- Cloudflare (generous free tier, global coverage)
- AWS CloudFront (AWS integration)
- Fastly (real-time purging)

## Horizontal vs Vertical Scaling

### Horizontal Scaling (Scale Out)

**Pros:**

- Better fault tolerance
- Unlimited scaling potential
- Cost-effective (commodity hardware)

**Cons:**

- Complex architecture
- Data consistency challenges
- Network overhead

**When to use:** High traffic, need redundancy, stateless applications

### Vertical Scaling (Scale Up)

**Pros:**

- Simple architecture
- No code changes needed
- Easier data consistency

**Cons:**

- Hardware limits
- Single point of failure
- Expensive at high end

**When to use:** Monolithic apps, rapid scaling needed, data consistency critical

## Database Scaling Patterns

### Read Replicas

```
Primary (Write) → Replica 1 (Read)
               → Replica 2 (Read)
               → Replica 3 (Read)
```

**Implementation:**

```typescript
// Write to primary
await primaryDb.users.create(userData);

// Read from replica
const users = await replicaDb.users.findAll();
```

**Use Cases:**

- Read-heavy workloads (90%+ reads)
- Analytics queries
- Reporting dashboards

### Database Sharding

**Horizontal Partitioning** - Split data across databases

```typescript
// Shard by user ID
function getShardId(userId: string): number {
  return hashCode(userId) % SHARD_COUNT;
}

const shardId = getShardId(userId);
const db = shards[shardId];
const user = await db.users.findById(userId);
```

**Sharding Strategies:**

- **Range-based:** Users 1-1M → Shard 1, 1M-2M → Shard 2
- **Hash-based:** Hash(userId) % shard_count
- **Geographic:** EU users → EU shard, US users → US shard
- **Entity-based:** Users → Shard 1, Orders → Shard 2

## Performance Monitoring

### Key Metrics

**Application:**

- Response time (p50, p95, p99)
- Throughput (requests/second)
- Error rate
- CPU/memory usage

**Database:**

- Query execution time
- Connection pool saturation
- Cache hit rate
- Slow query log

**Tools:**

- Prometheus + Grafana (metrics)
- New Relic / Datadog (APM)
- Sentry (error tracking)
- OpenTelemetry (distributed tracing)

## Performance Optimization Checklist

### Database

- [ ] Indexes on frequently queried columns
- [ ] Connection pooling configured
- [ ] N+1 queries eliminated
- [ ] Slow query log monitored
- [ ] Query execution plans analyzed

### Caching

- [ ] Redis cache for hot data
- [ ] Cache TTL configured appropriately
- [ ] Cache invalidation on writes
- [ ] CDN for static assets
- [ ] > 80% cache hit rate achieved

### Application

- [ ] Async processing for long tasks
- [ ] Response compression enabled (gzip)
- [ ] Load balancing configured
- [ ] Health checks implemented
- [ ] Resource limits set (CPU, memory)

### Monitoring

- [ ] APM tool configured (New Relic/Datadog)
- [ ] Error tracking (Sentry)
- [ ] Performance dashboards (Grafana)
- [ ] Alerting on key metrics
- [ ] Distributed tracing for microservices

## Common Performance Pitfalls

1. **No caching** - Repeatedly querying same data
2. **Missing indexes** - Full table scans
3. **N+1 queries** - Fetching related data in loops
4. **Synchronous processing** - Blocking on long tasks
5. **No connection pooling** - Creating new connections per request
6. **Unbounded queries** - No LIMIT on large tables
7. **No CDN** - Serving static assets from origin
8. **Memory leaks** - Unbounded caches, leaked listeners, unreleased resources
9. **Hot path waste** - Redundant computation, sync blocking, unnecessary serialization in request handlers

## Resources

- **PostgreSQL Performance:** https://www.postgresql.org/docs/current/performance-tips.html
- **Redis Best Practices:** https://redis.io/docs/management/optimization/
- **Web Performance:** https://web.dev/performance/
- **Database Indexing:** https://use-the-index-luke.com/

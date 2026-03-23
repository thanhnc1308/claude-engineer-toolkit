# Database & Query Optimization

Deep-dive patterns for database performance. See also [backend-caching.md](backend-caching.md) for caching strategies.

## Indexing Strategies

**Impact:** 30% disk I/O reduction, 10-100x query speedup

```sql
-- Frequently queried columns
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

- **B-tree** — Default, general-purpose (equality, range queries)
- **Hash** — Fast equality lookups, no range queries
- **GIN** — Full-text search, JSONB queries
- **GiST** — Geospatial queries, range types

**When NOT to index:** Small tables (<1000 rows), frequently updated columns, low-cardinality columns (boolean).

## Connection Pooling

**Impact:** 5-10x performance improvement

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

**Sizing:** `connections = (core_count * 2) + effective_spindle_count`. Typical: 20-30 per instance.

## N+1 Query Problem

```typescript
// BAD: 1 query for posts + N queries for authors
const posts = await Post.findAll();
for (const post of posts) {
  post.author = await User.findById(post.authorId);
}

// GOOD: Single query with JOIN
const posts = await Post.findAll({
  include: [{ model: User, as: 'author' }],
});
```

## Read Replicas

```
Primary (Write) → Replica 1 (Read)
               → Replica 2 (Read)
               → Replica 3 (Read)
```

```typescript
await primaryDb.users.create(userData); // Write to primary
const users = await replicaDb.users.findAll(); // Read from replica
```

Use cases: read-heavy workloads (90%+ reads), analytics, reporting dashboards.

## Database Sharding

Split data across databases by hash, range, geography, or entity.

```typescript
function getShardId(userId: string): number {
  return hashCode(userId) % SHARD_COUNT;
}
const db = shards[getShardId(userId)];
const user = await db.users.findById(userId);
```

**Strategies:**

- **Range-based:** Users 1-1M → Shard 1, 1M-2M → Shard 2
- **Hash-based:** Hash(userId) % shard_count
- **Geographic:** EU users → EU shard, US users → US shard

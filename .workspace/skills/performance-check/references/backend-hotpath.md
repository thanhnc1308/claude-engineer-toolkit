# Hot Paths, Memory Leaks & Async Processing

Patterns for optimizing request-critical code paths and preventing resource leaks.

## Identifying Hot Paths

**Impact:** 2-10x throughput improvement on critical endpoints

Hot paths = code executed on every request or in tight loops. Small inefficiencies multiply across millions of executions.

```bash
# CPU profiling with clinic.js
npx clinic flame -- node server.js

# Built-in Node.js profiler
node --prof server.js
node --prof-process isolate-*.log > profile.txt
```

**Rule: Profile first, optimize second.**

## Common Hot Path Anti-Patterns

### Redundant computation in request handlers

```typescript
// BAD: Parsing config on every request
app.get('/api/data', (req, res) => {
  const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
});

// GOOD: Parse once at startup
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
app.get('/api/data', (req, res) => {
  /* use config */
});
```

### Expensive operations in loops

```typescript
// BAD: Regex compiled on every iteration
items.filter((item) => new RegExp(pattern).test(item));

// GOOD: Compile once
const compiled = new RegExp(pattern);
items.filter((item) => compiled.test(item));
```

### Synchronous blocking in async code

```typescript
// BAD: Blocks event loop
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');

// GOOD: Non-blocking
const hash = await crypto.pbkdf2(password, salt, 100000, 64, 'sha512');
```

### Unnecessary serialization

```typescript
// BAD: Deep clone on every request
req.body = JSON.parse(JSON.stringify(req.body));

// GOOD: Clone only when mutation needed
if (req.needsMutation) req.body = structuredClone(req.body);
```

## Optimization Techniques

- **Memoize pure functions** — cache results for repeated inputs
- **Batch operations** — combine DB writes into single transaction
- **Stream large payloads** — avoid loading entire files into memory
- **Use worker threads** — offload CPU-intensive work from event loop
- **Precompute at startup** — move invariant calculations out of handlers

## Memory Leak Patterns

**Impact:** Gradual memory growth → OOM crashes

### Event listener leaks

```typescript
// BAD: Listeners accumulate
app.get('/stream', (req, res) => {
  emitter.on('data', (data) => res.write(data));
});

// GOOD: Clean up on disconnect
app.get('/stream', (req, res) => {
  const handler = (data: string) => res.write(data);
  emitter.on('data', handler);
  req.on('close', () => emitter.off('data', handler));
});
```

### Unreleased resources

```typescript
// BAD: Connection leaks on error
const conn = await pool.getConnection();
const result = await conn.query(sql); // throws → connection leaks
conn.release();

// GOOD: try/finally
const conn = await pool.getConnection();
try {
  return await conn.query(sql);
} finally {
  conn.release();
}
```

### Detection

```typescript
setInterval(() => {
  const usage = process.memoryUsage();
  metrics.gauge('memory.heapUsed', usage.heapUsed);
  metrics.gauge('memory.rss', usage.rss);
}, 30000);
```

Tools: `node --inspect` + Chrome DevTools, `clinic.js`, `--max-old-space-size`.

## Async Processing with Message Queues

Offload long-running tasks (email, image processing, reports, webhooks):

```typescript
import Queue from 'bull';

const emailQueue = new Queue('email', { redis: { host: 'localhost', port: 6379 } });
await emailQueue.add('send-welcome', { userId: user.id, email: user.email });

emailQueue.process('send-welcome', async (job) => {
  await sendWelcomeEmail(job.data.email);
});
```

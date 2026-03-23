---
name: performance-check
description: Audit frontend and backend performance — N+1 queries, missing indexes, caching, re-renders, bundles, Core Web Vitals. Use when reviewing API/UI performance or deploying at scale.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [file path, module, or description of code to audit]
---

# Performance Check

Systematic performance audit of frontend and backend code. Identify bottlenecks, missing optimizations, and scalability risks. Be specific and actionable.

## When to Activate

- Reviewing API endpoint or database query performance
- Investigating slow response times, janky scrolling, or poor Core Web Vitals
- Optimizing bundle size, rendering, or load times
- Adding or reviewing caching layers
- Before deploying database-heavy or user-facing features at scale

## Audit Workflow

1. Determine scope: backend-only, frontend-only, or full-stack
2. Run the relevant checklist — see [backend-checklist.md](references/backend-checklist.md) and/or [frontend-checklist.md](references/frontend-checklist.md)
3. For each finding, classify severity (Critical / Warning / Suggestion)
4. Quantify impact and provide specific fix with code pattern
5. Produce the output report below

## Severity Definitions

- **Critical**: Will cause outages or visibly degraded UX at current scale. E.g., N+1 on 10k+ row tables, render-blocking resources pushing LCP >4s, layout thrashing in scroll handlers.
- **Warning**: Noticeable under moderate load or on mid-range devices. E.g., missing indexes, no caching for hot data, unnecessary re-renders on every keystroke, unoptimized images >500KB.
- **Suggestion**: Worthwhile but not urgent. E.g., response compression, code-splitting rarely visited routes, replacing moment.js with date-fns, column selection over SELECT \*.

## Output Format

```markdown
### Strengths

[Acknowledge well-optimized patterns before highlighting problems.]

### Findings

#### Critical (Must Fix)

[Outage or visible UX degradation at current scale.]

#### Warning (Should Fix)

[Noticeable under moderate load or on mid-range devices.]

#### Suggestion (Nice to Have)

[Worthwhile but not urgent.]

**Per finding:**

- **Category**: Database | Caching | Async | HTTP | Scaling | Rendering | Bundle | Web Vitals | Network | Runtime
- **Location**: `file:line`
- **Issue**: What the performance problem is
- **Impact**: Quantified (e.g., "O(n) queries, ~200ms per 100 rows" or "re-renders 60x/sec during animation")
- **Fix**: Specific code change or pattern

### Prioritized Action List

[Ordered by impact.]

### Assessment

**Ready to deploy at scale?** [Yes / No / With fixes]
**Reasoning:** [1-2 sentence technical assessment]
```

## Rules

- Always include `file:line` references for every finding.
- Quantify impact — state complexity, estimate latency, reference table size, or cite Core Web Vitals thresholds.
- Suggest specific fixes with code patterns, not vague advice.
- Focus on bottlenecks with real production impact. Skip theoretical concerns in low-traffic paths.
- Don't recommend caching or memoizing everything — only for hot, stable data or expensive computations in hot paths.
- If running `EXPLAIN`, profiling, or bundle analysis via Bash, include output in findings.

## References

### Checklists

- [Backend checklist](references/backend-checklist.md) — database queries, connection pooling, caching, sync bottlenecks, HTTP/CDN, scaling
- [Frontend checklist](references/frontend-checklist.md) — rendering, bundles, Core Web Vitals, images, network, runtime

### Deep-Dive Patterns

- [Database & queries](references/backend-database.md) — indexing strategies, connection pooling, N+1, EXPLAIN usage
- [Caching & CDN](references/backend-caching.md) — cache-aside, write-through, invalidation, cache layers, CDN config
- [Scaling & infrastructure](references/backend-scaling.md) — load balancing, horizontal/vertical scaling, sharding, read replicas
- [Hot paths & memory](references/backend-hotpath.md) — memory leaks, hot path anti-patterns, async processing, monitoring

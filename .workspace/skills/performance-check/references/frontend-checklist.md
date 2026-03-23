# Frontend Performance Checklist

Quick-reference checklist for frontend audits. Each section includes key anti-patterns and fix patterns.

## 1. Rendering & Re-renders

- **Unnecessary re-renders**: Components re-rendering when props/state unchanged? Check inline object/array/function creation in JSX props.
- **Missing memoization on hot paths**: Expensive computations or frequently re-rendered components with stable props wrapped in `useMemo`/`React.memo`/`useCallback`?
- **Large component trees**: Deeply nested trees re-rendering from high-level state changes? Colocate state closer to usage.
- **Context overuse**: Single context causing unrelated consumers to re-render? Split by update frequency.

```tsx
// BAD: Inline object causes child re-render every time
<Chart options={{ animate: true }} data={data} />;

// GOOD: Stable reference
const chartOptions = useMemo(() => ({ animate: true }), []);
<Chart options={chartOptions} data={data} />;
```

## 2. Bundle Size & Code Splitting

- **Large bundles**: Main bundle excessively large? Unintended imports pulling entire libraries?
- **Missing code splitting**: Rarely visited routes lazy-loaded with `React.lazy`/dynamic `import()`?
- **Tree-shaking failures**: Barrel files (`index.ts` re-exports) defeating tree-shaking?
- **Heavy dependencies**: Large libraries replaceable with lighter alternatives (moment→date-fns, lodash→lodash-es)?

```typescript
// BAD: Imports entire library
import _ from 'lodash';
_.debounce(fn, 300);

// GOOD: Import only what's needed
import debounce from 'lodash/debounce';
debounce(fn, 300);
```

## 3. Core Web Vitals

- **LCP (<2.5s)**: Largest visible element loading fast? Check render-blocking resources, unoptimized hero images, slow server responses.
- **INP (<200ms)**: Interactions responsive? Check long tasks blocking main thread, heavy event handlers, synchronous layout reads.
- **CLS (<0.1)**: Elements shifting after load? Check images/iframes without dimensions, dynamically injected content above fold, fonts causing FOIT/FOUT.

## 4. Images & Media

- **Unoptimized images**: Served in modern formats (WebP/AVIF) and appropriately sized?
- **Missing lazy loading**: Below-the-fold images using `loading="lazy"`?
- **Missing dimensions**: `<img>`/`<video>` tags include explicit `width`/`height`?
- **No responsive images**: `srcset` and `sizes` used for different viewports?

## 5. Network & Loading

- **Waterfall requests**: API calls chained sequentially when parallelizable with `Promise.all`?
- **No prefetching**: Predictable navigation targets using `<link rel="prefetch">` or router prefetching?
- **Missing SSR/SSG**: Static/infrequently changing pages server-rendered to improve TTFB?
- **No stale-while-revalidate**: Data fetching libraries (React Query, SWR) showing cached data while refreshing?

## 6. Runtime Performance

- **Layout thrashing**: DOM reads and writes interleaved in loops, forcing repeated reflows?
- **Expensive scroll/resize handlers**: Listeners debounced/throttled? `passive: true` set?
- **Memory leaks**: Event listeners, timers, subscriptions cleaned up on unmount?
- **Main thread blocking**: CPU-intensive tasks offloaded to Web Workers?

```typescript
// BAD: Layout thrashing
elements.forEach((el) => {
  const height = el.offsetHeight; // read
  el.style.height = height + 10 + 'px'; // write — forces reflow
});

// GOOD: Batch reads then writes
const heights = elements.map((el) => el.offsetHeight);
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px';
});
```

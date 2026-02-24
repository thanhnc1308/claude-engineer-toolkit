# Next.js Architecture Rules

## App Router Structure

- Use App Router (Next.js 13+) for all new projects
- Organize routes by feature using route groups: `(marketing)`, `(dashboard)`, `(auth)`
- Each route segment gets its own directory with `page.tsx`, optional `layout.tsx`, `loading.tsx`, `error.tsx`
- Colocate components, utilities, and styles alongside the route they belong to

```
app/
├── layout.tsx              # Root layout (required)
├── page.tsx                # Home page
├── globals.css
├── (marketing)/
│   ├── layout.tsx          # Marketing layout
│   ├── page.tsx            # Marketing home
│   ├── about/page.tsx
│   └── pricing/page.tsx
├── (dashboard)/
│   ├── layout.tsx          # Dashboard layout (with auth)
│   ├── page.tsx
│   └── settings/page.tsx
├── api/
│   └── webhooks/route.ts   # Route handlers
└── _components/            # Shared components (underscore = not routable)
```

## Server vs Client Component Boundaries

Server Components are the default. Use Client Components only when necessary:

| Use Server Component when...           | Use Client Component when...                   |
| -------------------------------------- | ---------------------------------------------- |
| Fetching data                          | Using React hooks (useState, useEffect, etc.)  |
| Accessing backend resources directly   | Adding event handlers (onClick, onChange)      |
| Keeping sensitive data on the server   | Using browser APIs (localStorage, geolocation) |
| Reducing client-side JavaScript bundle | Using third-party client-only libraries        |
| SEO-critical content                   | Managing interactive form state                |

**Push `'use client'` to the leaves** — wrap only the interactive part in a Client Component and pass server-rendered content as children or props.

```typescript
// ✅ Good: Server Component with a small Client leaf
// app/products/page.tsx (Server Component)
export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div>
      <h1>Products</h1>
      {products.map((p) => (
        <ProductCard key={p.id} product={p}>
          <AddToCartButton productId={p.id} /> {/* Client Component */}
        </ProductCard>
      ))}
    </div>
  );
}

// ❌ Bad: Entire page as Client Component
'use client';
export default function ProductsPage() { /* ... */ }
```

## Rendering Strategies

Choose the right rendering strategy per page:

| Strategy          | When to use                                    | How                                                                                |
| ----------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Static (SSG)**  | Content rarely changes (blog, docs, marketing) | Default for pages without dynamic data                                             |
| **ISR**           | Content changes periodically                   | `fetch()` with `{ next: { revalidate: N } }`                                       |
| **Dynamic (SSR)** | Content changes per request (user-specific)    | `fetch()` with `{ cache: 'no-store' }` or `export const dynamic = 'force-dynamic'` |
| **Client-side**   | Non-SEO interactive content                    | `'use client'` + SWR/React Query                                                   |

## Data Fetching Principles

- **Fetch at the component level**, not in parent layouts — each component owns its data
- **Parallel fetching** — use `Promise.all()` to avoid request waterfalls
- **Deduplicate requests** — Next.js automatically deduplicates `fetch()` calls with the same URL
- **Cache by default** — use `revalidate` for ISR, `no-store` for dynamic data
- **Server Actions for mutations** — use `'use server'` functions for form submissions and data mutations

## Middleware

- Place `middleware.ts` at the project root (same level as `app/`)
- Use for authentication, redirects, headers, and geolocation
- Keep middleware lightweight — it runs on every matched request
- Use the `matcher` config to scope middleware to specific routes

## Configuration Principles

- Use `next.config.js` for framework configuration (images, redirects, headers)
- Use environment variables for runtime configuration (`NEXT_PUBLIC_*` for client, others for server-only)
- Never hardcode URLs — use environment variables for API endpoints
- Configure `images.remotePatterns` for external image domains

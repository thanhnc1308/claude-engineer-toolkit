---
name: nextjs-patterns
description: Next.js architecture patterns, code review checklist, refactoring catalog, and best practices. Use when working on Next.js projects, reviewing Next.js code, or applying Next.js-specific patterns.
---

# Next.js Development Patterns

Comprehensive Next.js knowledge base covering App Router architecture, Server/Client Components, data fetching, performance, SEO, and security.

## Reference Files

Detailed guidance is organized into reference files:

- **Architecture rules** — App Router structure, Server/Client Component boundaries, routing patterns, middleware, rendering strategies
  - **Reference:** `references/architecture.md`
- **Code review checklist** — Next.js-specific review checklist (routing, components, data fetching, performance, SEO, security, configuration)
  - **Reference:** `references/review-checklist.md`
- **Refactoring catalog** — Common Next.js anti-patterns with before/after TypeScript/JSX code
  - **Reference:** `references/refactoring-catalog.md`
- **Code generation** — Page, layout, route handler, and component scaffolding templates
  - **Reference:** `references/code-generation.md`

## Inline Patterns

The following sections contain detailed code examples for common Next.js patterns.

## Server Components (Default)

```typescript
// ✅ Server Component (default in App Router — no directive needed)
// Can use async/await, access databases, read files, fetch data
import { db } from '@/lib/db';

export default async function ProductsPage() {
  const products = await db.product.findMany();

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} — ${product.price}</li>
        ))}
      </ul>
    </main>
  );
}
```

## Client Components

```typescript
// ✅ Client Component — only when interactivity is needed
'use client';

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);
    await addToCart(productId);
    setIsPending(false);
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

## Data Fetching with Cache Control

```typescript
// ✅ Parallel data fetching to avoid waterfalls
async function Dashboard() {
  const [user, orders, stats] = await Promise.all([
    getUser(),
    getOrders(),
    getStats(),
  ]);

  return (
    <div>
      <UserProfile user={user} />
      <OrderList orders={orders} />
      <StatsPanel stats={stats} />
    </div>
  );
}

// ✅ Fetch with revalidation (ISR)
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  return res.json();
}

// ✅ No-store for dynamic data
async function getCurrentUser() {
  const res = await fetch('https://api.example.com/me', {
    cache: 'no-store',
  });
  return res.json();
}
```

## Server Actions

```typescript
// ✅ Server Action for mutations
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // Validate input
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }

  await db.post.create({ data: { title, content } });

  revalidatePath('/posts');
  redirect('/posts');
}
```

## Metadata API

```typescript
// ✅ Static metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products | My Store',
  description: 'Browse our product catalog',
  openGraph: {
    title: 'Products | My Store',
    description: 'Browse our product catalog',
    images: ['/og-products.png'],
  },
};

// ✅ Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  return {
    title: `${product.name} | My Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      images: [product.imageUrl],
    },
  };
}
```

## Image Optimization

```typescript
// ✅ Optimized image with next/image
import Image from 'next/image';

export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={400}
        height={300}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
      />
      <h3>{product.name}</h3>
    </div>
  );
}
```

## Loading and Error States

```typescript
// app/products/loading.tsx — Streaming with Suspense
export default function Loading() {
  return <ProductsSkeleton />;
}

// app/products/error.tsx — Error boundary
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/not-found.tsx — 404 page
export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>Could not find the requested resource.</p>
    </div>
  );
}
```

## Route Handlers

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  const products = await db.product.findMany({
    where: category ? { category } : undefined,
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validate input
  if (!body.name || !body.price) {
    return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
  }

  const product = await db.product.create({ data: body });
  return NextResponse.json(product, { status: 201 });
}
```

## Middleware

```typescript
// middleware.ts (root of project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Authentication check
  const token = request.cookies.get('session')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

**Remember**: Next.js App Router uses Server Components by default — prefer server-side rendering and data fetching, push `'use client'` to the leaves of the component tree, and leverage the Metadata API for SEO.

# Next.js Refactoring Catalog

Common Next.js refactoring patterns with before/after examples. Use when improving code structure without changing functionality.

## 1. Convert Client Component to Server Component

```typescript
// Before: Unnecessary Client Component for static content
'use client';

import { useEffect, useState } from 'react';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  if (!posts.length) return <p>Loading...</p>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// After: Server Component with direct data access
import { db } from '@/lib/db';

export default async function BlogPage() {
  const posts = await db.post.findMany();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## 2. Push 'use client' to Leaves

```typescript
// Before: Entire page is a Client Component
'use client';

import { useState } from 'react';

export default function ProductPage({ product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.image} alt={product.name} />
      <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <button onClick={() => addToCart(product.id, quantity)}>Add to Cart</button>
    </div>
  );
}

// After: Server Component with Client leaf
// app/products/[id]/page.tsx (Server Component)
import Image from 'next/image';
import { QuantitySelector } from './quantity-selector';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <Image src={product.image} alt={product.name} width={600} height={400} />
      <QuantitySelector productId={product.id} />
    </div>
  );
}

// quantity-selector.tsx (Client Component — leaf)
'use client';

import { useState } from 'react';

export function QuantitySelector({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <button onClick={() => addToCart(productId, quantity)}>Add to Cart</button>
    </div>
  );
}
```

## 3. Replace useEffect Data Fetching with Server Actions

```typescript
// Before: Client-side form with useEffect + fetch
'use client';

import { useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    setStatus(res.ok ? 'Sent!' : 'Failed');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
      {status && <p>{status}</p>}
    </form>
  );
}

// After: Server Action with useActionState
'use client';

import { useActionState } from 'react';
import { submitContact } from './actions';

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send'}
      </button>
      {state?.error && <p>{state.error}</p>}
      {state?.success && <p>Message sent!</p>}
    </form>
  );
}

// actions.ts
'use server';

export async function submitContact(_prev: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!email || !message) {
    return { error: 'All fields are required' };
  }

  await db.contact.create({ data: { email, message } });
  return { success: true };
}
```

## 4. Replace Raw img/a with Next.js Components

```typescript
// Before: Unoptimized HTML elements
export function Header() {
  return (
    <header>
      <a href="/">
        <img src="/logo.png" alt="Logo" />
      </a>
      <nav>
        <a href="/about">About</a>
        <a href="/products">Products</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
}

// After: Optimized Next.js components
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header>
      <Link href="/">
        <Image src="/logo.png" alt="Logo" width={120} height={40} priority />
      </Link>
      <nav>
        <Link href="/about">About</Link>
        <Link href="/products">Products</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
```

## 5. Fix Data Fetching Waterfalls

```typescript
// Before: Sequential data fetching (waterfall)
export default async function DashboardPage() {
  const user = await getUser();
  const orders = await getOrders(user.id);  // Waits for user
  const recommendations = await getRecommendations(user.id);  // Waits for orders

  return (
    <div>
      <UserProfile user={user} />
      <OrderList orders={orders} />
      <Recommendations items={recommendations} />
    </div>
  );
}

// After: Parallel data fetching
export default async function DashboardPage() {
  const user = await getUser();

  // These don't depend on each other — fetch in parallel
  const [orders, recommendations] = await Promise.all([
    getOrders(user.id),
    getRecommendations(user.id),
  ]);

  return (
    <div>
      <UserProfile user={user} />
      <OrderList orders={orders} />
      <Recommendations items={recommendations} />
    </div>
  );
}
```

## 6. Extract Metadata from Head Component

```typescript
// Before: Pages Router Head component
import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | My Site</title>
        <meta name="description" content="Learn about our company" />
        <meta property="og:title" content="About Us" />
        <meta property="og:image" content="/og-about.png" />
      </Head>
      <main>
        <h1>About Us</h1>
      </main>
    </>
  );
}

// After: App Router Metadata API
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | My Site',
  description: 'Learn about our company',
  openGraph: {
    title: 'About Us',
    images: ['/og-about.png'],
  },
};

export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
    </main>
  );
}
```

## 7. Add Streaming with Suspense

```typescript
// Before: Entire page blocked until all data loads
export default async function ProductsPage() {
  const products = await getProducts();      // Slow query
  const categories = await getCategories();  // Fast query

  return (
    <div>
      <CategoryFilter categories={categories} />
      <ProductGrid products={products} />
    </div>
  );
}

// After: Stream slow content with Suspense
import { Suspense } from 'react';

export default async function ProductsPage() {
  const categories = await getCategories(); // Fast — render immediately

  return (
    <div>
      <CategoryFilter categories={categories} />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid /> {/* Async Server Component streams in when ready */}
      </Suspense>
    </div>
  );
}

async function ProductGrid() {
  const products = await getProducts(); // Slow — streamed in
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
```

## Refactoring Guidelines

1. **Preserve Functionality**: Never change external behavior — refactoring improves internal structure only
2. **Incremental Changes**: Migrate one page or component at a time
3. **Test First**: Ensure tests exist before refactoring. If missing, add them first
4. **Version Control**: Commit after each successful refactoring step
5. **Check Hydration**: After moving components between Server/Client, verify no hydration mismatches

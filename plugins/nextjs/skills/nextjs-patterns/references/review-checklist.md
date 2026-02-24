# Next.js Code Review Checklist

Apply this checklist when reviewing Next.js code, alongside the standard code review checklist.

## 1. Routing & Structure

- Are App Router conventions followed (page.tsx, layout.tsx, route.ts)?
- Are route groups used appropriately for layout sharing?
- Are dynamic routes and catch-all segments typed correctly?
- Is middleware placed at the project root with a scoped `matcher`?
- Are parallel routes or intercepting routes used where beneficial?

## 2. Server vs Client Components

- Are Server Components used by default?
- Is `'use client'` only added where interactivity is required?
- Is `'use client'` pushed to the leaves of the component tree?
- Are there no client-only APIs (useState, useEffect) in Server Components?
- Are async/await used correctly in Server Components?
- Is server-rendered content passed as children/props to Client Components?

## 3. Data Fetching

- Is the appropriate rendering strategy (SSG, ISR, SSR, CSR) used per page?
- Are there no data fetching waterfalls (parallel fetching with `Promise.all`)?
- Are `fetch` cache options properly configured (`revalidate`, `no-store`)?
- Are revalidation strategies properly configured?
- Are loading states handled with `loading.tsx` or Suspense boundaries?
- Are error boundaries properly implemented with `error.tsx`?
- Are Server Actions used for mutations instead of API routes?

## 4. Performance

- Do images use `next/image` with explicit `width`, `height`, and `alt`?
- Are fonts loaded with `next/font` (no external font stylesheets)?
- Do third-party scripts use `next/script` with proper loading strategy?
- Is dynamic `import()` used for heavy components (code splitting)?
- Does `next/link` handle navigation (no raw `<a>` tags for internal links)?
- Is the client bundle size reasonable (no large libraries in Client Components)?
- Are unnecessary `'use client'` directives removed to reduce bundle?
- Are above-the-fold images marked with `priority`?
- Are appropriate `sizes` attributes set for responsive images?

## 5. SEO & Metadata

- Is the Metadata API used correctly (static `metadata` or `generateMetadata`)?
- Do all pages have a title and description?
- Are OpenGraph and Twitter Card tags configured?
- Are sitemap.xml and robots.txt generated (`app/sitemap.ts`, `app/robots.ts`)?
- Is structured data (JSON-LD) added where appropriate?
- Is there a proper heading hierarchy (single `<h1>`, ordered headings)?
- Do all images have descriptive `alt` text?

## 6. TypeScript & Type Safety

- Are page props properly typed (params, searchParams)?
- Are route parameters typed correctly?
- Are Route Handler request/response types explicit?
- Are Next.js types used (Metadata, NextRequest, NextResponse)?
- Is there no unjustified use of `any`?

## 7. Security

- Do public env vars use the `NEXT_PUBLIC_` prefix?
- Is sensitive data not exposed in the client bundle?
- Are API routes / Route Handlers authenticated and authorized?
- Is input validated on forms and API routes?
- Are secure headers configured in `next.config.js`?
- Are environment variables used instead of hardcoded URLs/secrets?

## 8. Configuration

- Is `next.config.js` properly configured?
- Are `images.remotePatterns` set for external image domains?
- Is the output mode appropriate for the deployment target?
- Are redirects and rewrites configured in `next.config.js` (not in code)?

## Output Format

For each Next.js-specific finding:

- **Severity**: Critical / Warning / Suggestion
- **Location**: File and line
- **Issue**: What's wrong
- **Fix**: How to fix it, with Next.js-idiomatic code example

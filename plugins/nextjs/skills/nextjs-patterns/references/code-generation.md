# Next.js Code Generation

Guidelines for generating Next.js boilerplate code following project conventions.

## Before Generating

1. **Explore existing patterns** — Read at least 2-3 existing pages/components to understand the project's conventions
2. **Identify conventions** — Note naming patterns, styling approach (Tailwind, CSS Modules, etc.), data fetching patterns
3. **Check shared components** — Find existing shared UI components, utilities, or layouts to reuse

## Page Structure Template

For a new App Router page with related components:

```
app/<route>/
├── page.tsx                # Page component (Server Component)
├── layout.tsx              # Layout (optional — if this route needs its own layout)
├── loading.tsx             # Loading UI (Suspense fallback)
├── error.tsx               # Error boundary
├── not-found.tsx           # 404 page (optional)
├── _components/            # Colocated components (underscore = not routable)
│   ├── feature-form.tsx    # Client Component for interactivity
│   └── feature-list.tsx    # Server or Client Component
└── actions.ts              # Server Actions for mutations
```

## Route Handler Template

```
app/api/<resource>/
├── route.ts                # GET, POST handlers
└── [id]/
    └── route.ts            # GET, PUT, PATCH, DELETE handlers
```

## Component Conventions

- **Server Components**: No directive, use `async function`, fetch data directly
- **Client Components**: Add `'use client'` at the top, use hooks and event handlers
- **Naming**: PascalCase for components, kebab-case for file names
- **Exports**: Default export for pages/layouts, named exports for reusable components

## Code Standards

- Use `next/image` for all images (set `width`, `height`, `alt`)
- Use `next/link` for all internal navigation
- Use `next/font` for font loading
- Use the Metadata API for SEO (static `metadata` export or `generateMetadata`)
- Use Server Actions for form mutations
- Apply TypeScript strictly — type all props, params, and API responses
- Handle loading states with `loading.tsx` or `<Suspense>`
- Handle errors with `error.tsx`

## Process

1. Explore existing pages/components for project patterns
2. Generate files one at a time, following the project's established conventions
3. Add the page to any navigation components if applicable
4. Add metadata for SEO
5. Add loading and error states

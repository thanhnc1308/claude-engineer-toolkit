---
name: code-review
description: Review commits diverged from main/master using parallel specialized agents (code quality, security, performance, error handling). Use when completing features, before merging, or when asked to review current branch changes.
---

# Code Review

Review all commits on the current branch that diverge from the base branch (main or master), using parallel specialized agents.

## Workflow

### Step 1: Detect Base Branch and Gather Diff

Detect the base branch and collect diff data:

```bash
# Detect base branch
git rev-parse --verify main >/dev/null 2>&1 && BASE=main || BASE=master

# Ensure up-to-date base reference
git fetch origin $BASE 2>/dev/null || true

# Get changed files
git diff origin/$BASE...HEAD --name-only

# Get full diff
git diff origin/$BASE...HEAD

# Get commit log
git log origin/$BASE...HEAD --oneline
```

If no diverged commits exist, inform the user and stop.

### Step 2: Determine Applicable Reviews

Based on changed files, determine which reviews apply:

- **Always run**: **code-reviewer** — code quality, patterns, bugs, CLAUDE.md compliance
- **Always run**: **security-scanner** — injection, secrets, auth bypass, OWASP Top 10 (uses `security-audit` skill)
- **Always run**: **performance-reviewer** — N+1 queries, missing indexes, caching, blocking, unbounded queries (uses `performance-check` skill)
- **If error handling changed**: **silent-failure-hunter** — silent failures, empty catch blocks, missing error logging
- **If NestJS code changed**: **nestjs-reviewer** — module architecture, DI patterns, guards/pipes/interceptors, NestJS-idiomatic practices
- **If Next.js code changed**: **nextjs-reviewer** — App Router, Server/Client Components, data fetching, Server Actions, Next.js anti-patterns
- **If PHP code changed**: **php-reviewer** — DDD architecture, DI patterns, PHP 8.3+ usage, Doctrine, Silex/Symfony-idiomatic practices
- **If database code changed**: **database-reviewer** — query optimization, schema design, indexing, security, PostgreSQL/MongoDB best practices

To detect error handling changes, check if the diff contains patterns like `catch`, `try`, `except`, `.catch(`, `on_error`, `fallback`, `rescue`.

To detect NestJS code, check if changed files import from `@nestjs/` or are in directories with NestJS conventions (`.module.ts`, `.controller.ts`, `.service.ts`, `.guard.ts`, `.interceptor.ts`, `.pipe.ts`, `.filter.ts`, `.decorator.ts`).

To detect Next.js code, check if changed files are under `app/` directory (App Router pages, layouts, routes), or import from `next/`, or include files like `next.config.*`, `middleware.ts`.

To detect PHP code, check if changed files have `.php` extension or are in directories with PHP conventions (`composer.json`, `src/`, `config/`).

To detect database code, check if changed files contain SQL queries (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`), database migration files (under `migrations/`, `db/`, or `prisma/`), ORM model definitions (Prisma schema, TypeORM/Sequelize/Drizzle entities, Mongoose models), or imports from database libraries (`pg`, `prisma`, `knex`, `sequelize`, `drizzle`, `typeorm`, `mongoose`, `mongodb`, `@supabase/supabase-js`).

### Step 3: Dispatch Agents in Parallel

Launch all applicable review agents **in parallel** using the Agent tool. Pass each agent:

- The full diff (from `git diff origin/$BASE...HEAD`)
- The list of changed files
- The commit log for context

Each agent returns findings as a structured list with severity (critical/important/suggestion) and `file:line` references.

### Step 4: Code Simplifier (Post-Review Polish)

After all review agents complete and if **no critical issues** found, launch **code-simplifier** agent to suggest clarity and readability improvements on the changed code.

### Step 5: Aggregate and Present Results

Collect all agent results into a single summary. See `references/output-format.md` for the template.

**Severity ordering:** Critical > Important > Suggestion > Strengths

### Step 6: User Decision

Present the summary and ask:

- **If issues found**: "Would you like me to fix these issues?"
- **If no issues**: "No issues found. The branch looks good!"

## References

- Output format and template: `references/output-format.md`
- Review checklist details: `references/review-checklist.md`
- Agent dispatch instructions: `references/agent-dispatch.md`

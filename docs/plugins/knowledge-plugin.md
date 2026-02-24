# Knowledge Plugin Pattern

A knowledge plugin is a **skills-only plugin** that stores domain-specific patterns and best practices. It contains no agents or commands — generic agents and skills discover and apply its knowledge automatically based on the project's technology stack.

## Problem

Framework-specific plugins tend to duplicate generic counterparts. For example, a NestJS plugin might have a `nestjs-code-reviewer` agent that duplicates the generic `code-reviewer`, or a `nestjs-review` skill that duplicates the generic `code-review` skill. This creates:

- Maintenance burden — two places to update review logic
- User confusion — which reviewer to use?
- Inconsistency — generic and framework-specific reviewers drift apart

## Solution

Strip the plugin down to a single knowledge skill with a `references/` directory. Generic agents and skills detect the project's tech stack and read relevant knowledge from installed plugins.

## Structure

```
plugins/<framework>/
├── .claude-plugin/plugin.json
└── skills/
    └── <framework>-patterns/
        ├── SKILL.md                    # Overview + index of references
        └── references/
            ├── architecture.md         # Architecture rules and design principles
            ├── dependency-injection.md  # DI patterns (if applicable)
            ├── module-organization.md   # File structure and module conventions
            ├── review-checklist.md      # Framework-specific code review checklist
            ├── refactoring-catalog.md   # Common refactoring patterns with before/after code
            └── code-generation.md       # Scaffolding templates and conventions
```

### plugin.json

Only the `skills` field — no `agents` or `commands`:

```json
{
  "name": "<framework>",
  "version": "1.0.0",
  "description": "<Framework> architecture, patterns, and best practices",
  "license": "MIT",
  "keywords": ["<framework>", "backend"],
  "skills": "./skills/"
}
```

### SKILL.md

Serves as an index that lists all reference files, plus optional inline patterns for frequently used code examples:

```markdown
---
name: <framework>-patterns
description: <Framework> architecture patterns, code review checklist, refactoring catalog, and best practices. Use when working on <Framework> projects, reviewing <Framework> code, or applying <Framework>-specific patterns.
---

# <Framework> Development Patterns

## Reference Files

- **Architecture rules** — ...
  - **Reference:** `references/architecture.md`
- **Code review checklist** — ...
  - **Reference:** `references/review-checklist.md`
- **Refactoring catalog** — ...
  - **Reference:** `references/refactoring-catalog.md`

## Inline Patterns

[Detailed code examples for the most common patterns]
```

## How Generic Skills Discover Knowledge

The generic `code-review` skill includes a "Technology-Specific Patterns" section that instructs the reviewer to:

1. Check `package.json` (or equivalent) to identify frameworks in use
2. Look for matching plugin patterns in `plugins/*/skills/*/references/`
3. Read and apply relevant review checklists and patterns alongside the standard checklist

This approach is **scalable** — adding a new framework plugin automatically makes its patterns available to all generic skills without modifying them.

## What Goes Where

| Content                                       | Location                             | Why                                                  |
| --------------------------------------------- | ------------------------------------ | ---------------------------------------------------- |
| Architecture rules, design principles         | `references/architecture.md`         | Foundational knowledge read during design and review |
| Framework-specific DI patterns                | `references/dependency-injection.md` | Referenced during review and refactoring             |
| File/module structure conventions             | `references/module-organization.md`  | Referenced during scaffolding and review             |
| Code review checklist                         | `references/review-checklist.md`     | Read by the generic `code-review` skill              |
| Refactoring patterns (before/after)           | `references/refactoring-catalog.md`  | Read by the generic refactoring skill                |
| Scaffolding templates                         | `references/code-generation.md`      | Referenced when generating boilerplate               |
| Common code examples (API, DB, auth, caching) | Inline in `SKILL.md`                 | Frequently referenced, kept close to the index       |

## What Does NOT Belong in a Knowledge Plugin

- **Agents** that duplicate generic ones (code-reviewer, architect, refactor) — use the generic agents instead and let them read the knowledge plugin's patterns
- **Commands** that invoke duplicate skills — if the generic skill handles it, no need for a framework-specific command
- **Skills** that are just a subset of the generic skill with framework-specific content — consolidate into the `references/` directory instead

## Example: NestJS Knowledge Plugin

```
plugins/nestjs/
├── .claude-plugin/plugin.json
└── skills/
    └── nestjs-patterns/
        ├── SKILL.md                    # Index + inline API/DB/caching/auth/logging patterns
        └── references/
            ├── architecture.md         # Module organization, layer separation, design principles
            ├── dependency-injection.md  # Constructor injection, scopes, custom providers
            ├── module-organization.md   # Feature modules, DTOs, shared/global modules, testing
            ├── review-checklist.md      # 6-category NestJS review checklist
            ├── refactoring-catalog.md   # 7 refactoring patterns with before/after TypeScript
            └── code-generation.md       # Module structure template, code standards
```

When the generic `code-reviewer` agent reviews a NestJS project (detects `@nestjs/core` in `package.json`), it reads `nestjs-patterns` and applies `references/review-checklist.md` alongside the standard review checklist.

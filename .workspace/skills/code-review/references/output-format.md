# Review Output Format

Present aggregated review results in this format:

```markdown
# Branch Review Summary: <branch-name> (N commits ahead of <base>)

## Critical Issues (must fix)

- [<Category>] Description — `file:line`

## Important Issues (should fix)

- [<Category>] Description — `file:line`

## Suggestions (nice to have)

- [<Category>] Description — `file:line`

## Strengths

- What's well-done in this branch
```

## Category Tags

Use these tags to identify the source agent:

- `[Code Quality]` — from code-reviewer
- `[Security]` — from security-scanner
- `[Performance]` — from performance-reviewer
- `[Error Handling]` — from silent-failure-hunter
- `[Simplification]` — from code-simplifier

## Rules

- Deduplicate findings across agents — if two agents flag the same issue, keep the more detailed one
- Preserve `file:line` references from agents
- Order by severity, then alphabetically by category within each severity
- Include agent-provided fix suggestions inline when available
- If no issues in a severity level, omit that section entirely
- Always include Strengths section — acknowledge good patterns

## Example

```markdown
# Branch Review Summary: feature/add-auth (4 commits ahead of main)

## Critical Issues (must fix)

- [Security] Hardcoded API key in config — `src/config.ts:15`
- [Code Quality] Unhandled promise rejection crashes server — `src/api/handler.ts:42`

## Important Issues (should fix)

- [Performance] N+1 query in user list endpoint — `src/api/users.ts:28`
  Fix: Use `JOIN` or batch query with `WHERE id IN (...)`
- [Error Handling] Empty catch block swallows database errors — `src/db/client.ts:55`

## Suggestions (nice to have)

- [Simplification] Nested ternary can be replaced with switch — `src/utils/format.ts:12`

## Strengths

- Clean separation of auth middleware from route handlers
- Comprehensive test coverage for new endpoints (12 tests)
```

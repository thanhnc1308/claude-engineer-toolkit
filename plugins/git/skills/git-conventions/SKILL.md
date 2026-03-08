---
name: git-conventions
description: Git commit message conventions using Conventional Commits format. Use when writing commit messages, creating pull requests, or reviewing git history for consistency.
version: 1.0.0
---

# Git Conventions

Standardized git commit message and PR title conventions based on Conventional Commits.

## Quick Reference

All commit messages and PR titles MUST follow Conventional Commits format:

```
<type>(<scope>): <description>
```

### Types

| Type       | Purpose                                    |
| ---------- | ------------------------------------------ |
| `feat`     | New feature                                |
| `fix`      | Bug fix                                    |
| `refactor` | Code restructuring without behavior change |
| `docs`     | Documentation changes                      |
| `test`     | Adding or updating tests                   |
| `chore`    | Build, CI, tooling changes                 |
| `perf`     | Performance improvements                   |
| `ci`       | CI workflow changes                        |

### Writing Rules

1. **Imperative mood**: "add feature" not "added feature"
2. **Subject line**: Under 72 characters
3. **Body**: Explain **why**, not **what** (the diff shows what)
4. **Atomic commits**: One logical change per commit
5. **Split commits**: If there are new files and file changes at the same time, split them into separate commits

### Special Rules for `.claude/` Directory

- Changes to existing Markdown files: use `perf:` (not `docs:`)
- New files: use `feat:` (not `docs:` or `perf:`)

### AI Attribution

**NEVER** add AI attribution signatures (e.g., "Generated with Claude Code", "Co-Authored-By: Claude").

### JIRA Ticket Footer

When a JIRA ticket is provided, add it as a footer:

```
feat(auth): add SSO login support

Refs: PROJ-1234
```

## Detailed Reference

For the full conventions specification, see [references/conventions.md](references/conventions.md).

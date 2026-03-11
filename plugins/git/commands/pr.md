---
description: Create a pull request
allowed-tools: Bash(git checkout --branch:*), Bash(git add:*), Bash(git status:*), Bash(git push:*), Bash(git commit:*), Bash(gh pr create:*)
argument-hint: [to-branch] [from-branch]
---

## Variables

TO_BRANCH: $1 (defaults to `main`)
FROM_BRANCH: $2 (defaults to current branch)

## Workflow

1. Run `git log` and `git diff {TO_BRANCH}...{FROM_BRANCH}` to understand all changes since the branch diverged.
2. Generate a concise summary of the changes (what was added, changed, or fixed).
3. Use `gh pr create --draft --assignee @me` to create a **draft** pull request assigned to yourself from {FROM_BRANCH} to {TO_BRANCH} with:
   - A short, descriptive title following the conventions below (under 70 characters)
   - A description body that includes a `## Summary` section with the generated summary

## Notes

- If `gh` command is not available, instruct the user to install and authorize GitHub CLI first.
- Always create as draft — never create a ready-for-review PR.
- You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.

## Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring without behavior change
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `chore`: Build, CI, tooling changes
- `perf`: Performance improvements
- `ci`: CI workflow changes

### Special rules for `.claude/` directory

- Changes to existing Markdown files in `.claude/` should use `perf:` (instead of `docs:`)
- New files in `.claude/` directory should use `feat:` (instead of `docs:` or `perf:`)

### Writing rules

- Write in imperative mood: "add feature" not "added feature"
- Keep the subject line under 72 characters
- Separate subject from body with a blank line
- Use the body to explain **why**, not **what** (the diff shows what)
- Make atomic commits — one logical change per commit
- If there are new files and file changes at the same time, split them into separate commits

### JIRA ticket as scope

When a JIRA ticket is provided, use it as the scope:

```
feat(PROJ-1234): add SSO login support
```

When no JIRA ticket is provided, use a semantic scope (e.g., `auth`, `api`, `ui`).

### AI attribution

**NEVER** automatically add AI attribution signatures like:

- "Generated with [Claude Code]"
- "Co-Authored-By: Claude noreply@anthropic.com"
- Any AI tool attribution or signature

---
description: Stage all files and create a commit.
allowed-tools: Bash(git add:*), Bash(git commit:*)
arguments:
  - name: ticket
    description: JIRA ticket number (e.g., PROJ-1234). Overrides ticket extracted from branch name.
    required: false
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes

1. Review for commit secrets, credentials, or environment files (dotenv, API keys, database credentials, etc.). **NEVER** commit without asking the user.

2. Extract the JIRA ticket:
   - If `$ARGUMENTS.ticket` is provided, use it
   - Otherwise, extract from the current branch name in Context above (e.g., `feature/PROJ-123-add-login` → `PROJ-123`)

3. Generate a commit message following the **Ticket-first commit format** below.

4. Stage relevant files and commit using: `git commit -m "commit_message"`. You have the capability to call multiple tools in a single response. Stage and create the commit using a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.

**IMPORTANT: DO NOT push the changes to remote repository.**

## Ticket-first Commit Format

When a JIRA ticket is found (from argument or branch name):

```
[TICKET-ID] <type>(<scope>): <description>

[optional body]

[optional footer]
```

When no JIRA ticket is available:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Examples:

```
[PROJ-123] fix(auth): resolve token expiry not refreshing
[DATA-456] feat(api): add bulk export endpoint
refactor(utils): simplify date parsing logic
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

### JIRA ticket extraction

1. If `$ARGUMENTS.ticket` is provided, use it directly
2. Otherwise, check the branch name for a JIRA ticket pattern (e.g., `feature/PROJ-123-description`, `PROJ-123/fix-bug`, `bugfix/PROJ-123`)
3. If a ticket is found, prefix the subject line with `[TICKET-ID]` and use a semantic scope (e.g., `auth`, `api`, `ui`)
4. If no ticket is found, omit the prefix and use a semantic scope

### AI attribution

**NEVER** automatically add AI attribution signatures like:

- "Generated with [Claude Code]"
- "Co-Authored-By: Claude noreply@anthropic.com"
- Any AI tool attribution or signature

---
description: Create a pull request
allowed-tools: Bash(git log:*), Bash(git diff:*), Bash(git push:*), Bash(gh pr create:*)
arguments:
  - name: base
    description: Target branch for the PR (e.g., main, master, develop)
    required: false
  - name: head
    description: Source branch for the PR. Defaults to the current branch.
    required: false
---

## Context

- Current branch: !`git branch --show-current`

## Workflow

1. Determine the base branch: use `$ARGUMENTS.base` if provided, otherwise default to `main`.
2. Determine the head (source) branch: use `$ARGUMENTS.head` if provided, otherwise use the current branch from Context above.
3. Push the head branch to the remote: run `git push -u origin <head>` to ensure the remote branch exists and is up to date.
4. Run `git log --oneline <base>..<head>` and `git diff <base>...<head>` to review the changes since the branch diverged.
5. Extract the JIRA ticket from the current branch name in Context above (e.g., `feature/PROJ-123-add-login` → `PROJ-123`) or from user input if provided.
6. Generate a concise summary of the changes (what was added, changed, or fixed).
7. Use `gh pr create --draft --assignee @me` to create a **draft** pull request assigned to yourself from the head branch to the base branch with:
   - A short, descriptive title following the **Ticket-first commit format** below (under 70 characters)
   - A description body that includes a `## Summary` section with the generated summary

## Notes

- If `gh` command is not available, instruct the user to install and authorize GitHub CLI first.
- Always create as draft — never create a ready-for-review PR.
- You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.

## Ticket-first Commit Format

When a JIRA ticket is found (from branch name or user input):

```
[TICKET-ID] <type>(<scope>): <description>
```

When no JIRA ticket is available:

```
<type>(<scope>): <description>
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

### Writing rules

- Write in imperative mood: "add feature" not "added feature"
- Keep the subject line under 72 characters
- Separate subject from body with a blank line
- Use the body to explain **why**, not **what** (the diff shows what)
- Make atomic commits — one logical change per commit
- If there are new files and file changes at the same time, split them into separate commits

### JIRA ticket extraction

1. Check the branch name for a JIRA ticket pattern (e.g., `feature/PROJ-123-description`, `PROJ-123/fix-bug`, `bugfix/PROJ-123`)
2. If not found in the branch name, check if the user provided one
3. If a ticket is found, prefix the title with `[TICKET-ID]` and use a semantic scope (e.g., `auth`, `api`, `ui`)
4. If no ticket is found, omit the prefix and use a semantic scope

### AI attribution

**NEVER** automatically add AI attribution signatures like:

- "Generated with [Claude Code]"
- "Co-Authored-By: Claude noreply@anthropic.com"
- Any AI tool attribution or signature

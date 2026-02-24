---
description: Create a pull request
argument-hint: [to-branch] [from-branch]
---

## Variables

TO_BRANCH: $1 (defaults to `main`)
FROM_BRANCH: $2 (defaults to current branch)

## Workflow

1. Run `git log` and `git diff {TO_BRANCH}...{FROM_BRANCH}` to understand all changes since the branch diverged.
2. Generate a concise summary of the changes (what was added, changed, or fixed).
3. Use `gh pr create --draft` to create a **draft** pull request from {FROM_BRANCH} to {TO_BRANCH} with:
   - A short, descriptive title (under 70 characters)
   - A description body that includes a `## Summary` section with the generated summary

## Notes

- If `gh` command is not available, instruct the user to install and authorize GitHub CLI first.
- Always create as draft — never create a ready-for-review PR.

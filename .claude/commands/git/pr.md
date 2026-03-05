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
3. Use `gh pr create --draft` to create a **draft** pull request from {FROM_BRANCH} to {TO_BRANCH} with:
   - A short, descriptive title (under 70 characters)
   - A description body that includes a `## Summary` section with the generated summary

## Notes

- If `gh` command is not available, instruct the user to install and authorize GitHub CLI first.
- Always create as draft — never create a ready-for-review PR.
- You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.

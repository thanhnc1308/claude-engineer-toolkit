---
description: Stage all files and create a commit.
allowed-tools: Bash(git *)
arguments:
  - name: ticket
    description: JIRA ticket number (e.g., PROJ-1234). If provided, added as "Refs: <ticket>" in the commit footer.
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

2. Generate a commit message following the git conventions rule.

   **JIRA ticket:**
   - If `$ARGUMENTS.ticket` is provided, add `Refs: $ARGUMENTS.ticket` as the commit footer
   - Example: `Refs: PROJ-1234`

3. Stage relevant files and commit using: `git commit -m "commit_message"`. You have the capability to call multiple tools in a single response. Stage and create the commit using a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.

**IMPORTANT: DO NOT push the changes to remote repository.**

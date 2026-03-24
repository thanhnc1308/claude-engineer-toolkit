---
description: Analyze Github Actions logs and fix issues
argument-hint: [github-actions-url-or-run-id]
allowed-tools: Bash(gh:*), Read, Write, Edit, Grep, Glob, Agent
model: sonnet
---

Analyze a failed GitHub Actions run and fix the issues.

**Input:** $ARGUMENTS

## Steps

1. If no URL or run ID is provided, ask the user before proceeding.

2. Parse the input to extract the repository (`owner/repo`) and run ID:
   - Full URL: `https://github.com/owner/repo/actions/runs/12345` → repo=`owner/repo`, run=`12345`
   - Run ID only: use the current repo from `gh repo view --json nameWithOwner -q .nameWithOwner`

3. Spawn the `log-tracer` agent to fetch failed logs, identify root causes, and propose a fix plan.

4. Present the analysis and proposed fixes to the user.

5. **IMPORTANT:** Ask the user for confirmation before implementing any changes.

6. After confirmation, implement the fixes. Then verify by running the relevant checks locally (e.g., lint, test, build) before suggesting a re-trigger of the CI run.

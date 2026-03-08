---
description: 'Review a GitHub PR with parallel specialized agents, then post comments or approve'
argument-hint: '<pr-url>'
allowed-tools: ['Bash', 'Glob', 'Grep', 'Read', 'Agent']
---

# PR Review Command

Review a GitHub pull request using multiple specialized agents in parallel, present findings for user approval, then post comments or approve.

**PR URL:** "$ARGUMENTS"

## Workflow

### Step 1: Parse PR URL and Fetch PR Data

Extract the owner, repo, and PR number from the provided URL argument.

- The URL format is: `https://github.com/{owner}/{repo}/pull/{number}`
- If no URL is provided, try `gh pr view --json url` to get the current branch's PR
- If still no PR found, ask the user to provide a PR URL

Fetch PR data using the `gh` CLI:

- `gh pr diff <number> --repo <owner>/<repo>` — full diff
- `gh pr view <number> --repo <owner>/<repo> --json title,body,additions,deletions,changedFiles` — PR metadata

### Step 2: Identify Changed Files and Determine Applicable Reviews

Run `gh pr diff <number> --repo <owner>/<repo> --name-only` to get the list of changed files, then determine which reviews apply:

- **Always run**: **code-reviewer** (general code quality, CLAUDE.md compliance, bugs)
- **Always run**: **security-reviewer** (injection vulnerabilities, hardcoded secrets, auth bypass, OWASP Top 10, unsafe crypto — uses `security-audit` skill)
- **Always run**: **performance-reviewer** (N+1 queries, missing indexes, poor caching, synchronous blocking, unbounded queries — uses `performance-check` skill)
- **If test files changed**: **pr-test-analyzer** (behavioral coverage, critical gaps, test quality)
- **If comments/docs added**: **code-comment-analyzer** (comment accuracy, comment rot, documentation completeness)
- **If error handling changed**: **silent-failure-hunter** (silent failures, empty catch blocks, missing error logging)
- **If types added/modified**: **type-design-analyzer** (type encapsulation, invariant expression, type design quality)

### Step 3: Dispatch Applicable Agents in Parallel

Launch all applicable review agents **in parallel** using the Agent tool. Pass each agent the full PR diff and changed file list as context. Each agent must return findings as a structured list with severity (critical/important/suggestion) and file:line references.

### Step 4: Run Code Simplifier (Post-Review Polish)

After all review agents complete and if no critical issues are found, launch **code-simplifier** to:

- Simplify complex code for clarity and readability
- Apply project standards and conventions
- Suggest polish improvements while preserving functionality

### Step 5: Aggregate and Present Results

Collect results from all agents and organize into a single summary:

```markdown
# PR Review Summary: <PR title>

## Critical Issues (must fix)

- [Security] Description — `file:line`
- [Code Quality] Description — `file:line`

## Important Issues (should fix)

- [Performance] Description — `file:line`
- [Tests] Description — `file:line`

## Suggestions (nice to have)

- [Architecture] Description — `file:line`

## Strengths

- What's well-done in this PR
```

Present this summary to the user and wait for their decision.

### Step 6: Act on User Decision

**If there are review comments:**

- Ask the user: "Would you like me to post these comments on the PR?"
- If user accepts: Use `gh pr review <number> --repo <owner>/<repo> --comment --body "<summary>"` to post the review summary. For inline comments on specific files/lines, use `gh api repos/{owner}/{repo}/pulls/{number}/reviews` with the appropriate payload.
- If user declines: Do nothing further.

**If there are NO review comments (PR looks good):**

- Tell the user: "No issues found. This PR looks good!"
- Ask: "Would you like me to approve this PR?"
- If user accepts: Run `gh pr review <number> --repo <owner>/<repo> --approve`
- If user declines: Do nothing further.

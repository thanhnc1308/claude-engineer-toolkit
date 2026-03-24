---
description: Run test flows and fix issues
argument-hint: [test-command-or-issue-description]
allowed-tools: Read, Write, Edit, Bash(*), Grep, Glob, Agent, AskUserQuestion
model: sonnet
---

## Reported Issues

<issue>
$ARGUMENTS
</issue>

If no issue is described above, use AskUserQuestion to ask what test failures or issues to investigate.

### Step 1: Gather error logs

Launch the `tester` agent to execute tests and collect error logs.

### Step 2: Diagnose

Launch the `debugger` agent with the error logs from Step 1 to identify the root cause.

### Step 3: Propose fix

Present findings to the user using AskUserQuestion:

- Root cause summary
- Proposed changes (files and description)
- Any risks or trade-offs

**Do NOT implement until the user confirms.**

### Step 4: Implement and verify

After approval, implement the fix. Re-run the failing tests to confirm. If tests still fail, return to Step 1.

### Step 5: Review

Launch the `code-reviewer` agent to review the changes.

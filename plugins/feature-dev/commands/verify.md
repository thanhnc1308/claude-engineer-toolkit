---
description: Verify all acceptance criteria with fresh evidence before completion
user-invocable: true
argument-hint: [optional path to requirements doc]
---

# Verify — Evidence-Based Completion Check

You are helping a developer verify that all work is genuinely complete with fresh evidence before claiming success. **Run real commands and check real output — no assumptions.**

## Core Principles

- **Evidence before assertions**: Every claim must be backed by command output
- **Fresh runs only**: Do not rely on cached or previous results
- **Line-by-line acceptance criteria**: Check every single criterion
- **Use TodoWrite**: Track progress throughout

---

## Step 1: Load Context

1. If `$ARGUMENTS` provides a path, read the requirements document from that path.
2. Otherwise, search for the most recent requirements document in `.claude-workspace/` directories.
3. If no requirements document is found, ask the user what needs to be verified.
4. Also load the corresponding plan document for the list of deliverables and files modified.

---

## Step 2: Run Verification

Dispatch a subagent with the `verification-before-completion` skill. Provide it with:

- The requirements document
- The acceptance criteria
- The list of deliverables and files modified
- Instructions to run all relevant verification commands and check each acceptance criterion line-by-line

The agent must:

1. **Run the full test suite** and report exact pass/fail counts
2. **Run the build command** and confirm exit code 0
3. **Run the linter** and confirm 0 errors
4. **Walk through each acceptance criterion** and verify it with evidence
5. **Report any gaps** between requirements and actual state

---

## Step 3: Review and Fix

1. Review the agent's verification report
2. If any gaps or failures are found: fix them, then re-run verification
3. Only proceed when all checks pass with fresh evidence

---

## Output: Verification Complete

**Gate:** All verification commands pass, all acceptance criteria confirmed with evidence.

> Verification complete. All acceptance criteria confirmed with fresh evidence.
>
> Summary:
>
> - Tests: X passed, 0 failed
> - Build: clean (exit 0)
> - Lint: 0 errors
> - Acceptance criteria: all confirmed
>
> Next step: Run `/watzup` to summarize changes, or `/git:cm` to commit.

---
description: Implement the approved plan
user-invocable: true
argument-hint: [optional path to plan doc]
---

# Cook — Implementation

You are helping a developer implement a feature following an approved plan. Execute the plan systematically with quality checks at each step.

## Core Principles

- **Follow the plan**: Execute tasks in the order defined, respecting dependencies
- **TDD**: Write tests first, then implement (Red-Green-Refactor)
- **Fresh subagent per task**: Each task gets a clean context for focused work
- **Review as you go**: Code review after each task completion
- **Use TodoWrite**: Track progress throughout

---

## Step 1: Load Plan

1. If `$ARGUMENTS` provides a path, read the plan from that path.
2. Otherwise, search for the most recent plan document in `.claude-workspace/` directories.
3. If no plan is found, ask the user for context or suggest running `/plan` first.
4. Also load the corresponding requirements and technical design documents from the same `.claude-workspace/<YYYY-MM-DD>/` directory for reference. Use the same `<YYYY-MM-DD>` date as the plan document.

---

## Step 2: Choose Execution Mode

Present execution options to the user:

**1. Subagent-Driven** (faster, continuous and automated flow, AI reviews) — I dispatch a fresh subagent per task from the plan, review between tasks, fast iteration

**2. Separate Session** (fresh context, large plan, human review) — Open new session with executing-plans, batch execution with checkpoints

> Which approach?

---

## If Subagent-Driven chosen:

- **REQUIRED SUB-SKILL:** Use `subagent-driven-development`
- Stay in this session
- Execute tasks in the order defined by the plan, respecting dependencies
- Fresh subagent per task + code review after each task
- Use TDD (Red-Green-Refactor) for each task, target 80%+ coverage on new code
- Verify each task's acceptance criteria before moving to the next

## If Separate Session chosen:

- Guide them to open a new session in worktree
- **REQUIRED SUB-SKILL:** New session uses `executing-plans`
- Point them to the plan document path

---

## Gate: Implementation Complete

All tests must pass before leaving this phase. Show test results and coverage.

> All tests passing. Implementation complete.
>
> Next step: Run `/code-review` for code review, or `/verify` for verification.

---
description: Create detailed implementation plan from technical design and chosen approach
user-invocable: true
argument-hint: [optional path to technical design doc]
---

# Plan — Implementation Plan

You are helping a developer create a detailed, actionable implementation plan based on an approved technical design. **Do NOT start implementing.**

## Core Principles

- **Concrete and ordered**: Every task has clear files, acceptance criteria, and dependencies
- **Testable**: Every task includes a testing strategy
- **Risk-aware**: Identify what could go wrong and how to handle it
- **Use TodoWrite**: Track progress throughout

---

## Step 1: Load Context

1. If `$ARGUMENTS` provides a path, read the technical design document from that path.
2. Otherwise, search for the most recent technical design document in `.claude-workspace/` directories.
3. If no technical design document is found, ask the user for context or suggest running `/tech-design` first.
4. Also load the corresponding requirements document from the same `.claude-workspace/<YYYY-MM-DD>/` directory.
5. Confirm with the user which approach from the technical design was chosen (if not already clear from the document).

---

## Step 2: Create Plan

Dispatch a `planner` agent with:

- The requirements document
- The technical design document
- The user's chosen approach
- Codebase patterns and conventions from the requirements document

The agent must produce a plan that includes:

- **Phases** broken into concrete, ordered tasks with clear descriptions
- **Files to create or modify** for each task (informed by codebase exploration)
- **Dependencies** between tasks (what must complete before what)
- **Acceptance criteria** per task (testable conditions)
- **Risks and mitigations** (what could go wrong and how to handle it)
- **Testing strategy** per task (unit, integration, e2e)

---

## Output: Implementation Plan

Save to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-plan.md` and present to the user:

> I've saved the implementation plan to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-plan.md`. Please review it.
>
> Does this plan look correct? (Approve to continue, or describe adjustments.)
>
> Next step: Run `/cook` to start implementing.

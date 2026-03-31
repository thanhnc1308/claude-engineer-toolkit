---
description: Design and propose architecture approaches with trade-off analysis
user-invocable: true
argument-hint: [optional path to requirements doc]
---

# Tech Design — Architecture Approaches

You are helping a developer choose the right architecture for a feature. Produce a technical design document with multiple approaches and trade-offs. **Do NOT implement or create a plan.**

## Core Principles

- **Multiple approaches**: Always present at least 2-3 distinct approaches with different trade-offs
- **Include a contrarian option**: At least one approach should be unconventional or challenge conventional thinking
- **Honest assessment**: Flag overengineering, unnecessary complexity, or if the problem doesn't need solving
- **Use TodoWrite**: Track progress throughout

---

## Step 1: Load Requirements

1. If `$ARGUMENTS` provides a path, read the requirements document from that path.
2. Otherwise, search for the most recent requirements document in `.claude-workspace/` directories.
3. If no requirements document is found, ask the user for the feature requirements or suggest running `/brainstorm` first.

---

## Step 2: Design Approaches

Launch 2-3 `architect` agents in parallel with different focuses:

- **Minimal changes** — Smallest change, maximum reuse of existing code
- **Clean architecture** — Maintainability, elegant abstractions, long-term scalability
- **Pragmatic balance** — Speed + quality trade-off

Ensure at least one approach is unconventional or contrarian — a non-obvious solution that challenges conventional thinking.

Each agent receives:

- The requirements document
- Codebase patterns and conventions from the requirements document
- Their assigned focus area

---

## Step 3: Analyze and Compare

After agents return, review all approaches and compile:

1. **Summary of each approach** — What it does, key decisions, files affected, and **Best When** (conditions where this approach shines)
2. **Trade-off matrix**:

   | Dimension      | Approach 1 | Approach 2 | Approach 3 |
   | -------------- | ---------- | ---------- | ---------- |
   | Complexity     | ...        | ...        | ...        |
   | Maintenance    | ...        | ...        | ...        |
   | Performance    | ...        | ...        | ...        |
   | Cost           | ...        | ...        | ...        |
   | Technical Debt | ...        | ...        | ...        |

3. **Hidden costs and second-order effects** for each approach
4. **Failure modes and rollback strategies** for each approach
5. **Honest Assessment** — Unfiltered opinion: flag overengineering, unnecessary complexity, or if the problem doesn't need solving
6. **Your recommendation** with reasoning
7. **What would change the recommendation**: Conditions (different constraints, scale, timeline) that would flip the choice
8. **Concrete implementation differences**: Files to change, new abstractions, migration steps
9. **Resolved Questions Log** (carried forward from requirements document)

---

## Output: Tech Design Document

Save to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-tech-design.md` (use the same `<YYYY-MM-DD>` date as the requirements document loaded in Step 1) and present to the user:

> I've saved the technical design document to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-tech-design.md`. Please review the approaches and trade-offs.
>
> Which approach do you prefer? (Or describe adjustments.)
>
> Next step: Once you choose, run `/plan` to create a detailed implementation plan.

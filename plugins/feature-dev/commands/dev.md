---
description: Run the full feature development workflow — brainstorm, explore, clarify, plan, implement, review, verify, finish.
user-invocable: true
argument-hint: [feature or task description]
---

# Dev Command

**REQUIRED SKILLS:** `brainstorming`, `planning`, `test-driven-development`, `code-review`, `verification-before-completion`, `finishing-a-development-branch`

**REQUIRED AGENTS:** `planner`, `tdd-guide`, `code-reviewer`, `security-scanner`, `performance-reviewer`, `code-explorer`

## Usage

```
/dev <feature or task description>
/dev --skip-brainstorm <feature or task description>
```

If `$ARGUMENTS` is empty, ask: "What feature would you like to develop?"

Parse `$ARGUMENTS` for flags:

- `--skip-brainstorm` — Jump straight to exploration (use when the approach is already clear)

Set `FEATURE` to the argument text with flags removed.

---

## Phase 1 — Brainstorm

> Skip this phase if `--skip-brainstorm` was passed.

**Skill:** `brainstorming`

Explore 2–3 candidate approaches for `FEATURE`. For each, cover: trade-offs, risks, unknowns.

**Gate:** Present the approaches and ask:

> Which approach should we go with? (Or say "skip" to go straight to exploration.)

Wait for the user to pick before continuing.

---

## Phase 2 — Explore Codebase

Launch 2–3 explorer agents in parallel to build deep understanding of the relevant codebase. Each agent should target a different aspect:

- **Similar features** — Find features similar to `FEATURE`, trace through their implementation comprehensively
- **Architecture** — Map the architecture, abstractions, and control flow for the affected area
- **Patterns** — Identify UI patterns, testing approaches, or extension points relevant to `FEATURE`

Each agent must return results in this format:

```markdown
### Exploration Report: [aspect]

**Key files (5–10):**

- `path/to/file.ts` — why it matters
  **Patterns found:** [summary of conventions and approaches observed]
  **Constraints:** [gotchas, limitations, or hard requirements discovered]
```

**After agents return:** Read all files identified by agents in the main context to build detailed understanding. Do not skip this step — agent results alone are not sufficient; the main context needs direct file access.

Present a summary of findings: relevant patterns, conventions, integration points, and constraints discovered.

---

## Phase 3 — Clarify

**CRITICAL: Do not skip this phase.**

Review the codebase findings and the original feature request. Identify all underspecified aspects:

- Edge cases and error handling behavior
- Integration points with existing code
- Scope boundaries (what's in, what's out)
- Design preferences and backward compatibility
- Performance requirements

**Gate:** Present all questions to the user in a clear, organized list. Ask:

> Please answer these questions before I design the implementation plan.

Wait for answers before proceeding. If the user says "whatever you think is best", provide your recommendation and get explicit confirmation. If the user answers some questions but skips others, make reasonable assumptions for skipped questions, state them explicitly, and ask for confirmation before proceeding.

---

## Phase 4 — Plan

**Skill:** `planning` | **Agent:** `planner`

Create a structured implementation plan incorporating the chosen approach and codebase findings. The plan must include:

- Phases broken into concrete tasks
- Files to create or modify (informed by codebase exploration)
- Acceptance criteria
- Risks and mitigations

**Gate:** Present the full plan and ask:

> Does this plan look correct? (Approve to continue, or describe adjustments.)

Do not proceed to implementation without explicit approval.

---

## Phase 5 — Implement

After saving the plan, offer execution choice:

**Gate:** "Plan complete and saved to `docs/plans/<filename>.md`. Two execution options:"

**1. Subagent-Driven** (faster, continuous and automated flow, AI reviews) — I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Separate Session** (fresh context, large plan, human review) — Open new session with executing-plans, batch execution with checkpoints

> Which approach?

**If Subagent-Driven chosen:**

- **REQUIRED SUB-SKILL:** Use `subagent-driven-development`
- Stay in this session
- Fresh subagent per task + code review
- Use TDD (Red-Green-Refactor) for each task, target 80%+ coverage on new code

**If Separate Session chosen:**

- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses `executing-plans`

All tests must pass before leaving this phase.

**Gate:** Show test results and coverage. Ask:

> All tests passing. Ready to move to code review?

---

## Phase 6 — Review

**Skill:** `code-review`, `security-audit` | **Agents:** `code-reviewer`, `security-scanner`, `performance-reviewer`

Dispatch three review agents in parallel:

1. **`code-reviewer`** — Correctness, edge cases, error handling, code quality, naming, duplication, test quality and coverage
2. **`security-scanner`** — OWASP Top 10, injection, auth/authz flaws, secrets exposure, unsafe dependencies
3. **`performance-reviewer`** — N+1 queries, missing indexes, unbounded queries, missing caching, synchronous blocking

Merge all three reports into a single findings list grouped by severity (blocking / non-blocking).

If blocking issues are found: fix them, re-run affected tests, re-review until clean.

**Gate:** Present the merged findings. Ask:

> Blocking issues resolved. Non-blocking items noted for follow-up. Ready to verify?

---

## Phase 7 — Verify

**Skill:** `verification-before-completion`

Run full verification in this order:

1. **Build** — Run the build command
2. **Types** — Run type checker
3. **Lint** — Run linter
4. **Tests** — Run the full test suite
5. **Secrets scan** — Check for hardcoded secrets, API keys, tokens, or credentials in source files
6. **Console.log audit** — Search for leftover debug logs
7. **Git status** — Show changed files summary

Do not proceed if Build or Tests fail. Fix and re-run.

Output the standard verification report:

```
VERIFICATION: [PASS/FAIL]

Build:    [OK/FAIL]
Types:    [OK/X errors]
Lint:     [OK/X issues]
Tests:    [X/Y passed, Z% coverage]
Secrets:  [OK/X found]
Logs:     [OK/X console.logs]
Git:      [X files changed]

Ready for PR: [YES/NO]
```

**Gate:** Ask:

> Verification passed. Ready to finish the branch?

---

## Phase 8 — Finish

**Skill:** `finishing-a-development-branch`

Follow the `finishing-a-development-branch` skill workflow exactly. Present the user with exactly 4 options:

1. Merge back to `<base-branch>` locally
2. Push and create a Pull Request
3. Keep the branch as-is (handle later)
4. Discard this work

Execute the chosen option per the skill's instructions (including worktree cleanup and discard confirmation).

---

## Error Recovery

If any phase fails or needs to restart:

- Re-run the failed phase from scratch
- Preserve outputs from completed phases
- If implementation needs a fundamentally different approach, return to Phase 1

---

## Integration with Other Commands

- `/brainstorm` — Run Phase 1 independently
- `/plan` — Run Phase 4 independently
- `/tdd` — Run Phase 5 independently
- `/review` — Run Phase 6 independently
- `/verify` — Run Phase 7 independently
- `/orchestrate feature` — Fully autonomous (non-interactive) version of this workflow

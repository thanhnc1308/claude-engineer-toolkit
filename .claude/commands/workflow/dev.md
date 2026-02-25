---
description: Run the full feature development workflow — brainstorm, plan, implement, review, verify, finish.
user-invocable: true
argument-hint: [feature or task description]
---

# Dev Command

**REQUIRED SKILLS:** `brainstorming`, `planning`, `test-driven-development`, `code-review`, `verification-before-completion`, `finishing-a-development-branch`

**REQUIRED AGENTS:** `planner`, `tdd-guide`, `code-reviewer`

## Usage

```
/dev <feature or task description>
/dev --skip-brainstorm <feature or task description>
```

If `$ARGUMENTS` is empty, ask: "What feature would you like to develop?"

Parse `$ARGUMENTS` for flags:

- `--skip-brainstorm` — Jump straight to planning (use when the approach is already clear)

Set `FEATURE` to the argument text with flags removed.

---

## Phase 1 — Brainstorm

> Skip this phase if `--skip-brainstorm` was passed.

**Skill:** `brainstorming`

Explore 2–3 candidate approaches for `FEATURE`. For each, cover: trade-offs, risks, unknowns.

**Gate:** Present the approaches and ask:

> Which approach should we go with? (Or say "skip" to go straight to planning.)

Wait for the user to pick before continuing.

---

## Phase 2 — Plan

**Skill:** `planning` | **Agent:** `planner`

Create a structured implementation plan incorporating the chosen approach. The plan must include:

- Phases broken into concrete tasks
- Files to create or modify
- Acceptance criteria
- Risks and mitigations

**Gate:** Present the full plan and ask:

> Does this plan look correct? (Approve to continue, or describe adjustments.)

Do not proceed to implementation without explicit approval.

---

## Phase 3 — Implement with TDD

**Skill:** `test-driven-development` | **Agent:** `tdd-guide`

Execute the approved plan using Red-Green-Refactor for each task:

1. **Red** — Write failing tests that define the expected behavior
2. **Green** — Write minimal implementation to pass the tests
3. **Refactor** — Clean up while keeping tests green

Target: 80%+ test coverage on new code. All tests must pass before leaving this phase.

**Gate:** Show test results and coverage. Ask:

> All tests passing. Ready to move to code review?

---

## Phase 4 — Review

**Skill:** `code-review` | **Agent:** `code-reviewer`

Review all changes from Phase 3:

- Correctness, edge cases, error handling
- Security (OWASP Top 10 awareness)
- Code quality, naming, duplication
- Test quality and coverage

If blocking issues are found: fix them, re-run affected tests, re-review until clean.

**Gate:** Present findings grouped by severity (blocking / non-blocking). Ask:

> Blocking issues resolved. Non-blocking items noted for follow-up. Ready to verify?

---

## Phase 5 — Verify

**Skill:** `verification-before-completion`

Run full verification in this order:

1. **Build** — Run the build command
2. **Types** — Run type checker
3. **Lint** — Run linter
4. **Tests** — Run the full test suite
5. **Console.log audit** — Search for leftover debug logs
6. **Git status** — Show changed files summary

Do not proceed if Build or Tests fail. Fix and re-run.

Output the standard verification report:

```
VERIFICATION: [PASS/FAIL]

Build:    [OK/FAIL]
Types:    [OK/X errors]
Lint:     [OK/X issues]
Tests:    [X/Y passed, Z% coverage]
Logs:     [OK/X console.logs]
Git:      [X files changed]

Ready for PR: [YES/NO]
```

**Gate:** Ask:

> Verification passed. Ready to finish the branch?

---

## Phase 6 — Finish

**Skill:** `finishing-a-development-branch`

Follow the `finishing-a-development-branch` skill workflow exactly. Present the user with exactly 4 options:

1. Merge back to `<base-branch>` locally
2. Push and create a Pull Request
3. Keep the branch as-is (handle later)
4. Discard this work

Execute the chosen option per the skill's instructions (including worktree cleanup and discard confirmation).

---

## Integration with Other Commands

- `/brainstorm` — Run Phase 1 independently
- `/plan` — Run Phase 2 independently
- `/tdd` — Run Phase 3 independently
- `/review` — Run Phase 4 independently
- `/verify` — Run Phase 5 independently
- `/orchestrate feature` — Fully autonomous (non-interactive) version of this workflow

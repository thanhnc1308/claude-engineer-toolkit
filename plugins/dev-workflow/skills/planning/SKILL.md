---
name: planning
description: Creates a structured implementation plan from requirements. Breaks work into phases, identifies risks, and defines acceptance criteria. Use before implementing any non-trivial feature or change.
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
argument-hint: [feature or task to plan]
---

# Implementation Planning

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, edge cases, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

**Announce at start:** "I'm using the planning skill to create the implementation plan."

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**

- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use dev-workflow:executing-plans to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**

- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `tests/exact/path/to/file.spec.ts`

**Step 1: Write the failing test**

```typescript
describe("specificBehavior", () => {
  it("should return expected result", () => {
    const result = specificFunction(input);
    expect(result).toEqual(expected);
  });
});
```
````

**Step 2: Run test to verify it fails**

Run: `npx jest tests/path/file.spec.ts -t "should return expected result" --verbose`
Expected: FAIL with "specificFunction is not defined"

**Step 3: Write minimal implementation**

```typescript
export function specificFunction(input: InputType): OutputType {
  return expected;
}
```

**Step 4: Run test to verify it passes**

Run: `npx jest tests/path/file.spec.ts -t "should return expected result" --verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/path/file.spec.ts src/path/file.ts
git commit -m "feat: add specific feature"
```

## Remember

- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands with expected output
- Reference relevant skills with @ syntax
- DRY, YAGNI, TDD, frequent commits

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/plans/<filename>.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?"**

**If Subagent-Driven chosen:**

- **REQUIRED SUB-SKILL:** Use dev-workflow:subagent-driven-development
- Stay in this session
- Fresh subagent per task + code review

**If Parallel Session chosen:**

- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses dev-workflow:executing-plans

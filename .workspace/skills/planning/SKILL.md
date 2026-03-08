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

## Planning Process

### 1. Requirements Analysis

- Understand the feature request completely
- Ask clarifying questions if needed
- Identify success criteria
- List assumptions and constraints

### 2. Architecture Review

- Analyze existing codebase structure
- Identify affected components
- Review similar implementations for reusable patterns
- Consider integration points and dependencies

### 3. Step Breakdown

Create detailed steps with:

- Clear, specific actions with exact file paths and locations
- Dependencies between steps
- Estimated complexity
- Potential risks

### 4. Implementation Order

- Prioritize by dependencies
- Group related changes
- Minimize context switching
- Enable incremental testing

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

## Plan Document Structure

After the header, plans follow this structure:

```markdown
## Requirements

- [Requirement 1]
- [Requirement 2]

## Architecture Changes

- [Change 1: file path and description]
- [Change 2: file path and description]
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
describe('specificBehavior', () => {
  it('should return expected result', () => {
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

## Closing Sections

Every plan ends with:

```markdown
## Testing Strategy

- Unit tests: [files to test]
- Integration tests: [flows to test]
- E2E tests: [user journeys to test]

## Risks & Mitigations

- **Risk**: [Description]
  - Mitigation: [How to address]

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2
```

## When Planning Refactors

1. Identify code smells and technical debt
2. List specific improvements needed
3. Preserve existing functionality
4. Create backwards-compatible changes when possible
5. Plan for gradual migration if needed

## Red Flags to Surface

While planning, actively check for and flag:

- Large functions (>50 lines)
- Deep nesting (>4 levels)
- Duplicated code
- Missing error handling
- Hardcoded values
- Missing tests
- Performance bottlenecks

## Remember

- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands with expected output
- Reference relevant skills with @ syntax
- DRY, YAGNI, TDD, frequent commits

## Confirmation Gate

**CRITICAL**: After presenting the plan, WAIT for explicit user confirmation before proceeding.

Present the plan and ask: **"Proceed with this plan? (yes/no/modify)"**

If the user wants changes, they may respond with:

- "modify: [their changes]"
- "different approach: [alternative]"
- "skip phase 2 and do phase 3 first"

Iterate on the plan until the user confirms.

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/plans/<filename>.md`. Two execution options:**

**1. Subagent-Driven (faster, continuous and automated flow, AI reviews)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Separate Session (fresh context, large plan, human review)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?"**

**If Subagent-Driven chosen:**

- **REQUIRED SUB-SKILL:** Use dev-workflow:subagent-driven-development
- Stay in this session
- Fresh subagent per task + code review

**If Separate Session chosen:**

- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses dev-workflow:executing-plans

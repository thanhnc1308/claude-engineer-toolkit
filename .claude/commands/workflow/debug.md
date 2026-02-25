---
description: Systematic debugging — find root cause before attempting fixes. Four-phase framework for bugs, test failures, and unexpected behavior.
user-invocable: true
argument-hint: [bug description, error message, or failing test]
---

# Debug Command

**REQUIRED SKILL:** Use the `debugging` skill.

## Usage

```
/debug <bug description, error message, or failing test>
```

If an argument is provided, begin a systematic debugging session for that issue. If no argument is provided, ask what to debug.

## Iron Law

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.** If Phase 1 is not complete, do not propose fixes.

## The Four Phases

1. **Root Cause Investigation** — Read errors carefully, reproduce consistently, check recent changes, gather evidence at component boundaries, trace data flow
2. **Pattern Analysis** — Find working examples, compare against references, identify differences, understand dependencies
3. **Hypothesis & Testing** — Form a single hypothesis, test minimally (one variable at a time), verify before continuing
4. **Implementation** — Create failing test case, implement single fix addressing root cause, verify fix

## When to Use

- Test failures
- Bugs in production or development
- Unexpected behavior
- Performance problems
- Build failures
- Integration issues

## Red Flags — Return to Phase 1

If you catch yourself thinking "quick fix for now", "just try changing X", or "I don't fully understand but this might work" — **STOP and return to Phase 1**.

If 3+ fix attempts have failed, **stop fixing and question the architecture**.

## Integration with Other Commands

- Use `/debug` to find and fix the root cause
- Use `/tdd` to write regression tests for the fix
- Use `/review` to review the completed fix

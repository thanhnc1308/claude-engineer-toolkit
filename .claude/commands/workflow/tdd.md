---
description: Enforce test-driven development. Scaffold interfaces, generate tests FIRST, then implement minimal code to pass. Ensure 80%+ coverage.
user-invocable: true
argument-hint: [feature, function, or bug to implement]
---

# TDD Command

**REQUIRED AGENT:** Use the `tdd-guide` agent for TDD enforcement, behavioral guidelines, and decision-making.

**REQUIRED SKILL:** Use the `test-driven-development` skill for the Red-Green-Refactor workflow, test types, mocking patterns, checklists, and coverage requirements.

## Usage

```
/tdd <feature, function, or bug to implement>
```

If an argument is provided, begin a TDD session for that task. If no argument is provided, ask what to implement.

## When to Use

- Implementing new features or functions
- Fixing bugs (write a test reproducing the bug first)
- Refactoring existing code
- Building critical business logic

## Integration with Other Commands

- Use `/plan` first to understand what to build
- Use `/tdd` to implement with tests
- Use `/code-review` to review the completed implementation

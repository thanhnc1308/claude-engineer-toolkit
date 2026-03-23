---
description: Create a structured implementation plan for a feature or task
user-invocable: true
argument-hint: [feature or task]
---

# Plan Command

**REQUIRED SKILL:** Use the `planning` skill to create the implementation plan.

## Usage

```
/plan <feature or task description>
```

If an argument is provided, use it as the feature/task to plan. If no argument is provided, ask the user what they want to plan.

## When to Use

Use `/plan` when:

- Starting a new feature
- Making significant architectural changes
- Working on complex refactoring
- Multiple files/components will be affected
- Requirements are unclear or ambiguous

## Integration with Other Commands

After planning and confirmation:

- Use `/tdd` to implement with test-driven development

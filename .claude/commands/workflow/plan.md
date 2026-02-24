---
description: Create a structured implementation plan for a feature or task
user-invocable: true
argument-hint: [feature or task]
---

# Plan Command

**REQUIRED SKILL:** Use the `planning` skill to create the implementation plan.

**REQUIRED AGENT:** Use the `planner` agent for planning judgment and behavioral guidelines.

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
- Use `/build-and-fix` if build errors occur
- Use `/code-review` to review completed implementation

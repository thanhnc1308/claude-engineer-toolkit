---
name: brainstorming
description: Interactive brainstorming session for exploring ideas, approaches, and trade-offs before implementation. Use when starting a new feature, solving a complex problem, or evaluating architectural decisions.
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
argument-hint: [topic or problem to brainstorm]
---

# Brainstorming Session

Structured workflow for turning ideas into fully formed designs through collaborative dialogue.

## Process

### 1. Understand the Problem

- Restate the problem in your own words to confirm understanding
- Challenge whether this is the right problem to solve
- Identify what success looks like (measurable criteria)
- List known constraints (time, budget, team, tech stack)
- Ask questions one at a time to refine the idea — break complex topics into multiple questions
- Prefer multiple choice questions when possible

### 2. Explore Approaches

- Generate 3-5 distinct approaches (not minor variations)
- Include at least one unconventional or contrarian option
- Include the "do nothing" or "minimal change" option when appropriate
- Research existing patterns and prior art for each approach
- For each approach, explain:
  - **How it works**: Core mechanism and architecture
  - **Pros**: Benefits, simplicity, performance, maintainability
  - **Cons**: Drawbacks, complexity, risks, limitations
  - **Effort**: Rough scope (small/medium/large)
  - **Best When**: Conditions where this approach shines

### 3. Deep Analysis

- Evaluate each approach against trade-off dimensions:
  - **Complexity**: Implementation and ongoing cognitive load
  - **Maintenance**: Long-term cost of ownership
  - **Performance**: Runtime characteristics and scalability
  - **Cost**: Development time, infrastructure, and operational cost
  - **Technical Debt**: Future flexibility and migration risk
- Identify hidden costs and second-order effects
- Consider failure modes and rollback strategies
- Assess alignment with existing architecture and team capabilities
- Consider existing patterns in the codebase

### 4. Recommend

- Provide a clear recommendation with supporting rationale
- Define measurable success criteria
- List open questions that need resolution before committing
- Identify what would change your recommendation (different constraints, scale, etc.)

### 5. Present the Design

- Present the design in sections of 200-300 words
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

## Output Format

```markdown
# Brainstorm: [Problem Statement]

## Problem Restatement

[Your understanding of the core problem — challenge any assumptions here]

## Constraints

- Team: [skills, size, availability]
- Timeline: [deadlines, urgency]
- Budget: [cost constraints]
- Technical: [existing stack, compatibility requirements]

## Approaches

### Approach 1: [Name]

- **Description**: [2-3 sentence summary]
- **Pros**: [bullet list]
- **Cons**: [bullet list]
- **Complexity**: Low / Medium / High
- **Maintenance Burden**: Low / Medium / High
- **Best When**: [conditions where this approach shines]

### Approach 2: [Name]

...

### Approach 3: [Name]

...

## Trade-Off Matrix

| Dimension      | Approach 1 | Approach 2 | Approach 3 |
| -------------- | ---------- | ---------- | ---------- |
| Complexity     | ...        | ...        | ...        |
| Maintenance    | ...        | ...        | ...        |
| Performance    | ...        | ...        | ...        |
| Time to Ship   | ...        | ...        | ...        |
| Technical Debt | ...        | ...        | ...        |

## Honest Assessment

[Unfiltered opinion — flag overengineering, unnecessary complexity, or if the problem doesn't need solving]

## Recommendation

**Recommended Approach**: [Name]
**Rationale**: [Why this approach wins given the specific context]

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Open Questions

- [ ] Question that needs answering before committing
- [ ] Decision that the team must make

## Next Steps

1. Resolve open questions
2. Use `/plan` to create a detailed implementation plan for the chosen approach
```

## Key Principles

- **Creative but practical** — ideas should be implementable
- **Leverage existing patterns** — reference existing code patterns when relevant
- **Consider edge cases** — think through failure modes and boundary conditions
- **Stay focused** — keep the discussion on topic: $ARGUMENTS
- **YAGNI ruthlessly** — remove unnecessary features from all designs
- **Explore alternatives** — always propose 2-3 approaches before settling
- **Be flexible** — go back and clarify when something doesn't make sense

## After the Design

**Documentation:**

- Write the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Use elements-of-style:writing-clearly-and-concisely skill if available
- Commit the design document to git

**Implementation (if continuing):**

- Ask: "Ready to set up for implementation?"
- Use dev-workflow:using-git-worktrees skill to create isolated workspace
- Use dev-workflow:planning skill to create detailed implementation plan

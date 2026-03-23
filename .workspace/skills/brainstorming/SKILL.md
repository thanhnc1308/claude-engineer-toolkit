---
name: brainstorming
description: Interactive brainstorming session for exploring ideas, approaches, and trade-offs before implementation. Use when starting a new feature, solving a complex problem, or evaluating architectural decisions.
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
argument-hint: [topic or problem to brainstorm]
user-invocable: false
---

# Brainstorming Session

Structured workflow for exploring approaches, evaluating trade-offs, and producing a design brief for the planner.

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

### 4. Recommend and Resolve

- Provide a clear recommendation with supporting rationale
- Define measurable success criteria
- List open questions that need resolution before committing
- Resolve all open questions with the user before writing the design brief — do not hand off unresolved questions to the planner
- Identify what would change your recommendation (different constraints, scale, etc.)

### 5. Write the Design Brief

Write the complete design brief using the output format below and save it to `claude-docs/tech-design/YYYY-MM-DD-<feature-name>-design.md`.

## Output Format (Design Brief)

> This format is the handoff contract to the planning phase. The planner uses
> the Recommendation, Constraints, Success Criteria, and Scope Definition as input.
> All questions must be resolved before writing this brief.

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

## Resolved Questions

[List questions that came up during brainstorming and how they were resolved. All open questions must be answered before handing off to the planner.]

## Scope Definition

- **In scope**: [What the recommended approach covers]
- **Out of scope**: [What it explicitly does not cover]
- **Assumptions**: [Assumptions the recommendation depends on]
```

## Key Principles

- **Creative but practical** — ideas should be implementable
- **Leverage existing patterns** — reference existing code patterns when relevant
- **Consider edge cases** — think through failure modes and boundary conditions
- **Stay focused** — keep the discussion on topic: $ARGUMENTS
- **Explore alternatives** — always propose 2-3 approaches before settling
- **Be flexible** — go back and clarify when something doesn't make sense
- **Engineering Rules** — YAGNI, KISS, DRY

## After the Design

All open questions must be resolved before handing off to the planner. Save the validated design brief to `claude-docs/tech-design/YYYY-MM-DD-<feature-name>-design.md` and hand off the file path to the planner. The planner agent/skill will read the design file and use the recommended approach, constraints, success criteria, and scope definition to create a detailed implementation plan.

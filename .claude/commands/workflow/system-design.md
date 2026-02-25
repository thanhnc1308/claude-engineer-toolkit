---
description: Design scalable system architecture with trade-off analysis, ADRs, and structured review process.
user-invocable: true
argument-hint: [feature, system component, or technical decision]
---

# System Design Command

**REQUIRED AGENT:** Use the `architect` agent for system design, scalability analysis, and technical decision-making.

**REQUIRED SKILL:** Use the `system-designing` skill for the architecture review process, design principles, common patterns, ADR templates, and system design checklist.

## Usage

```
/system-design <feature, system component, or technical decision>
```

If an argument is provided, begin a system design session for that topic. If no argument is provided, ask what to design.

## When to Use

- Planning new features or system components
- Evaluating technical trade-offs between approaches
- Refactoring or restructuring existing architecture
- Creating Architecture Decision Records (ADRs)
- Identifying scalability bottlenecks
- Designing API contracts, data models, or integration points

## Architecture Review Process

1. **Current State Analysis** — Review existing architecture, conventions, technical debt, and integration points
2. **Requirements Gathering** — Functional requirements (user stories, APIs, data models) and non-functional requirements (performance, security, scalability, availability)
3. **Design Proposal** — Architecture diagram, component responsibilities, data models, API contracts, error handling strategy
4. **Trade-Off Analysis** — For each decision: pros, cons, alternatives considered, final choice with rationale

## Integration with Other Commands

- Use `/system-design` to plan the architecture
- Use `/plan` to break the design into implementation phases
- Use `/tdd` to implement components with tests
- Use `/review` to review the completed implementation

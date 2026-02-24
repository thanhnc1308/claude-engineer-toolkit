---
name: system-designing
description: Design scalable, maintainable system architecture for new features, refactoring, or technical decision-making. Use PROACTIVELY when planning new features, designing system components, evaluating technical trade-offs, creating Architecture Decision Records (ADRs), or identifying scalability bottlenecks.
---

# System Designing

Structured workflow for designing system architecture through analysis, trade-off evaluation, and decision documentation.

## Architecture Review Process

### 1. Current State Analysis

- Review existing architecture and codebase patterns
- Identify conventions, technical debt, and scalability limitations
- Document integration points and data flow

### 2. Requirements Gathering

- Functional requirements (user stories, API contracts, data models, UI/UX flows)
- Non-functional requirements (performance targets, security, scalability, availability)
- Integration points and data flow requirements

### 3. Design Proposal

- High-level architecture diagram
- Component responsibilities and boundaries
- Data models and API contracts
- Integration patterns and error handling strategy

### 4. Trade-Off Analysis

For each design decision, document:

- **Pros**: Benefits and advantages
- **Cons**: Drawbacks and limitations
- **Alternatives**: Other options considered
- **Decision**: Final choice and rationale

## Architectural Principles

### Modularity & Separation of Concerns

- Single Responsibility Principle — high cohesion, low coupling
- Clear interfaces between components
- Independent deployability

### Scalability

- Horizontal scaling, stateless design where possible
- Efficient database queries, caching strategies, load balancing

### Maintainability

- Clear code organization, consistent patterns
- Easy to test and simple to understand

### Security

- Defense in depth, principle of least privilege
- Input validation at boundaries, secure by default, audit trail

### Performance

- Efficient algorithms, minimal network requests
- Optimized queries, appropriate caching, lazy loading

## Common Patterns

### Frontend

- **Component Composition**: Complex UI from simple components
- **Container/Presenter**: Separate data logic from presentation
- **Custom Hooks**: Reusable stateful logic
- **Context for Global State**: Avoid prop drilling
- **Code Splitting**: Lazy load routes and heavy components

### Backend

- **Repository Pattern**: Abstract data access
- **Service Layer**: Business logic separation
- **Middleware Pattern**: Request/response processing
- **Event-Driven Architecture**: Async operations
- **CQRS**: Separate read and write operations

### Data

- **Normalized Database**: Reduce redundancy
- **Denormalized for Read Performance**: Optimize queries
- **Event Sourcing**: Audit trail and replayability
- **Caching Layers**: Redis, CDN
- **Eventual Consistency**: For distributed systems

## Architecture Decision Records (ADRs)

For significant decisions, produce an ADR:

```markdown
# ADR-NNN: [Title]

## Context

[Why this decision is needed]

## Decision

[What was decided]

## Consequences

### Positive

- [Benefits]

### Negative

- [Drawbacks]

### Alternatives Considered

- **[Option]**: [Why not chosen]

## Status

[Proposed | Accepted | Deprecated | Superseded]

## Date

YYYY-MM-DD
```

## System Design Checklist

### Functional Requirements

- [ ] User stories documented
- [ ] API contracts defined
- [ ] Data models specified
- [ ] UI/UX flows mapped

### Non-Functional Requirements

- [ ] Performance targets (latency, throughput)
- [ ] Scalability requirements
- [ ] Security requirements
- [ ] Availability targets (uptime %)

### Technical Design

- [ ] Architecture diagram created
- [ ] Component responsibilities defined
- [ ] Data flow documented
- [ ] Integration points identified
- [ ] Error handling strategy defined
- [ ] Testing strategy planned

### Operations

- [ ] Deployment strategy defined
- [ ] Monitoring and alerting planned
- [ ] Backup and recovery strategy
- [ ] Rollback plan documented

## Red Flags

Watch for these anti-patterns:

- **Big Ball of Mud**: No clear structure
- **Golden Hammer**: Same solution for everything
- **Premature Optimization**: Optimizing too early
- **Not Invented Here**: Rejecting existing solutions
- **Analysis Paralysis**: Over-planning, under-building
- **Tight Coupling**: Components too dependent
- **God Object**: One class/component does everything

**Remember**: Good architecture enables rapid development, easy maintenance, and confident scaling. The best architecture is simple, clear, and follows established patterns.

## References

- **Example SaaS architecture**: See [references/example-saas-architecture.md](references/example-saas-architecture.md) for a sample AI-powered SaaS platform architecture with scalability plan.

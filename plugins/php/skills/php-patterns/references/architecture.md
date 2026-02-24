# Architecture Rules

## Domain-Driven Design Layers

- **Controller layer** — thin controllers handling HTTP request/response only, delegate to domain services, no business logic
- **Domain layer** — core business logic: services, repositories, value objects, consumers for event/message processing
- **Infrastructure layer** — Doctrine DBAL/ORM, external API clients, filesystem, caching implementations

Dependency rule: controllers depend on domain, domain depends on abstractions (interfaces), infrastructure implements domain interfaces.

## SOLID Principles

- **Single Responsibility** — each class has one reason to change; controllers handle HTTP, services handle logic, repositories handle data
- **Open/Closed** — extend behavior through new classes or decorators, not by modifying existing ones
- **Liskov Substitution** — subtypes must be substitutable for their base types; test with interface contracts
- **Interface Segregation** — no fat interfaces; split into focused interfaces (e.g., `ReadableRepository`, `WritableRepository`)
- **Dependency Inversion** — depend on abstractions (interfaces), not concretions; inject via constructor

## Repository Pattern

- Abstract data access behind repository interfaces in the domain layer
- Implementations live in infrastructure layer
- One repository per aggregate root
- Avoid exposing query builder or DBAL outside repositories

## Doctrine Patterns

- Prefer Query Builder over raw SQL for maintainability
- Use DQL for complex queries that span multiple entities
- Define proper entity relationships (OneToMany, ManyToMany)
- Always use parameterized queries — never concatenate user input

## Transaction Management

- Keep transactions short — minimal work inside `beginTransaction()`/`commit()`
- Always wrap in try/catch with `rollBack()` on failure
- Separate data migrations from schema migrations in Doctrine Migrations
- Version control all migrations; never modify a migration after deployment

## Database Performance

- Add indexes for columns used in WHERE, JOIN, and ORDER BY clauses
- Detect and prevent N+1 queries with eager loading or batch fetching
- Use EXPLAIN to analyze slow queries
- Implement query result caching for frequently accessed, rarely changing data
- Use batch processing (chunked reads/writes) for large datasets
- Configure connection pooling appropriately

## Design Principles

- Favor composition over inheritance
- Use value objects for domain concepts (Money, Email, DateRange)
- Keep domain models rich — behavior lives on entities, not in "anemic" getter/setter classes
- Use events for cross-cutting concerns and decoupled communication between bounded contexts

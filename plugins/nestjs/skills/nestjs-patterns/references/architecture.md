# NestJS Architecture Rules

## Module Organization

- Organize by **business domain**, not by technical layer
- Each feature gets its own module: `UserModule`, `OrderModule`, `PaymentModule`
- Use a `SharedModule` for cross-cutting utilities (logging, pagination, common DTOs)
- Use a `CoreModule` (global) for app-wide singleton services (config, database, auth)

## Layer Separation

Follow the dependency rule — each layer only depends on the layer below:

```
Controller (HTTP layer)
    ↓
Service (Business logic)
    ↓
Repository (Data access)
    ↓
Entity (Domain model)
```

- **Controllers**: Handle HTTP concerns only (request parsing, response formatting, status codes)
- **Services**: Contain all business logic. Services can depend on other services.
- **Repositories**: Abstract database operations. Use repository pattern or TypeORM/Mongoose repositories.
- **Entities**: Pure domain models with no framework dependencies

## API Design

- Use RESTful conventions: `GET /users`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id`
- Version APIs when breaking changes are needed: `/api/v1/users`
- Return consistent response shapes across all endpoints
- Use proper HTTP status codes (201 for created, 204 for no content, 404 for not found)

## Error Handling

- Use NestJS exception filters for consistent error responses
- Create domain-specific exceptions (e.g., `UserNotFoundException extends NotFoundException`)
- Never expose internal errors to clients
- Log all errors with context (request ID, user ID, operation)

## Design Principles

- **Domain-Driven Design**: Organize modules around business domains, not technical layers
- **Dependency Rule**: Dependencies point inward (controller → service → repository)
- **Interface Segregation**: Define narrow interfaces for cross-module communication
- **Single Responsibility**: Each module owns one bounded context
- **Configuration**: Use `ConfigModule` with validation for all environment-specific values

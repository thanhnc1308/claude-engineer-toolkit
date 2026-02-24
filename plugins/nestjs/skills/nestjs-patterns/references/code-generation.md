# NestJS Code Generation

Guidelines for generating NestJS boilerplate code following project conventions.

## Before Generating

1. **Explore existing patterns** — Read at least 2-3 existing modules to understand the project's conventions
2. **Identify conventions** — Note naming patterns, file organization, DTO style, service patterns
3. **Check shared modules** — Find existing shared utilities, base classes, or common patterns to reuse

## Module Structure Template

For a new module, generate these files following project conventions:

```
src/<module-name>/
├── <module-name>.module.ts        # Module definition
├── <module-name>.controller.ts    # REST controller
├── <module-name>.service.ts       # Business logic
├── dto/
│   ├── create-<entity>.dto.ts     # Create DTO with class-validator
│   └── update-<entity>.dto.ts     # Update DTO (PartialType of Create)
├── entities/
│   └── <entity>.entity.ts         # Database entity/schema
├── interfaces/
│   └── <entity>.interface.ts      # TypeScript interfaces
└── __tests__/
    ├── <module-name>.controller.spec.ts
    └── <module-name>.service.spec.ts
```

## Code Standards

- Use `class-validator` decorators on all DTO properties
- Use `class-transformer` for serialization control
- Apply `@ApiTags()` and `@ApiOperation()` for Swagger docs
- Apply `ValidationPipe` on controller methods or globally
- Use proper HTTP methods and status codes
- Include basic unit test scaffolding

## Process

1. Explore existing modules for patterns
2. Generate files one at a time, confirming structure with the user
3. Register the new module in the parent module

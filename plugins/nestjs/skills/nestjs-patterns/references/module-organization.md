# NestJS Module Organization Rules

## Feature Modules

Each feature module should be self-contained:

```
src/user/
├── user.module.ts           # Module definition
├── user.controller.ts       # HTTP endpoints
├── user.service.ts          # Business logic
├── user.repository.ts       # Data access (if not using TypeORM repo)
├── dto/
│   ├── create-user.dto.ts   # Input validation
│   └── update-user.dto.ts   # Partial input (extends create)
├── entities/
│   └── user.entity.ts       # Database schema
├── interfaces/
│   └── user.interface.ts    # TypeScript interfaces
├── guards/
│   └── user-owner.guard.ts  # Module-specific guards
└── __tests__/
    ├── user.controller.spec.ts
    └── user.service.spec.ts
```

## DTO Validation

- Use `class-validator` decorators on all DTO properties
- Use `class-transformer` for type coercion and serialization
- Create `UpdateDto` using `PartialType(CreateDto)` from `@nestjs/mapped-types`
- Use `OmitType`, `PickType`, `IntersectionType` for DTO composition
- Apply `@IsNotEmpty()`, `@IsString()`, `@IsEmail()`, etc. on all input fields

```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8)
  readonly password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

## Shared Module

Use a shared module for reusable utilities:

```typescript
@Module({
  providers: [PaginationService, SlugService],
  exports: [PaginationService, SlugService],
})
export class SharedModule {}
```

## Global Module

Use `@Global()` sparingly — only for truly app-wide services:

- `ConfigModule`
- `DatabaseModule`
- `LoggerModule`
- `AuthModule` (core auth, not route guards)

## Testing

- Unit test services in isolation with mocked dependencies
- Use `Test.createTestingModule()` for integration tests
- Mock external services at the provider level using `useValue`
- Test controllers for correct HTTP behavior (status codes, DTOs)
- Test guards and interceptors independently

---
name: reviewing-nestjs
description: NestJS architecture review covering module boundaries, dependency injection, guards, pipes, interceptors, and exception handling. Use when reviewing NestJS code or checking architecture quality.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [file path or module to review]
---

# NestJS Architecture Review

You are performing a NestJS-focused architecture and code review. Focus on NestJS patterns, module design, and backend best practices.

## Review Checklist

### 1. Module Architecture

- Are modules properly scoped and focused on a single domain?
- Are shared modules used for cross-cutting concerns?
- Is there a clear core module for app-wide providers?
- Are circular dependencies avoided?
- Are dynamic modules used appropriately for configuration?

### 2. Dependency Injection

- Are all dependencies injected via constructor (no service locator)?
- Are custom providers (`useFactory`, `useValue`, `useClass`) used correctly?
- Are injection scopes (`DEFAULT`, `REQUEST`, `TRANSIENT`) appropriate?
- Are optional dependencies marked with `@Optional()`?
- Are interfaces used with `@Inject()` token for abstraction?

### 3. Controllers

- Are controllers thin (delegating logic to services)?
- Are DTOs used for request validation with `class-validator`?
- Are response types explicitly defined?
- Are proper HTTP status codes returned?
- Is swagger/OpenAPI documentation present?

### 4. Services

- Is business logic properly encapsulated in services?
- Are services focused on a single responsibility?
- Are database operations in dedicated repository services?
- Is error handling using NestJS exception filters?
- Are transactions handled correctly?

### 5. Guards, Pipes & Interceptors

- Are authentication guards applied at appropriate levels?
- Are authorization guards checking permissions correctly?
- Is `ValidationPipe` configured globally with proper options?
- Are interceptors used for logging, caching, or response transformation?
- Is the execution order correct (guards → interceptors → pipes)?

### 6. Exception Handling

- Are custom exception filters used for domain errors?
- Are HTTP exceptions mapped correctly to status codes?
- Are errors logged with sufficient context?
- Are sensitive details excluded from error responses?

## Output Format

For each finding:

- **Severity**: Critical / Warning / Suggestion
- **Location**: File and line
- **Issue**: What's wrong
- **Fix**: How to fix it, with NestJS-idiomatic code example

Review target: $ARGUMENTS

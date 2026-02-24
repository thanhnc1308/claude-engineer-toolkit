---
name: typescript-review
description: TypeScript-specific code review focusing on type safety, strict mode compliance, generics usage, and TypeScript best practices. Use when reviewing TypeScript code or checking type quality.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [file path or description of code to review]
---

# TypeScript Code Review

You are performing a TypeScript-focused code review. Focus on type system usage, type safety, and TypeScript-specific best practices.

## Review Checklist

### 1. Type Safety

- No `any` types unless explicitly justified with a comment
- Prefer `unknown` over `any` for truly unknown types
- No type assertions (`as`) without clear justification
- Strict null checks: handle `null` and `undefined` explicitly
- No non-null assertions (`!`) unless provably safe

### 2. Type Design

- Use discriminated unions over type guards where possible
- Prefer interfaces for object shapes, types for unions/intersections
- Use generics to avoid code duplication — but keep them readable
- Leverage utility types (`Partial`, `Pick`, `Omit`, `Record`, etc.)
- Exhaustive switch statements with `never` for completeness

### 3. Strict Mode Compliance

- `strictNullChecks`: all nullable values handled
- `noImplicitAny`: all parameters and variables typed
- `strictFunctionTypes`: function type compatibility
- `noUncheckedIndexedAccess`: array/object access checked

### 4. Patterns & Conventions

- Use `const` assertions for literal types
- Prefer `enum` alternatives (const objects with `as const`)
- Use branded types for domain identifiers (UserId, OrderId)
- Leverage template literal types where appropriate
- Proper use of `readonly` for immutable data

### 5. Common Anti-patterns

- Overuse of `any` or `as unknown as T`
- Redundant type annotations (let TypeScript infer)
- Excessively complex generic chains
- Missing return types on public functions
- Ignoring TypeScript errors with `@ts-ignore`

## Output Format

For each finding, provide:

- **Severity**: Critical / Warning / Suggestion
- **Location**: File and line
- **Issue**: What's wrong with the type usage
- **Fix**: Specific code change to improve it

## Reference Materials

- [Type Safety Rules](./references/type-safety.md)
- [Conventions](./references/conventions.md)
- [Patterns](./references/patterns.md)
- [Coding Style](./references/coding-style.md)
- [Hooks](./references/hooks.md)

Review target: $ARGUMENTS

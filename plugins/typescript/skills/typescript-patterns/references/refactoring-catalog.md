# TypeScript Refactoring Catalog

## 1. Tighten Types

- Replace `any` with specific types or `unknown`
- Replace broad types (`string`) with literal unions or branded types
- Add `readonly` to properties and arrays that shouldn't mutate
- Convert optional properties to explicit unions where appropriate

## 2. Extract & Organize Types

- Extract inline types into named interfaces/types
- Group related types into dedicated type files
- Create shared types for repeated patterns
- Use module augmentation for third-party type extensions

## 3. Improve Generics

- Add type constraints (`extends`) to prevent misuse
- Use default generic parameters for common cases
- Simplify overly complex generic chains
- Replace manual type mapping with built-in utility types

## 4. Modernize Patterns

- Replace `enum` with `const` objects + `as const`
- Use `satisfies` operator for type validation without widening
- Replace type guards with discriminated unions where possible
- Leverage template literal types for string patterns
- Use `using` keyword for resource management (TypeScript 5.2+)

## 5. Improve DX

- Add JSDoc comments to exported types
- Use descriptive generic parameter names (`TItem` not `T`)
- Create type-safe builder or factory patterns
- Add explicit return types to public API functions

## Process

1. Read the target code and understand its structure
2. Identify type improvement opportunities
3. Apply changes incrementally — one refactoring at a time
4. Verify no runtime behavior changes

# TypeScript Conventions

## Naming

- **Interfaces**: PascalCase, no `I` prefix (`UserProfile` not `IUserProfile`)
- **Types**: PascalCase (`CreateUserInput`, `UserStatus`)
- **Enums/Const objects**: PascalCase for the object, PascalCase or UPPER_CASE for values
- **Generics**: Descriptive names (`TItem`, `TResponse`) for complex generics; single letter (`T`, `K`, `V`) only for simple, obvious cases
- **Files**: kebab-case (`user-profile.ts`, `create-user.dto.ts`)

## File Organization

- One primary export per file (class, interface, or function)
- Co-locate related types with their implementation
- Use barrel exports (`index.ts`) sparingly — only for public API boundaries
- Separate type-only files with `.types.ts` suffix when types are shared across modules

## Imports

- Use path aliases (`@/modules/user`) instead of deep relative paths
- Prefer `import type` for type-only imports
- Group imports: external → internal → relative → types
- Avoid circular imports — restructure modules if needed

## Code Style

- Prefer `const` over `let`; never use `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Prefer `Array.method()` over `for` loops for transformations
- Use template literals over string concatenation
- Destructure objects and arrays at point of use

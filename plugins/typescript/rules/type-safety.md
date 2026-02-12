# TypeScript Type Safety Rules

## Strict Mode

- Enable all strict compiler options in `tsconfig.json`
- Never use `@ts-ignore` — use `@ts-expect-error` with an explanation if absolutely necessary
- Never use `skipLibCheck: true` in production projects

## Type Usage

- **No `any`**: Use `unknown` for truly unknown types, specific types otherwise
- **No type assertions** (`as`): Prefer type guards or discriminated unions
- **No non-null assertions** (`!`): Handle nullability explicitly
- **Prefer `unknown` over `any`**: Force type narrowing before use
- **Use `satisfies`**: Validate types without widening (`const config = {...} satisfies Config`)

## Type Design

- Use discriminated unions with a `type` or `kind` field for variants
- Prefer `interface` for object shapes (extendable), `type` for unions/intersections
- Use branded types for domain identifiers: `type UserId = string & { __brand: 'UserId' }`
- Prefer `const` objects over `enum`: `const Status = { Active: 'active', Inactive: 'inactive' } as const`
- Make properties `readonly` by default; only make mutable when needed

## Functions

- Add explicit return types to exported/public functions
- Use function overloads for complex signatures
- Prefer `Record<string, T>` over `{ [key: string]: T }`
- Use generics with constraints: `function get<T extends object>(obj: T, key: keyof T)`

## Error Handling

- Type errors explicitly: create custom error classes or error union types
- Use `Result<T, E>` pattern for expected failures instead of throwing
- Never catch and ignore errors without explicit typing

# TypeScript Error Resolution Patterns

Common build and type error patterns with fixes. Goal: get the build green with minimal changes — no architectural edits.

## Error Resolution Workflow

### 1. Collect All Errors

```bash
# TypeScript type check (no emit)
npx tsc --noEmit --pretty

# Show all errors
npx tsc --noEmit --pretty --incremental false

# ESLint check
npx eslint . --ext .ts,.tsx,.js,.jsx
```

Categorize by type: type inference failures, missing type definitions, import/export errors, configuration errors, dependency issues. Fix blocking build errors first.

### 2. Fix Strategy (Minimal Changes)

For each error:

1. Read error message — understand expected vs actual type
2. Find minimal fix (add annotation, fix import, add null check)
3. Verify fix doesn't break other code — run `tsc` again
4. Iterate until build passes

## Common Error Patterns

### Pattern 1: Type Inference Failure

```typescript
// ❌ Parameter 'x' implicitly has an 'any' type
function add(x, y) {
  return x + y;
}

// ✅ Add type annotations
function add(x: number, y: number): number {
  return x + y;
}
```

### Pattern 2: Null/Undefined Errors

```typescript
// ❌ Object is possibly 'undefined'
const name = user.name.toUpperCase();

// ✅ Optional chaining
const name = user?.name?.toUpperCase();

// ✅ Null check
const name = user && user.name ? user.name.toUpperCase() : '';
```

### Pattern 3: Missing Properties

```typescript
// ❌ Property 'age' does not exist on type 'User'
interface User {
  name: string;
}
const user: User = { name: 'John', age: 30 };

// ✅ Add property to interface
interface User {
  name: string;
  age?: number;
}
```

### Pattern 4: Import Errors

```typescript
// ❌ Cannot find module '@/lib/utils'

// ✅ Fix 1: Check tsconfig paths
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }

// ✅ Fix 2: Use relative import
import { formatDate } from '../lib/utils'
```

### Pattern 5: Type Mismatch

```typescript
// ❌ Type 'string' is not assignable to type 'number'
const age: number = '30';

// ✅ Parse string to number
const age: number = parseInt('30', 10);
```

### Pattern 6: Generic Constraints

```typescript
// ❌ Type 'T' is not assignable to type 'string'
function getLength<T>(item: T): number {
  return item.length;
}

// ✅ Add constraint
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
```

### Pattern 7: React Hook Errors

```typescript
// ❌ React Hook "useState" cannot be called conditionally
function MyComponent() {
  if (condition) {
    const [state, setState] = useState(0); // ERROR!
  }
}

// ✅ Move hooks to top level
function MyComponent() {
  const [state, setState] = useState(0);
  if (!condition) return null;
}
```

### Pattern 8: Async/Await Errors

```typescript
// ❌ 'await' expressions are only allowed within async functions
function fetchData() {
  const data = await fetch('/api/data');
}

// ✅ Add async keyword
async function fetchData() {
  const data = await fetch('/api/data');
}
```

### Pattern 9: Module Not Found

```typescript
// ❌ Cannot find module 'react' or its corresponding type declarations

// ✅ Install dependencies
// npm install react
// npm install --save-dev @types/react
```

### Pattern 10: Next.js Fast Refresh

```typescript
// ❌ Fast Refresh had to perform a full reload (exporting non-component)

// ✅ Separate component exports from constant exports into different files
// component.tsx — export const MyComponent = () => <div />
// constants.ts  — export const someConstant = 42
```

## Minimal Diff Strategy

**DO:** Add type annotations, add null checks, fix imports/exports, add missing dependencies, update type definitions, fix config files.

**DON'T:** Refactor unrelated code, change architecture, rename variables, add new features, change logic flow, optimize performance.

---
name: refactoring
description: >-
  Safely identify and remove dead code, consolidate duplicates, clean unused
  dependencies, and refactor codebases. Use PROACTIVELY for dead code cleanup,
  duplicate elimination, dependency pruning, and safe refactoring with test
  verification. Covers: (1) Dead code detection with knip/depcheck/ts-prune,
  (2) Risk-categorized removal workflow, (3) Duplicate consolidation,
  (4) Deletion logging and PR templates, (5) Error recovery and rollback.
---

# Refactoring

Safely identify and remove dead code, consolidate duplicates, and clean unused dependencies with test verification at every step.

## Detection Tools

Run these in parallel to collect findings:

```bash
# Unused files, exports, dependencies, types
npx knip

# Unused npm dependencies
npx depcheck

# Unused TypeScript exports
npx ts-prune

# Unused eslint disable-directives
npx eslint . --report-unused-disable-directives
```

## Refactoring Workflow

### Phase 1: Analysis

1. Run all detection tools in parallel
2. Collect and deduplicate findings
3. Categorize by risk level:
   - **SAFE** — Unused exports, unused dependencies, dead branches, commented-out code
   - **CAREFUL** — Potentially used via dynamic imports or reflection
   - **RISKY** — Public API surface, shared utilities, config files

### Phase 2: Risk Assessment

For each candidate removal:

1. Grep for all references (including string patterns for dynamic imports)
2. Check if part of public API or external contract
3. Review git history for context on why code exists
4. Assess build/test impact

### Phase 3: Safe Removal

Process one category at a time, starting with SAFE items only:

1. Unused npm dependencies
2. Unused internal exports
3. Unused files
4. Duplicate code

After each batch:

- Run full test suite
- Verify build succeeds
- Commit changes
- Update deletion log

### Phase 4: Duplicate Consolidation

1. Identify duplicate components/utilities
2. Choose the best implementation (most complete, best tested, most recent)
3. Update all imports to use the chosen version
4. Delete duplicates
5. Verify tests pass

## Safety Checklist

**Before removing anything:**

- [ ] Detection tools ran
- [ ] All references grepped
- [ ] Dynamic imports checked
- [ ] Git history reviewed
- [ ] Public API impact assessed
- [ ] Tests pass
- [ ] Working on feature branch

**After each removal batch:**

- [ ] Build succeeds
- [ ] Tests pass
- [ ] No console errors
- [ ] Changes committed
- [ ] Deletion log updated

## Common Patterns to Remove

**Unused imports:**

```typescript
// ❌ Only useState used
import { useState, useEffect, useMemo } from 'react';
// ✅
import { useState } from 'react';
```

**Dead code branches:**

```typescript
// ❌ Unreachable
if (false) { doSomething(); }
// ❌ No references in codebase
export function unusedHelper() { ... }
```

**Duplicate components:**

```
// ❌ Multiple similar components
components/Button.tsx, PrimaryButton.tsx, NewButton.tsx
// ✅ Consolidate with variant prop
components/Button.tsx
```

**Unused dependencies:**

```json
{
  "dependencies": {
    "lodash": "^4.17.21",
    "moment": "^2.29.4"
  }
}
```

## Deletion Log Format

Create/update `docs/DELETION_LOG.md`:

```markdown
## [YYYY-MM-DD] Refactor Session

### Unused Dependencies Removed

- package-name@version - Last used: never, Size: XX KB

### Unused Files Deleted

- src/old-component.tsx - Replaced by: src/new-component.tsx

### Duplicate Code Consolidated

- src/Button1.tsx + Button2.tsx → Button.tsx

### Unused Exports Removed

- src/utils/helpers.ts - Functions: foo(), bar()

### Impact

- Files deleted: N | Dependencies removed: N | Lines removed: N | Bundle reduction: ~N KB

### Testing

- Unit tests: ✓ | Integration tests: ✓ | Manual testing: ✓
```

## PR Template

```markdown
## Refactor: Code Cleanup

### Summary

Dead code cleanup removing unused exports, dependencies, and duplicates.

### Changes

- Removed X unused files
- Removed Y unused dependencies
- Consolidated Z duplicate components
- See docs/DELETION_LOG.md for details

### Testing

- [x] Build passes
- [x] All tests pass
- [x] No console errors

### Impact

- Bundle size: -XX KB
- Lines of code: -XXXX
- Dependencies: -X packages

### Risk Level

🟢 LOW - Only removed verifiably unused code
```

## Error Recovery

If something breaks after removal:

1. **Immediate rollback:** `git revert HEAD && npm install && npm run build && npm test`
2. **Investigate:** Was it a dynamic import? Detection tools missed it?
3. **Fix forward:** Mark item as "DO NOT REMOVE", document why tools missed it
4. **Update process:** Add to protected list, improve grep patterns

## Best Practices

1. Remove one category at a time
2. Run tests after each batch
3. Document everything in DELETION_LOG.md
4. When in doubt, don't remove
5. One commit per logical removal batch
6. Always work on feature branch
7. Have deletions reviewed before merging
8. Monitor production after deployment

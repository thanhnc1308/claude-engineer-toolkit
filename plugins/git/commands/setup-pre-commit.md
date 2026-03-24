---
description: Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. Use when user wants to add pre-commit hooks, set up Husky, configure lint-staged, or add commit-time formatting/typechecking/testing.
allowed-tools: Bash(npx husky:*), Bash(npm install:*), Bash(npm run:*), Bash(npx lint-staged:*), Bash(pnpm install:*), Bash(pnpm run:*), Bash(yarn add:*), Bash(yarn run:*), Bash(bun add:*), Bash(bun run:*), Bash(cat:*), Bash(chmod:*), Read, Write, Glob
---

## Context

- package.json: !`cat package.json`
- Lock files present: !`ls -1 package-lock.json pnpm-lock.yaml yarn.lock bun.lockb 2>/dev/null || echo "none found"`
- Existing Prettier config: !`ls -1 .prettierrc .prettierrc.json .prettierrc.js .prettierrc.cjs .prettierrc.yaml .prettierrc.yml prettier.config.js prettier.config.cjs 2>/dev/null || echo "none found"`
- Existing Husky dir: !`ls -d .husky 2>/dev/null || echo "not found"`

## Workflow

### 1. Detect package manager

From the lock files in Context above:

- `package-lock.json` → npm
- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → yarn
- `bun.lockb` → bun
- If none found, default to npm.

### 2. Install dependencies

Install `husky`, `lint-staged`, and `prettier` as devDependencies using the detected package manager:

- npm: `npm install -D husky lint-staged prettier`
- pnpm: `pnpm install -D husky lint-staged prettier`
- yarn: `yarn add -D husky lint-staged prettier`
- bun: `bun add -D husky lint-staged prettier`

### 3. Initialize Husky

Run `npx husky init`. This creates the `.husky/` directory and adds `"prepare": "husky"` to package.json.

### 4. Create `.husky/pre-commit`

Write the `.husky/pre-commit` file (no shebang needed for Husky v9+).

Include these lines, replacing `npm` with the detected package manager:

```
npx lint-staged
```

Additionally, check if `typecheck` and `test` scripts exist in package.json from Context above:

- If `typecheck` script exists, add: `<pm> run typecheck`
- If `test` script exists, add: `<pm> run test`
- If either is missing, omit that line and tell the user it was skipped.

### 5. Create `.lintstagedrc`

Write `.lintstagedrc` with:

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. Create `.prettierrc` (only if missing)

From the Context above, if no Prettier config exists, create `.prettierrc` with:

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": true,
  "printWidth": 120,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

If a Prettier config already exists, skip this step and tell the user.

### 7. Verify

Run these checks and report results:

- `.husky/pre-commit` exists and is executable
- `.lintstagedrc` exists
- `prepare` script in package.json is set to `"husky"`
- A Prettier config exists
- Run `npx lint-staged` to smoke-test the setup

### 8. Stage and commit

Stage all changed/created files and commit with message:

```
chore(hooks): add pre-commit hooks (husky + lint-staged + prettier)
```

This commit will run through the new pre-commit hooks — a good smoke test.

## Notes

- Husky v9+ doesn't need shebangs in hook files.
- `prettier --ignore-unknown` skips files Prettier can't parse (images, binaries, etc.).
- The pre-commit runs lint-staged first (fast, staged-only), then full typecheck and tests if available.
- **NEVER** automatically add AI attribution signatures.

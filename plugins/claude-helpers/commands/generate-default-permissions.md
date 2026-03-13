---
description: Allow Claude Code to read, grep, and glob project source while denying access to sensitive files
user-invocable: true
argument-hint: [project path]
---

Generate `.claude/settings.local.json` in the target project (or current directory if `$ARGUMENTS` is empty) so Claude Code can freely read, grep, and glob source files but cannot access sensitive files.

## Steps

### 1. Scan the Project

Use Glob to detect the project's language stack:

- Check for `package.json` (JS/TS project)
- Check for `composer.json` (PHP project)

Also use Glob to check which of these sensitive files/directories exist in the project:

- `.env`, `.env.*`
- `secrets/`, `.secrets/`
- `*credentials*`, `*service-account*`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`
- `terraform.tfvars`, `*.tfvars`

Also read `.gitignore` if it exists — gitignored patterns often indicate sensitive files. Extract relevant patterns from it.

Do NOT read the contents of any sensitive files — only check for existence.

### 2. Build Settings

Create the settings object with two sections:

**Allow rules** — permit source reading tools on the whole project, plus language-specific tooling commands:

```json
"allow": [
  "Read",
  "Grep",
  "Glob"
]
```

Then detect the project's language stack and add Bash allow rules accordingly:

- **JS/TS project** (has `package.json`): add `"Bash(npm run lint)"`, `"Bash(npm run test)"`, `"Bash(pnpm run lint)"`, `"Bash(pnpm run test)"`
- **PHP project** (has `composer.json`): add `"Bash(./vendor/bin/phpunit)"`, `"Bash(vendor/bin/phpunit)"`, `"Bash(php-cs-fixer fix)"`

If the project matches multiple stacks, include rules for all of them.

**Deny rules** — always include these baseline rules plus any project-specific ones found in step 1:

```json
"deny": [
  "Read(./.env)",
  "Read(./.env.*)",
  "Read(./secrets/**)",
  "Read(./.secrets/**)",
  "Read(./**/*.pem)",
  "Read(./**/*.key)",
  "Read(./**/*.p12)",
  "Read(./**/*.pfx)",
  "Read(./**/*credentials*)",
  "Read(./**/*service-account*)"
]
```

### 3. Present and Confirm

Show the user the proposed `.claude/settings.local.json` and ask for confirmation before writing.

### 4. Write or Merge

- If `.claude/settings.local.json` already exists, read it and merge new rules into the existing `permissions` (deduplicate, preserve all other settings).
- If it does not exist, create `.claude/` directory if needed and write `settings.local.json`.

### 5. Summary

Tell the user:

- Settings are in `.claude/settings.local.json` (local only, not committed to git)
- They can re-run `/generate-default-permissions` anytime to update rules after adding new sensitive files

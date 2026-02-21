# Claude Engineer Toolkit

A personal Claude Code plugin marketplace for full-stack software engineering. Install individual plugins per project to get context-aware skills, rules, agents, and commands.

## Tech Stack

- Node.js >= 22 (CommonJS)
- ESLint 9 (flat config), markdownlint, commitlint (conventional commits)
- No runtime framework — this is a content/tooling repo (markdown plugins + validation scripts)

## Commands

Lint: `npm run lint`
Test (validate all components): `npm test`
Validate single component: `node scripts/ci/validate-agents.js` (or validate-commands, validate-rules, validate-skills, validate-hooks, validate-plugin-json)
Init new plugin: `./scripts/init-plugin.sh <plugin-name>`

## Architecture

Plugin marketplace structure. Each plugin lives under `plugins/<name>/` with a standardized directory layout. CI validation scripts ensure all plugins conform to required schemas.

Key directories:

- `plugins/` — 7 plugins (dev-workflow, typescript, nestjs, fundamentals, ecosystem-tools, nextjs, sql-database), each with skills/, commands/, agents/, rules/
- `scripts/ci/` — Node.js validation scripts run in CI to enforce structure (frontmatter, required fields, SKILL.md presence, plugin.json integrity)
- `scripts/lib/` — Shared utilities (package-manager, session-manager, utils)
- `.claude-plugin/marketplace.json` — Plugin registry for the marketplace
- `.github/workflows/ci.yml` — CI: validate components, lint, security scan

## Code Conventions

- Naming: camelCase for JS variables/functions, kebab-case for files and directories
- Imports: CommonJS `require()` throughout (sourceType: commonjs)
- Error handling: `process.exit(1)` on validation failure, console.error for reporting
- File naming: `validate-<component>.js` for CI scripts, `<plugin-name>/` directories match plugin `name` in plugin.json
- Commit messages: Conventional Commits (feat, fix, docs, refactor, etc.) enforced by commitlint, max 100 char header

## Testing

- Framework: Custom Node.js validation scripts (no test runner)
- Pattern: One validator per component type in `scripts/ci/`
- Run all: `npm test`
- Run single: `node scripts/ci/validate-agents.js`

## Patterns and Practices

- Each plugin has `.claude-plugin/plugin.json` with required fields: name, version, description, license
- Plugin name in plugin.json must match its directory name
- Agent markdown files require frontmatter with `model` and `tools` fields
- Each skill directory must contain a `SKILL.md` file
- Skills use gerund naming (e.g., `reviewing-nextjs`, `generating-components`)
- Markdown files use YAML frontmatter for metadata (name, description, model, tools)
- CI runs 6 validators + ESLint + markdownlint on every push/PR to main

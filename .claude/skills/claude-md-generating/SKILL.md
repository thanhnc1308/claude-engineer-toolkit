---
name: claude-md-generating
description: Use when setting up Claude Code for a project, onboarding Claude to a codebase, or when asked to create or update a CLAUDE.md file. Triggers on "generate CLAUDE.md", "create project config", "set up Claude for this project", or "onboard Claude".
---

# Generating CLAUDE.md

Analyze a project's structure, configuration, and code patterns to generate a tailored CLAUDE.md that gives Claude Code the context it needs to work effectively.

## When to Use

- Setting up Claude Code for a new or existing project
- User asks to create or update CLAUDE.md
- Onboarding Claude to an unfamiliar codebase
- **Not for:** Personal preferences (use user settings), temporary notes, or CI/CD config

## Process

### Phase 1: Discover Project Signals

Scan these files in order. Stop reading each after extracting relevant info:

| Signal            | Files to Check                                                                              | Extract                                   |
| ----------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Identity**      | `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `*.csproj`, `pom.xml`, `Gemfile`  | Name, description, language, dependencies |
| **Build**         | `Makefile`, `justfile`, `package.json` scripts, `Taskfile.yml`, `build.gradle`              | Build, test, lint, format commands        |
| **Config**        | `tsconfig.json`, `.eslintrc*`, `.prettierrc*`, `ruff.toml`, `rustfmt.toml`, `.editorconfig` | Style rules, strictness settings          |
| **Infra**         | `Dockerfile`, `docker-compose.yml`, `.env.example`                                          | Runtime environment, services             |
| **CI**            | `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`                                       | Quality gates, required checks            |
| **Structure**     | Top-level directories, `src/`, `lib/`, `tests/`, `docs/`                                    | Architecture layout                       |
| **Existing docs** | `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`, `ARCHITECTURE.md`                              | Existing conventions — do not duplicate   |

### Phase 2: Analyze Code Patterns

Read 3-5 representative source files (not tests, not config) to identify:

- Naming conventions (camelCase, snake_case, file naming)
- Import/export patterns (absolute, relative, barrel exports, path aliases)
- Error handling approach (custom classes, Result types, try/catch)
- Testing patterns (framework, file naming, assertion style) — read 1-2 test files
- Code organization (modules, layers, separation of concerns)

### Phase 3: Generate CLAUDE.md

Fill the template below. **Omit sections that do not apply.** Keep total output under 150 lines.

Present the draft to the user for review before writing to disk.

## Output Template

```markdown
# {Project Name}

{One-line description from manifest or README.}

## Tech Stack

- {Language/runtime and version}
- {Framework and version}
- {Key libraries — max 5, architectural ones only}

## Commands

Build: `{command}`
Test: `{command}`
Test single: `{command -- path/to/test}`
Lint: `{command}`
Format: `{command}`
Dev server: `{command}`

## Architecture

{1-3 sentences on the architecture pattern.}

Key directories:

- `src/` — {purpose}
- `tests/` — {purpose}
- {other significant directories}

## Code Conventions

- Naming: {observed pattern}
- Imports: {observed pattern}
- Error handling: {observed pattern}
- File naming: {observed pattern}

## Testing

- Framework: {name}
- Pattern: {file naming, location}
- Run single test: `{exact command}`

## Patterns and Practices

- {Observed pattern — max 7 items}
```

## Less Is More

CLAUDE.md is loaded into every Claude Code session. Every unnecessary line wastes context and dilutes the instructions that matter. Target **under 150 total instructions** (bullet points, commands, rules). If the file exceeds 150 instructions, cut ruthlessly:

1. **Rank by impact** — keep instructions that prevent real mistakes or save real time. Drop "nice to know" items.
2. **Prefer commands over prose** — `Test single: npm test -- path` is worth more than a paragraph explaining the test philosophy.
3. **Audit on update** — every time you add an instruction, look for one to remove. The file should not grow monotonically.
4. **80% usage rule** — every instruction in CLAUDE.md should be relevant to at least 80% of sessions. If an instruction only applies to specific tasks (deployments, migrations, rare workflows), move it to a separate file via Progressive Disclosure. CLAUDE.md is not a knowledge base — it is a hot path that Claude reads every single time.

If in doubt, leave it out. A lean 100-instruction file that Claude follows reliably beats a 300-instruction file it partially ignores.

## Progressive Disclosure

CLAUDE.md should contain only universal project context. Move task-specific instructions into separate files that Claude reads on demand:

```
CLAUDE.md                        ← universal context (always loaded)
docs/claude/deploying.md         ← deployment procedures
docs/claude/database-migrations.md ← migration workflow
docs/claude/api-conventions.md   ← API design rules
```

**Rules:**

1. **CLAUDE.md = always relevant** — if an instruction only matters for one type of task, it does not belong in CLAUDE.md.
2. **Reference, don't inline** — add a one-line pointer in CLAUDE.md: `For deployment: read docs/claude/deploying.md`. Claude will read it when needed.
3. **One file per concern** — each separate file covers a single workflow or domain area. Keep them focused and under 100 lines each.
4. **Let Claude discover** — well-named files in predictable locations (`docs/claude/`, `.claude/docs/`) are found naturally. Only add explicit pointers for non-obvious locations.

This keeps CLAUDE.md lean while giving Claude access to deep context exactly when it needs it.

## Common Mistakes

- **Including generic knowledge**: Do not explain what React or Express is. Only include project-specific context.
- **Duplicating README**: CLAUDE.md is for Claude, not humans. Focus on working-in-the-codebase context.
- **Missing commands**: Always include exact build/test/lint commands. These save the most time.
- **Over-length**: Keep under 150 lines. Claude loads this every session — bloat wastes context.
- **Inventing conventions**: Only document patterns observed in actual code. Never guess.
- **Growing without pruning**: Every addition should trigger a review for removals. CLAUDE.md must stay lean.

## Quick Reference

1. Scan config files (Phase 1)
2. Read 3-5 source files (Phase 2)
3. Generate from template (Phase 3)
4. Present draft to user before saving

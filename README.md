# Claude Engineer Toolkit

A personal Claude Code plugin marketplace for full-stack software engineering. Install individual plugins per project to get context-aware skills, rules, agents, and commands.

## Requirements

- elements-of-style:writing-clearly-and-concisely skill

## Installation

Add this marketplace to Claude Code:

```bash
/plugin marketplace add thanhnc1308/claude-engineer-toolkit
```

Then install plugins per project:

```bash
/plugin install <plugin-name>@claude-engineer-toolkit
```

## Plugins

### dev-workflow

Universal development workflow for any project type.

**Commands:** `/brainstorm`, `/plan`, `/review`

| Component | Description                                 |
| --------- | ------------------------------------------- |
| Skills    | `brainstorming`, `planning`, `reviewing`    |
| Agent     | `code-reviewer` — deep code review analysis |
| Rules     | Development lifecycle, commit conventions   |

```bash
/plugin install dev-workflow@claude-engineer-toolkit
```

---

### typescript

TypeScript conventions and type safety patterns. Shared across any TypeScript project.

**Commands:** `/ts-review`, `/ts-refactor`

| Component | Description                                      |
| --------- | ------------------------------------------------ |
| Skills    | `reviewing-typescript`, `refactoring-typescript` |
| Agent     | `typescript-reviewer` — type system analysis     |
| Rules     | Type safety, naming conventions                  |

```bash
/plugin install typescript@claude-engineer-toolkit
```

---

### nestjs

NestJS architecture, dependency injection, and module organization.

**Commands:** `/nest-review`, `/nest-generate`

| Component | Description                                    |
| --------- | ---------------------------------------------- |
| Skills    | `reviewing-nestjs`, `generating-nestjs`        |
| Agents    | `nestjs-architect`, `nestjs-reviewer`          |
| Rules     | Architecture, DI patterns, module organization |

```bash
/plugin install nestjs@claude-engineer-toolkit
```

## Example: Setting up a NestJS project

```bash
/plugin install dev-workflow@claude-engineer-toolkit
/plugin install typescript@claude-engineer-toolkit
/plugin install nestjs@claude-engineer-toolkit
```

Then use the commands:

```bash
/brainstorm How should we implement the caching layer?
/plan Add user authentication with JWT
/review src/auth/auth.service.ts
/ts-review src/shared/utils.ts
/nest-generate order module with CRUD operations
```

## Adding a New Plugin

1. Create a directory under `plugins/<plugin-name>/`
2. Add `.claude-plugin/plugin.json` with name, version, description
3. Add `skills/`, `commands/`, `agents/`, `rules/` directories as needed
4. Use **gerund naming** for skills (e.g., `reviewing-nextjs`, `generating-components`)
5. Add a command file for each user-invocable skill
6. Register the plugin in `.claude-plugin/marketplace.json`

## License

MIT

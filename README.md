# Claude Engineer Toolkit

A personal Claude Code plugin marketplace for full-stack software engineering. Install individual plugins per project to get context-aware skills, rules, agents, and commands.

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

- [dev-workflow](docs/dev-workflow/README.md): Universal development workflow for any project type.

```bash
/plugin install dev-workflow@claude-engineer-toolkit
```

---

- [typeScript](docs/typeScript/README.md)

```bash
/plugin install typescript@claude-engineer-toolkit
```

---

- [nestjs](docs/nestjs/README.md): NestJS architecture, dependency injection, and module organization.

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

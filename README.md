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

| Plugin                                      | Category    | Description                                                            |
| ------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| [dev-workflow](plugins/dev-workflow/)       | workflow    | Brainstorming, planning, implementing, reviewing, and verification     |
| [typescript](plugins/typescript/)           | language    | TypeScript conventions, type safety, and refactoring patterns          |
| [nestjs](plugins/nestjs/)                   | framework   | NestJS architecture, DI patterns, and module organization              |
| [fundamentals](plugins/fundamentals/)       | general     | Core coding standards, security best practices, and hooks              |
| [ecosystem-tools](plugins/ecosystem-tools/) | development | Tools for creating and managing skills, commands, and plugins          |
| [nextjs](plugins/nextjs/)                   | framework   | Next.js best practices, App Router patterns, and frontend architecture |
| [sql-database](plugins/sql-database/)       | database    | SQL database design, query optimization, and schema management         |

Install any plugin:

```bash
/plugin install <plugin-name>@claude-engineer-toolkit
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

### Quick Start

```bash
chmod +x scripts/init-plugin.sh
./scripts/init-plugin.sh ecosystem-tools
```

### Manual Steps

1. Create a directory under `plugins/<plugin-name>/`
2. Add `.claude-plugin/plugin.json` with name, version, description
3. Add `skills/`, `commands/`, `agents/`, `rules/` directories as needed
4. Use **gerund naming** for skills (e.g., `reviewing-nextjs`, `generating-components`)
5. Add a command file for each user-invocable skill
6. Register the plugin in `.claude-plugin/marketplace.json`

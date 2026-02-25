# Claude Engineer Toolkit

A personal Claude Code plugin marketplace for full-stack software engineering. Install individual plugins per project to get context-aware skills, rules, agents, and commands.

18 plugins | 75+ skills | 16 commands | 5 agents

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

### Frameworks

Knowledge plugins that provide architecture patterns, code review checklists, and refactoring catalogs.

| Plugin       | Description                                           |
| ------------ | ----------------------------------------------------- |
| `nestjs`     | NestJS architecture, DI patterns, module organization |
| `nextjs`     | Next.js App Router architecture and patterns          |
| `typescript` | TypeScript conventions, type safety, refactoring      |
| `php`        | PHP/Silex/Symfony architecture and patterns           |

### Development Workflow

| Plugin         | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| `dev-workflow` | Planning, brainstorming, TDD, code review, refactoring, security audits |

### Tools

| Plugin                  | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `backend-tools`         | Backend development, API patterns, authentication                    |
| `frontend-tools`        | React, UI styling, 3D visualization, web testing, browser automation |
| `database-tools`        | Database management, query optimization, schema design               |
| `debugging-tools`       | Debugging utilities, diagnostics, error analysis                     |
| `devops-tools`          | CI/CD, Docker, Kubernetes, Cloudflare, GCP                           |
| `ai-ml-tools`           | AI/ML tools, Gemini API, context engineering                         |
| `media-tools`           | FFmpeg, ImageMagick, media processing                                |
| `document-tools`        | Document processing and content generation                           |
| `research-tools`        | Documentation search, repository analysis                            |
| `problem-solving-tools` | Analytical frameworks, decision tools                                |
| `specialized-tools`     | Mermaid diagrams, sequential thinking                                |
| `meta-tools`            | Skill creation, code review practices                                |
| `platform-tools`        | Claude Code integration, MCP, session management, Shopify            |

## Commands

### dev-workflow

| Command                  | Description                              |
| ------------------------ | ---------------------------------------- |
| `/brainstorm [topic]`    | Start a brainstorming session            |
| `/plan [feature]`        | Create a structured implementation plan  |
| `/review`                | Comprehensive code review                |
| `/code-review`           | Review code using code-reviewer agent    |
| `/tdd`                   | Enforce test-driven development          |
| `/refactor`              | Safely identify and remove dead code     |
| `/research [technology]` | Conduct structured multi-source research |
| `/test-coverage`         | Analyze test coverage                    |
| `/verify`                | Verify work before claiming completion   |
| `/orchestrate`           | Orchestrate multi-agent workflow         |
| `/update-docs`           | Update documentation                     |
| `/update-codemaps`       | Update code maps                         |

### platform-tools

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `/generate-claude-md` | Generate CLAUDE.md for current project         |
| `/learn`              | Extract reusable patterns from current session |
| `/sessions`           | Manage session history and aliases             |
| `/use-mcp`            | Utilize MCP server tools                       |

### meta-tools

| Command  | Description              |
| -------- | ------------------------ |
| `/skill` | Create and manage skills |
| `/git`   | Git command integration  |

## Examples

### NestJS Project

```bash
/plugin install dev-workflow@claude-engineer-toolkit
/plugin install backend-tools@claude-engineer-toolkit
/plugin install debugging-tools@claude-engineer-toolkit
/plugin install typescript@claude-engineer-toolkit
/plugin install nestjs@claude-engineer-toolkit
```

```bash
/brainstorm How should we implement the caching layer?
/plan Add user authentication with JWT
/review
/tdd
```

### Next.js Project

```bash
/plugin install dev-workflow@claude-engineer-toolkit
/plugin install frontend-tools@claude-engineer-toolkit
/plugin install typescript@claude-engineer-toolkit
/plugin install nextjs@claude-engineer-toolkit
```

```bash
/plan Add dark mode with theme persistence
/review
/research React Server Components best practices
```

### Full-Stack Project

```bash
/plugin install dev-workflow@claude-engineer-toolkit
/plugin install backend-tools@claude-engineer-toolkit
/plugin install frontend-tools@claude-engineer-toolkit
/plugin install database-tools@claude-engineer-toolkit
/plugin install debugging-tools@claude-engineer-toolkit
/plugin install devops-tools@claude-engineer-toolkit
/plugin install typescript@claude-engineer-toolkit
/plugin install platform-tools@claude-engineer-toolkit
```

## Adding a New Plugin

### Quick Start

```bash
chmod +x scripts/init-plugin.sh
./scripts/init-plugin.sh new-tools
```

### Manual Steps

1. Create a directory under `plugins/<plugin-name>/`
2. Add `.claude-plugin/plugin.json` with name, version, description
3. Add `skills/`, `commands/`, `agents/`, `rules/` directories as needed
4. Use **gerund naming** for skills (e.g., `reviewing-nextjs`, `generating-components`)
5. Add a command file for each user-invocable skill
6. Register the plugin in `.claude-plugin/marketplace.json`

## References

- [superpowers](https://github.com/obra/superpowers)
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- [claudekit-skills](https://github.com/mrgoonie/claudekit-skills)

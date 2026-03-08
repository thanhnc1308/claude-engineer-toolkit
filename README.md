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

| Plugin        | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| `feature-dev` | Planning, brainstorming, TDD, code review, refactoring, security audits |

### Tools

| Plugin            | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `backend`         | Backend development, API patterns, authentication                    |
| `frontend`        | React, UI styling, 3D visualization, web testing, browser automation |
| `database`        | Database management, query optimization, schema design               |
| `debugging`       | Debugging utilities, diagnostics, error analysis                     |
| `devops`          | CI/CD, Docker, Kubernetes, Cloudflare, GCP                           |
| `ai-ml`           | AI/ML tools, Gemini API, context engineering                         |
| `media`           | FFmpeg, ImageMagick, media processing                                |
| `document`        | Document processing and content generation                           |
| `research`        | Documentation search, repository analysis                            |
| `problem-solving` | Analytical frameworks, decision tools                                |
| `specialized`     | Mermaid diagrams, sequential thinking                                |
| `meta`            | Skill creation, code review practices                                |
| `platform`        | Claude Code integration, MCP, session management, Shopify            |

## Commands

### feature-dev

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

### platform

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `/generate-claude-md` | Generate CLAUDE.md for current project         |
| `/learn`              | Extract reusable patterns from current session |
| `/sessions`           | Manage session history and aliases             |
| `/use-mcp`            | Utilize MCP server tools                       |

### meta

| Command  | Description              |
| -------- | ------------------------ |
| `/skill` | Create and manage skills |
| `/git`   | Git command integration  |

## Examples

### Common

```bash
/plugin install ai-ml@claude-engineer-toolkit
/plugin install meta@claude-engineer-toolkit
/plugin install platform@claude-engineer-toolkit
/plugin install problem-solving@claude-engineer-toolkit
/plugin install research@claude-engineer-toolkit
/plugin install specialized@claude-engineer-toolkit
```

### NestJS Project

```bash
/plugin install feature-dev@claude-engineer-toolkit
/plugin install backend@claude-engineer-toolkit
/plugin install debugging@claude-engineer-toolkit
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
/plugin install feature-dev@claude-engineer-toolkit
/plugin install frontend@claude-engineer-toolkit
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
/plugin install feature-dev@claude-engineer-toolkit
/plugin install backend@claude-engineer-toolkit
/plugin install frontend@claude-engineer-toolkit
/plugin install database@claude-engineer-toolkit
/plugin install debugging@claude-engineer-toolkit
/plugin install devops@claude-engineer-toolkit
/plugin install typescript@claude-engineer-toolkit
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

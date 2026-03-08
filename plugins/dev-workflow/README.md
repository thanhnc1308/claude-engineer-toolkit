# dev-workflow

Full-stack development workflow with 16 specialized agents, 17 skills, and 11 commands for planning, implementing, reviewing, and shipping code.

## Agents

### Core Workflow

| Agent            | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| **planner**      | Creates detailed implementation plans with bite-sized tasks             |
| **architect**    | System design, scalability analysis, technical decisions                |
| **researcher**   | Multi-source technology research across docs, GitHub, articles          |
| **brainstormer** | Challenges assumptions, debates approaches, provides honest assessments |

### Quality Gates

| Agent                    | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| **code-reviewer**        | Reviews code for quality, security, and maintainability |
| **security-reviewer**    | OWASP Top 10, secrets detection, injection risks        |
| **performance-reviewer** | N+1 queries, missing indexes, caching, bottlenecks      |
| **tdd-guide**            | Enforces test-first methodology, 80%+ coverage          |

### Specialized Analysis

| Agent                     | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| **code-explorer**         | Traces execution paths, maps architecture layers      |
| **code-comment-analyzer** | Reviews comments for accuracy and maintainability     |
| **type-design-analyzer**  | Analyzes type invariants, encapsulation, enforcement  |
| **silent-failure-hunter** | Finds suppressed errors and inadequate error handling |
| **pr-test-analyzer**      | Reviews PR test coverage for gaps                     |

### Action

| Agent                | Description                                               |
| -------------------- | --------------------------------------------------------- |
| **refactor-cleaner** | Dead code removal with test verification                  |
| **e2e-runner**       | End-to-end testing with Vercel Agent Browser / Playwright |
| **code-simplifier**  | Code clarity and consistency improvements                 |

## Commands

### `/plan [feature]`

Create a structured implementation plan with phases, risks, and acceptance criteria.

### `/brainstorm [topic]`

Interactive brainstorming session for exploring ideas and trade-offs.

### `/research [topic]`

Multi-source technology research across docs, GitHub, and articles.

### `/review`

Comprehensive code review using the code-reviewer agent.

### `/tdd [feature]`

Test-Driven Development: scaffold interfaces, generate tests first, then implement.

### `/test-coverage`

Analyze test coverage and generate missing tests for edge cases and error handling.

### `/refactor`

Safely identify and remove dead code with test verification.

### `/orchestrate [workflow] [description]`

Sequential agent workflow. Built-in workflows:

- `feature` — planner -> tdd-guide -> code-reviewer -> security-reviewer
- `bugfix` — code-explorer -> tdd-guide -> code-reviewer
- `refactor` — architect -> code-reviewer -> tdd-guide
- `security` — security-reviewer -> code-reviewer -> architect
- `custom "agent1,agent2" "description"` — custom agent sequence

### `/verify`

Comprehensive verification: build, types, lint, tests, console.log audit, git status.

### `/update-codemaps`

Analyze codebase structure and update architecture documentation.

### `/update-docs`

Sync documentation from source-of-truth files (package.json, .env.example).

## Rules

- **verification-before-completion** — Always-on rule requiring fresh verification evidence before any completion claims.

## Key Skills

- **planning** / **executing-plans** / **subagent-driven-development** — Plan and execute work
- **code-review** / **receiving-code-review** / **requesting-code-review** — Review workflows
- **verification-before-completion** — Evidence before claims
- **test-driven-development** — Red-green-refactor cycle
- **dispatching-parallel-agents** — Parallel agent dispatch for independent tasks
- **security-audit** / **performance-check** — Security and performance auditing
- **using-git-worktrees** — Isolated workspaces
- **finishing-a-development-branch** — Branch completion and integration

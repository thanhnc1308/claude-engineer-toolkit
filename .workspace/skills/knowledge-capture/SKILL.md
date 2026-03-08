---
name: knowledge-capture
description: Capture domain knowledge, patterns, and architectural decisions from the current project into a reusable reference skill. Use when the user wants to document project context for future Claude sessions, such as "capture this domain knowledge", "document project patterns", "save context for future sessions", or "create a reference skill from this codebase".
---

# Knowledge Capture

Create a new skill with reference files that document domain knowledge, patterns, and decisions from the current working context.

## Workflow

### 1. Gather Context

Explore the codebase to understand:

- **Architecture**: Project structure, key modules, dependencies
- **Domain logic**: Business rules, data models, workflows
- **Patterns**: Coding conventions, design patterns in use
- **Decisions**: Why certain approaches were chosen (check comments, commit history)

Use Explore agent or direct file reading based on project size.

### 2. Ask for Skill Name and Scope

Ask the user:

- What to name the skill (e.g., `myproject-context`, `auth-domain`)
- What aspects to focus on (architecture, domain logic, API patterns, all)

### 3. Create the Skill

Run the init script:

```bash
python3 ~/.claude/skills/skill-creator/scripts/init_skill.py <skill-name> --path .claude/skills
```

### 4. Write Reference Files

Create focused reference files in `references/`:

| File              | Contents                                  |
| ----------------- | ----------------------------------------- |
| `architecture.md` | Project structure, key modules, data flow |
| `domain.md`       | Business rules, data models, terminology  |
| `patterns.md`     | Coding conventions, design patterns       |
| `decisions.md`    | Key architectural decisions and rationale |

Only create files relevant to the captured scope. Keep each under 500 lines.

### 5. Write SKILL.md

Use this template for the generated skill:

```markdown
---
name: <skill-name>
description: Domain knowledge and context for <project/domain>. Use when working on <project> or related tasks to understand architecture, patterns, and domain logic.
---

# <Project/Domain> Context

Reference documentation for working with <project/domain>.

## Quick Reference

- **Tech stack**: [list key technologies]
- **Key modules**: [list main modules/components]
- **Entry points**: [list main entry files]

## References

- [architecture.md](references/architecture.md) - Project structure and data flow
- [domain.md](references/domain.md) - Business rules and data models
- [patterns.md](references/patterns.md) - Coding conventions
- [decisions.md](references/decisions.md) - Architectural decisions
```

### 6. Clean Up and Validate

Delete unused example files, then validate:

```bash
python3 ~/.claude/skills/skill-creator/scripts/package_skill.py .claude/skills/<skill-name>
```

## What to Capture

**Always capture:**

- Project structure overview
- Key terminology and concepts
- Data models and relationships

**Capture if present:**

- Authentication/authorization patterns
- API conventions and endpoints
- State management approach
- Testing patterns
- Error handling conventions
- Configuration and environment setup

**Skip:**

- Implementation details that are obvious from code
- External library documentation (link instead)
- Information that changes frequently

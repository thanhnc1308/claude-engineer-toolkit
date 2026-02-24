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

Install any plugin:

```bash
/plugin install <plugin-name>@claude-engineer-toolkit
```

## Example

1. NestJS

```bash
/plugin install fundamentals@claude-engineer-toolkit
/plugin install dev-workflow@claude-engineer-toolkit
/plugin install backend-tools@claude-engineer-toolkit
/plugin install debugging-tools@claude-engineer-toolkit
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
./scripts/init-plugin.sh new-tools
```

### Manual Steps

1. Create a directory under `plugins/<plugin-name>/`
2. Add `.claude-plugin/plugin.json` with name, version, description
3. Add `skills/`, `commands/`, `agents/`, `rules/` directories as needed
4. Use **gerund naming** for skills (e.g., `reviewing-nextjs`, `generating-components`)
5. Add a command file for each user-invocable skill
6. Register the plugin in `.claude-plugin/marketplace.json`

## Create symlink

```bash
# Remove the broken symlink
rm path/to/directory

# Create a new symlink pointing to the correct skill
ln -s ../../../.claude/skills/creating-skill plugins/document-tools/skills/creating-skill

# Find broken symlinks
find . -type l ! -exec test -e {} \; -print

# Delete broken symlinks
find . -type l ! -exec test -e {} \; -delete
```

## References

- [superpowers](https://github.com/obra/superpowers)
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- [claudekit-skills](https://github.com/mrgoonie/claudekit-skills)

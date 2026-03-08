# Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring without behavior change
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `chore`: Build, CI, tooling changes
- `perf`: Performance improvements
- `ci`: CI workflow changes

## Special rules for `.claude/` directory

- Changes to existing Markdown files in `.claude/` should use `perf:` (instead of `docs:`)
- New files in `.claude/` directory should use `feat:` (instead of `docs:` or `perf:`)

## Writing rules

- Write in imperative mood: "add feature" not "added feature"
- Keep the subject line under 72 characters
- Separate subject from body with a blank line
- Use the body to explain **why**, not **what** (the diff shows what)
- Make atomic commits — one logical change per commit
- If there are new files and file changes at the same time, split them into separate commits

## AI attribution

**NEVER** automatically add AI attribution signatures like:

- "Generated with [Claude Code]"
- "Co-Authored-By: Claude noreply@anthropic.com"
- Any AI tool attribution or signature

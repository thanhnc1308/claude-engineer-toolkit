# Commit Conventions

## Message Format

Use Conventional Commits format:

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

## Rules

- Write in imperative mood: "add feature" not "added feature"
- Keep the subject line under 72 characters
- Separate subject from body with a blank line
- Use the body to explain **why**, not **what** (the diff shows what)
- Make atomic commits — one logical change per commit
- Never commit secrets, credentials, or environment files

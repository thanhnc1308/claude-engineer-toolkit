# git

Git workflow commands with shared Conventional Commits conventions.

## Installation

```bash
/plugin install git@claude-engineer-toolkit
```

## Commands

- `/git/cm [ticket]`: Stage all changes and create a commit following Conventional Commits. Optionally add a JIRA ticket reference as footer.
- `/git/pr [to-branch] [from-branch]`: Create a draft pull request with a conventional title and summary.

## Skills

- **git-conventions**: Shared Conventional Commits format, types, writing rules, and special `.claude/` directory handling. Auto-loaded when discussing commit messages or PR titles.

## How It Works

Both commands inline the shared conventions from `skills/git-conventions/references/conventions.md` via `!cat`, ensuring a single source of truth for commit message formatting across all git workflows.

---
description: Stage all files and create a commit.
allowed-tools: Bash(git *)
arguments:
  - name: ticket
    description: JIRA ticket number (e.g., PROJ-1234). If provided, added as "Refs: <ticket>" in the commit footer.
    required: false
---

Stage all files and create a commit:

1. Review all modified files and their changes.
   - **NEVER** commit secrets, credentials, or environment files (dotenv, API keys, database credentials, etc.)

2. Generate a commit message using **Conventional Commits** format:

   ```
   <type>(<scope>): <description>

   [optional body]

   [optional footer]
   ```

   **Types:**
   - `feat`: New feature
   - `fix`: Bug fix
   - `refactor`: Code restructuring without behavior change
   - `docs`: Documentation changes
   - `test`: Adding or updating tests
   - `chore`: Build, CI, tooling changes
   - `perf`: Performance improvements
   - `ci`: CI workflow changes

   **Special rules for `.claude/` directory:**
   - Changes to existing Markdown files in `.claude/` should use `perf:` (instead of `docs:`)
   - New files in `.claude/` directory should use `feat:` (instead of `docs:` or `perf:`)

   **Writing rules:**
   - Write in imperative mood: "add feature" not "added feature"
   - Keep the subject line under 72 characters
   - Separate subject from body with a blank line
   - Use the body to explain **why**, not **what** (the diff shows what)
   - Make atomic commits — one logical change per commit
   - If there are new files and file changes at the same time, split them into separate commits

   **JIRA ticket:**
   - If `$ARGUMENTS.ticket` is provided, add `Refs: $ARGUMENTS.ticket` as the commit footer
   - Example: `Refs: PROJ-1234`

   **NEVER** automatically add AI attribution signatures like:
   - "Generated with [Claude Code]"
   - "Co-Authored-By: Claude noreply@anthropic.com"
   - Any AI tool attribution or signature

3. Stage relevant files and commit using: `git commit -m "commit_message"`.
   - Split files into separate commits to reflect atomic changes.

4. Confirm the commit was successful and display the resulting commit hash and message.

**IMPORTANT: DO NOT push the changes to remote repository.**

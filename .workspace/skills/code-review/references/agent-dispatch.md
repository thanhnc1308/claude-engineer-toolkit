# Agent Dispatch Instructions

How to dispatch parallel review agents using the Agent tool.

## Prompt Template

Each agent receives this context in its prompt:

```
Review the following code changes from branch `{branch}` ({N} commits ahead of {base}).

## Changed Files
{changed_files_list}

## Full Diff
{full_diff}

## Commit Log
{commit_log}

Return findings as a structured list. For each finding:
- Severity: critical / important / suggestion
- Category tag
- Description
- File:line reference
- Fix suggestion (if applicable)
```

## Agent Selection Logic

```
ALWAYS dispatch:
  - code-reviewer (subagent_type: feature-dev:code-reviewer)
  - security-scanner (subagent_type: feature-dev:security-scanner)
  - performance-reviewer (subagent_type: feature-dev:performance-reviewer)

IF diff contains error handling patterns (catch|try|except|\.catch\(|on_error|fallback|rescue):
  - silent-failure-hunter (subagent_type: feature-dev:silent-failure-hunter)

IF changed files contain NestJS code (.module.ts, .controller.ts, .service.ts, .guard.ts, .interceptor.ts, .pipe.ts, .filter.ts, .decorator.ts, or imports from @nestjs/):
  - nestjs-reviewer (subagent_type: nestjs:nestjs-reviewer)

IF changed files contain Next.js code (app/ directory, next.config.*, middleware.ts, or imports from next/):
  - nextjs-reviewer (subagent_type: nextjs:nextjs-reviewer)

IF changed files contain PHP code (.php extension, composer.json, or PHP project directories):
  - php-reviewer (subagent_type: php:php-reviewer)

AFTER all above complete AND no critical issues:
  - code-simplifier (subagent_type: feature-dev:code-simplifier)
```

## Parallel Dispatch

Launch all applicable agents in a **single message** with multiple Agent tool calls. Do NOT dispatch sequentially.

Example: if 4 agents apply, send one message with 4 Agent tool invocations.

## Handling Large Diffs

If the diff exceeds ~50KB:

1. Split review by file groups — dispatch multiple rounds
2. Each agent receives a subset of files relevant to its domain
3. Security scanner always gets the full diff (secrets can be anywhere)

## Handling Agent Failures

If an agent fails or returns empty:

- Retry once with the same prompt
- If still fails, note the gap in the summary: "⚠️ {agent} review could not complete"
- Do not block the rest of the review

## Post-Review: Code Simplifier

Only dispatch code-simplifier when:

1. All review agents have completed
2. No critical severity findings exist
3. There are changed files that could benefit from simplification

Pass the code-simplifier only the changed files (not the full diff) and instruct it to focus on clarity improvements, not functional changes.

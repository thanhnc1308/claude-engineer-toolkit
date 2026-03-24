---
description: Guided feature development with codebase understanding and architecture focus.
argument-hint: Optional feature description
user-invocable: true
---

# Feature Development

You are helping a developer implement a new feature. Follow a systematic approach: understand the codebase deeply, identify and ask about all underspecified details, design elegant architectures, then implement.

## Core Principles

- **Ask clarifying questions**: Identify all ambiguities, edge cases, and underspecified behaviors. Ask specific, concrete questions rather than making assumptions. Wait for user answers before proceeding with implementation. Ask questions early (after understanding the codebase, before designing architecture).
- **Understand before acting**: Read and comprehend existing code patterns first
- **Read files identified by agents**: When launching agents, ask them to return lists of the most important files to read. After agents complete, read those files to build detailed context before proceeding.
- **Simple and elegant**: Prioritize readable, maintainable, architecturally sound code
- **Use TodoWrite**: Track all progress throughout

---

## Phase 1: Discovery

**Goal**: Understand what needs to be built and define clear success criteria

**Actions**:

1. **Capture request** — If `$ARGUMENTS` is empty, ask the user to describe the feature before continuing. Otherwise, use `$ARGUMENTS` as the initial request.
2. **Challenge assumptions** — Before diving in, ask whether this is the right problem to solve. Is there a simpler framing? Could doing nothing be acceptable?
3. **Gather** — Always confirm understanding with the user, even if the request seems clear. Prefer multiple choice questions when possible:
   - What problem are they solving and for whom?
   - Any constraints, requirements, or preferences?
   - Have they tried or considered any existing solutions?
4. **Synthesize** — From the request and answers, produce:
   - **Goal**: Single sentence describing the desired end state (e.g. "Users can reset their password via email link")
   - **Scope**: What is in-scope and what is explicitly out-of-scope
   - **Acceptance criteria**: Concrete, testable conditions that define "done" (e.g. "User can X", "API returns Y when Z", "Error message shown if…")
   - **Deliverables**: Specific artifacts to produce (e.g. "new API endpoint at POST /reset", "migration file", "unit tests for service layer")
5. **Document** — Save the synthesized requirements to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-requirements.md` with:
   - Goal
   - Scope (in-scope / out-of-scope)
   - Acceptance criteria checklist
   - Deliverables
   - Any constraints or preferences gathered from the user
6. **Plan phases** — Create a todo list with one item per phase (Discovery through Summary). Add sub-tasks only for the current phase; later phases get sub-tasks when you reach them.

**Gate:** Present the path to the requirements document and ask for confirmation:

> I've saved the requirements document to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-requirements.md`. Please review it.
>
> Does this look right? Anything to add, change, or exclude?

**Do not proceed to Phase 2 until the user confirms.**

---

## Phase 2: Codebase Exploration

**Goal**: Understand relevant existing code and patterns at both high and low levels

**Actions**:

1. **Generate codebase snapshot** — Run `repomix` to create an AI-friendly codebase summary:

   ```bash
   npx repomix --output .claude-workspace/<feature-name>-codebase.xml
   ```

   If the codebase is large, scope repomix to the relevant directories:

   ```bash
   npx repomix --include "src/relevant-dir/**" --output .claude-workspace/<feature-name>-codebase.xml
   ```

2. **Scale agent count to project size:**
   - **Small projects** (< 50 files): 1 code-explorer
   - **Medium projects** (50-500 files): 2 code-explorers
   - **Large projects** (500+ files): 2-3 code-explorers

   **Launch code-explorer agents in parallel.** Pass the repomix output path so each agent reads it for orientation before deeper investigation. Each agent should:
   - Read the repomix snapshot at `.claude-workspace/<feature-name>-codebase.xml` first for broad codebase context
   - Then trace through the code comprehensively, focusing on abstractions, architecture, and flow of control
   - Target a different aspect of the codebase (e.g. similar features, high-level understanding, architectural understanding, user experience, etc.)
   - Include a list of 5-10 key files to read

   **Example agent prompts**:
   - "Read the repomix codebase snapshot at `.claude-workspace/<feature>-codebase.xml` for context, then find features similar to [feature] and trace through their implementation comprehensively"
   - "Read the repomix codebase snapshot at `.claude-workspace/<feature>-codebase.xml` for context, then map the architecture and abstractions for [feature area], tracing through the code comprehensively"
   - "Read the repomix codebase snapshot at `.claude-workspace/<feature>-codebase.xml` for context, then analyze the current implementation of [existing feature/area], tracing through the code comprehensively"
   - "Read the repomix codebase snapshot at `.claude-workspace/<feature>-codebase.xml` for context, then identify UI patterns, testing approaches, or extension points relevant to [feature]"

3. **Launch `researcher` agents in parallel** (alongside the code-explorer agents) to search for relevant documentation and best practices online. Only dispatch these when the feature involves unfamiliar technologies, external integrations, or patterns that benefit from external research. Scale to project complexity:
   - **Narrow scope** (single library/API): 1 researcher
   - **Moderate scope** (multiple integrations): 1-2 researchers
   - **Broad scope** (unfamiliar stack or complex integrations): 2-3 researchers

   Each agent should target a different research angle:
   - Search for latest documentation, API references, and official guides for relevant libraries or frameworks
   - Find best practices, common patterns, and known pitfalls for the specific problem domain
   - Research similar implementations, case studies, or community solutions

   **Example agent prompts**:
   - "Research the latest documentation and best practices for [technology/library] relevant to implementing [feature]. Use web search and context7 to find official docs, migration guides, and recommended patterns. Summarize key findings and include links to authoritative sources."
   - "Search for common patterns and known pitfalls when implementing [feature type] (e.g. real-time sync, file uploads, OAuth flows). Find community solutions, blog posts, and case studies. Highlight what worked, what didn't, and any security considerations."
   - "Research [specific integration/API/protocol] that [feature] depends on. Find the latest API specs, rate limits, authentication requirements, and example implementations. Document any breaking changes or deprecations."

   Each agent should return:
   - Key findings and recommendations
   - Links to authoritative documentation
   - Relevant code patterns or examples
   - Warnings about pitfalls, deprecations, or security concerns

4. Once all agents return, read all files identified by code-explorer agents and review research findings to build deep understanding
5. Present comprehensive summary of codebase findings, patterns discovered, and external research insights

**Gate:** Ask the user to confirm the exploration findings before documenting:

> Here are the key findings from codebase exploration and research. Does this capture everything correctly? Anything to adjust before I append these to the requirements document?

**Do not proceed until the user confirms.**

6. **Document** — After user confirms, append findings to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-requirements.md` with:
   - Key patterns and conventions discovered
   - Relevant existing code and architecture
   - Integration points and dependencies
   - Files of interest
   - External research findings: best practices, documentation references, and known pitfalls (if researcher agents were dispatched)

---

## Phase 3: Clarifying Questions

**Goal**: Fill in gaps and resolve all ambiguities before designing

**CRITICAL**: This is one of the most important phases. DO NOT SKIP.

**Actions**:

1. Review the codebase findings and original feature request
2. Identify underspecified aspects: edge cases, error handling, integration points, scope boundaries, design preferences, backward compatibility, performance needs
3. **Present all questions to the user in a clear, organized list**
4. **Wait for answers before proceeding to architecture design**

If the user says "whatever you think is best", provide your recommendation and get explicit confirmation.

**Gate:** After all questions are answered, present the updated requirements to the user:

- Resolved decisions and answers
- Updated acceptance criteria (if any changed)
- Edge cases and error handling decisions
- Any new constraints or scope adjustments

**Do not proceed to Phase 4 until the user confirms.**

5. **Document** — After user confirms, update the requirements document (`.claude-workspace/<YYYY-MM-DD>/<feature-name>-requirements.md`) with:
   - Resolved decisions and answers
   - Updated acceptance criteria (if any changed)
   - **Resolved Questions Log**: Each question raised, how it was resolved, and who decided — this log carries forward into the technical design document

---

## Phase 4: Architecture Design

**Goal**: Design multiple implementation approaches with different trade-offs

**Actions**:

1. Launch 2-3 `architect` agents in parallel with different focuses: minimal changes (smallest change, maximum reuse), clean architecture (maintainability, elegant abstractions), or pragmatic balance (speed + quality). Ensure at least one approach is unconventional or contrarian — a non-obvious solution that challenges conventional thinking.
2. Review all approaches and form your opinion on which fits best for this specific task (consider: small fix vs large feature, urgency, complexity, team context)
3. Document all approaches in `.claude-workspace/<YYYY-MM-DD>/<feature-name>-tech-design.md` with:
   - Summary of each approach
   - **Trade-off matrix** comparing approaches across these dimensions:

     | Dimension      | Approach 1 | Approach 2 | Approach 3 |
     | -------------- | ---------- | ---------- | ---------- |
     | Complexity     | ...        | ...        | ...        |
     | Maintenance    | ...        | ...        | ...        |
     | Performance    | ...        | ...        | ...        |
     | Cost           | ...        | ...        | ...        |
     | Technical Debt | ...        | ...        | ...        |

   - **Hidden costs and second-order effects** for each approach
   - **Failure modes and rollback strategies** for each approach
   - **Honest assessment**: Unfiltered opinion — flag overengineering, unnecessary complexity, or if the problem doesn't need solving
   - Your recommendation with reasoning
   - **What would change the recommendation**: Identify conditions (different constraints, scale, timeline) that would flip the choice
   - Concrete implementation differences (files to change, new abstractions, migration steps)
   - **Resolved Questions Log** (carried forward from Phase 3 requirements document)

4. Present the technical design document path to the user and ask which approach they prefer:

> I've saved the technical design document to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-tech-design.md`. Please review the approaches and trade-offs.
>
> Which approach do you prefer? (Or describe adjustments.)

**Do not proceed to Phase 5 until the user confirms their choice.**

---

## Phase 5: Plan

**Goal**: Create a detailed, actionable implementation plan based on the approved technical design

**Actions**:

1. Dispatch a `planner` agent with the following context:
   - The requirements document at `.claude-workspace/<YYYY-MM-DD>/<feature-name>-requirements.md`
   - The technical design document at `.claude-workspace/<YYYY-MM-DD>/<feature-name>-tech-design.md`
   - The user's chosen approach from Phase 4
   - Codebase patterns and conventions discovered in Phase 2

   The agent must produce a plan that includes:
   - **Phases** broken into concrete, ordered tasks with clear descriptions
   - **Files to create or modify** for each task (informed by codebase exploration)
   - **Dependencies** between tasks (what must complete before what)
   - **Acceptance criteria** per task (testable conditions)
   - **Risks and mitigations** (what could go wrong and how to handle it)
   - **Testing strategy** per task (unit, integration, e2e)

2. Save the plan to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-plan.md`

**Gate:** Present the plan document path and ask for confirmation:

> I've saved the implementation plan to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-plan.md`. Please review it.
>
> Does this plan look correct? (Approve to continue, or describe adjustments.)

Do not proceed to implementation without explicit approval.

---

## Phase 6: Implementation

**Goal**: Build the feature following the approved plan

**Actions**:

1. Read the plan from `.claude-workspace/<YYYY-MM-DD>/<feature-name>-plan.md`
2. Present execution options:

   **1. Subagent-Driven** (faster, continuous and automated flow, AI reviews) — I dispatch fresh subagent per task from the plan, review between tasks, fast iteration

   **2. Separate Session** (fresh context, large plan, human review) — Open new session with executing-plans, batch execution with checkpoints

   > Which approach?

**If Subagent-Driven chosen:**

- **REQUIRED SUB-SKILL:** Use `subagent-driven-development`
- Stay in this session
- Execute tasks in the order defined by the plan, respecting dependencies
- Fresh subagent per task + code review
- Use TDD (Red-Green-Refactor) for each task, target 80%+ coverage on new code
- Verify each task's acceptance criteria before moving to the next

**If Separate Session chosen:**

- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses `executing-plans`
- Point them to the plan at `.claude-workspace/<YYYY-MM-DD>/<feature-name>-plan.md`

All tests must pass before leaving this phase.

**Gate:** Show test results and coverage. Ask:

> All tests passing. Ready to move to code review?

---

## Phase 7: Quality Review

**Goal**: Ensure code is correct, secure, performant, and follows framework-specific best practices

**Actions**:

1. Dispatch 4 review agents in parallel:
   - **`code-reviewer`** — Correctness, edge cases, error handling, simplicity/DRY/elegance, naming, duplication, test quality and coverage, project conventions/abstractions
   - **`security-scanner`** — OWASP Top 10, injection, auth/authz flaws, secrets exposure, unsafe dependencies
   - **`performance-reviewer`** — N+1 queries, missing indexes, unbounded queries, missing caching, synchronous blocking, excessive re-renders, large bundles
   - **Framework/language-specific reviewer** — Detect the project's stack and dispatch the matching reviewer if one is installed (e.g. `nextjs:nextjs-reviewer`, `nestjs:nestjs-reviewer`, `php:php-reviewer`). Skip if no matching reviewer is available.
2. Merge all reports into a single findings list grouped by severity (blocking / non-blocking)
3. **Present findings to user and ask what they want to do** (fix blocking now, fix later, or proceed as-is)
4. If blocking issues exist: fix them, re-run affected tests, re-review until clean
5. Address non-blocking issues based on user decision

---

## Phase 8: Verification

**Goal**: Ensure all work is genuinely complete with fresh evidence before claiming success

**Actions**:

1. Dispatch a subagent with the `verification-before-completion` skill. Provide it with:
   - The requirements document at `.claude-workspace/<YYYY-MM-DD>/<feature-name>-requirements.md`
   - The acceptance criteria from Phase 1
   - The list of deliverables and files modified
   - Instructions to run all relevant verification commands (tests, build, lint) and check each acceptance criterion line-by-line

2. The agent must:
   - Run the full test suite and report exact pass/fail counts
   - Run the build command and confirm exit code 0
   - Run the linter and confirm 0 errors
   - Walk through each acceptance criterion and verify it with evidence
   - Report any gaps between requirements and actual state

3. Review the agent's verification report
4. If any gaps or failures are found: fix them, then re-run verification
5. Only proceed to Summary when all checks pass with fresh evidence

**Gate:** All verification commands pass, all acceptance criteria confirmed with evidence.

---

## Phase 9: Summary

**Goal**: Document what was accomplished

**Actions**:

1. Mark all todos complete
2. Summarize:
   - What was built
   - Key decisions made
   - Files modified
   - Suggested next steps

---

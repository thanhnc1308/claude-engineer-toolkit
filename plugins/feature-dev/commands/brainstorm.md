---
description: Discover requirements, explore codebase, and clarify ambiguities
user-invocable: true
argument-hint: [feature description]
---

# Brainstorm — Discover, Explore, Clarify

You are helping a developer refine a feature idea into a concrete, confirmed requirements document. This command covers three phases: Discovery, Codebase Exploration, and Clarifying Questions. **Do NOT design architecture or implement anything.**

## Core Principles

- **Ask clarifying questions**: Identify all ambiguities, edge cases, and underspecified behaviors. Ask specific, concrete questions rather than making assumptions. Wait for user answers before proceeding.
- **Understand before acting**: Read and comprehend existing code patterns first.
- **Read files identified by agents**: When launching agents, ask them to return lists of the most important files to read. After agents complete, read those files to build detailed context.
- **Use TodoWrite**: Track all progress throughout.

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

**Gate:** Present the synthesized requirements and ask for confirmation:

> Does this capture the feature correctly? Anything to add, change, or exclude?

**Do not proceed to Phase 2 until the user confirms.**

---

## Phase 2: Codebase Exploration

**Goal**: Understand relevant existing code and patterns at both high and low levels

**Actions**:

1. **Generate codebase snapshot** — Run `repomix` to create an AI-friendly codebase summary:

   ```bash
   npx repomix --output .claude-workspace/repomix.xml
   ```

   If the codebase is large, scope repomix to the relevant directories:

   ```bash
   npx repomix --include "src/relevant-dir/**" --output .claude-workspace/repomix.xml
   ```

2. **Scale agent count to project size:**
   - **Small projects** (< 50 files): 1 code-explorer
   - **Medium projects** (50-500 files): 2 code-explorers
   - **Large projects** (500+ files): 2-3 code-explorers

   **Launch `code-explorer` agents in parallel.** Pass the repomix output path so each agent reads it for orientation before deeper investigation. Each agent should:
   - Read the repomix snapshot first for broad codebase context
   - Then trace through the code comprehensively, focusing on abstractions, architecture, and flow of control
   - Target a different aspect of the codebase (e.g. similar features, high-level understanding, architectural understanding, user experience, etc.)
   - Include a list of 5-10 key files to read

3. **Launch `researcher` agents in parallel** (alongside the `code-explorer` agents) to search for relevant documentation and best practices online. Only dispatch these when the feature involves unfamiliar technologies, external integrations, or patterns that benefit from external research.

4. Once all agents return, read all files identified by `code-explorer` agents and review research findings to build deep understanding.
5. Present comprehensive summary of codebase findings, patterns discovered, and external research insights.

**Gate:** Ask the user to confirm the exploration findings:

> Here are the key findings from codebase exploration and research. Does this capture everything correctly? Anything to adjust?

**Do not proceed until the user confirms.**

---

## Phase 3: Clarifying Questions

**Goal**: Fill in gaps and resolve all ambiguities before designing

**CRITICAL**: This is one of the most important phases. DO NOT SKIP.

**Actions**:

1. Review the codebase findings and original feature request
2. Identify underspecified aspects: edge cases, error handling, integration points, scope boundaries, design preferences, backward compatibility, performance needs
3. **Present all questions to the user in a clear, organized list. Prefer multiple choice questions when possible**
4. **Wait for answers before proceeding**

If the user says "whatever you think is best", provide your recommendation and get explicit confirmation.

**Gate:** After all questions are answered, present the updated requirements:

- Resolved decisions and answers
- Updated acceptance criteria (if any changed)
- Edge cases and error handling decisions
- Any new constraints or scope adjustments

**Do not proceed until the user confirms.**

---

## Output: Requirements Document

After all three phases are confirmed, save the final requirements document to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-requirements.md` with:

- Goal
- Scope (in-scope / out-of-scope)
- Acceptance criteria checklist
- Deliverables
- Constraints and preferences
- Key patterns and conventions discovered
- Relevant existing code and architecture
- Integration points and dependencies
- Files of interest
- External research findings (if any)
- Resolved Questions Log: Each question raised, how it was resolved, and who decided

Present the path to the user:

> I've saved the requirements document to `.claude-workspace/<YYYY-MM-DD>/<feature-name>-requirements.md`.
>
> Next step: Run `/tech-design` to design implementation approaches.

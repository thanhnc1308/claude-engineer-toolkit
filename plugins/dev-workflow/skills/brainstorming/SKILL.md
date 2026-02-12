---
name: brainstorming
description: Interactive brainstorming session for exploring ideas, approaches, and trade-offs before implementation. Use when starting a new feature, solving a complex problem, or evaluating architectural decisions.
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
argument-hint: [topic or problem to brainstorm]
---

# Brainstorming Session

You are facilitating a structured brainstorming session. Your goal is to help the user explore ideas thoroughly before committing to an implementation.

## Process

### 1. Understand the Problem
- Clarify the problem statement or feature request
- Identify constraints, requirements, and goals
- Understand the current codebase context if relevant

### 2. Generate Ideas
- Propose at least 3 distinct approaches
- For each approach, explain:
  - **How it works**: Core mechanism and architecture
  - **Pros**: Benefits, simplicity, performance, maintainability
  - **Cons**: Drawbacks, complexity, risks, limitations
  - **Effort**: Rough scope (small/medium/large)

### 3. Evaluate Trade-offs
- Compare approaches across dimensions:
  - Simplicity vs flexibility
  - Performance vs maintainability
  - Short-term speed vs long-term scalability
- Consider existing patterns in the codebase

### 4. Recommend
- Provide a clear recommendation with reasoning
- Identify what would change your recommendation (different constraints, scale, etc.)

## Guidelines
- Be creative but practical — ideas should be implementable
- Reference existing code patterns when relevant
- Consider edge cases and failure modes
- Keep the discussion focused on the topic: $ARGUMENTS

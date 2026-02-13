---
name: brainstorming
description: Interactive brainstorming session for exploring ideas, approaches, and trade-offs before implementation. Use when starting a new feature, solving a complex problem, or evaluating architectural decisions.
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
argument-hint: [topic or problem to brainstorm]
---

# Brainstorming Session

You are facilitating a structured brainstorming session. Your goal is to help the user explore ideas thoroughly before committing to an implementation.

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Start by understanding the current project context, then ask questions one at a time to clarify the requirements and refine the idea. Once you understand what you're building, present the design in small sections (200-300 words), checking after each section whether it looks right so far.

## Process

### 1. Understand the Problem

- Clarify the problem statement or feature request
- Identify constraints, requirements, and goals
- Ask questions one at a time to refine the idea - if a topic needs more exploration, break it into multiple questions
- Prefer multiple choice questions when possible, but open-ended is fine too
- Understand the current codebase context if relevant

### 2. Explore approaches

- Propose 2-3 different approaches with trade-offs
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

### 5. Present the design

- Once you believe you understand what you're building, present the design
- Break it into sections of 200-300 words
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

## Key Principles

- **Creative but practical** - Ideas should be implementable
- **Leverage existing patterns** - Reference existing code patterns when relevant
- **Consider edge cases** - Think through failure modes and boundary conditions
- **Stay focused** - Keep the discussion on topic: $ARGUMENTS
- **Multiple choice preferred** - Easier to answer than open-ended when possible
- **YAGNI ruthlessly** - Remove unnecessary features from all designs
- **Explore alternatives** - Always propose 2-3 approaches before settling
- **Be flexible** - Go back and clarify when something doesn't make sense

## After the Design

**Documentation:**

- Write the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Use elements-of-style:writing-clearly-and-concisely skill if available
- Commit the design document to git

**Implementation (if continuing):**

- Ask: "Ready to set up for implementation?"
- Use dev-workflow:using-git-worktrees skill to create isolated workspace
- Use dev-workflow:planning skill to create detailed implementation plan

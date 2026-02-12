---
name: planning
description: Creates a structured implementation plan from requirements. Breaks work into phases, identifies risks, and defines acceptance criteria. Use before implementing any non-trivial feature or change.
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
argument-hint: [feature or task to plan]
---

# Implementation Planning

You are creating a detailed, actionable implementation plan. The plan should be specific enough that someone can follow it step-by-step.

## Process

### 1. Requirements Analysis
- Parse the feature/task description: $ARGUMENTS
- Identify explicit and implicit requirements
- List assumptions and flag anything that needs clarification
- Explore the relevant parts of the codebase

### 2. Scope Definition
- Define what is IN scope and OUT of scope
- Identify affected files and components
- List dependencies and prerequisites

### 3. Implementation Steps
Break the work into ordered, concrete steps:
- Each step should be independently verifiable
- Include file paths and function names where known
- Note which existing utilities/patterns to reuse
- Flag steps that carry risk or need special attention

### 4. Risk Assessment
- Identify potential blockers or complications
- Note areas where the plan might need to change
- Suggest fallback approaches for high-risk items

### 5. Acceptance Criteria
- Define what "done" looks like
- List specific test scenarios
- Include edge cases to verify

### 6. Verification Plan
- How to test the changes end-to-end
- Which existing tests might break
- What new tests are needed

## Output Format
Present the plan as a numbered checklist with clear sections. Keep it scannable — use bullet points, not paragraphs.

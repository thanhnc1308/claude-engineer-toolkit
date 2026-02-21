---
description: Review code for quality, security, performance, and best practices using the code-reviewer agent
user-invocable: true
argument-hint: [file path, directory, or description of changes]
---

Use the code-reviewer agent to perform a comprehensive code review of: $ARGUMENTS

## Review Process

1. **Identify the target**: Determine the files or changes to review based on the arguments provided. If no specific files are given, review the latest uncommitted changes using `git diff` and `git diff --staged`.

2. **Read and understand the code**: Read each file or change thoroughly before providing feedback.

3. **Apply the full review checklist**:

   ### Security (CRITICAL — review first)
   - Hardcoded credentials (API keys, passwords, tokens)
   - SQL injection risks (string concatenation in queries)
   - XSS vulnerabilities (unescaped user input)
   - Missing input validation
   - Path traversal risks (user-controlled file paths)
   - CSRF vulnerabilities
   - Authentication bypasses

   ### Code Quality
   - Large functions (>50 lines)
   - Large files (>800 lines)
   - Deep nesting (>4 levels)
   - Missing error handling (try/catch)
   - console.log statements left in code
   - Mutation of shared state
   - Missing tests for new code

   ### Performance
   - Inefficient algorithms (O(n²) when O(n log n) possible)
   - Unnecessary re-renders (React)
   - Missing memoization
   - N+1 queries
   - Memory leaks
   - Unnecessary computation

   ### Best Practices
   - TODO/FIXME without tickets
   - Missing JSDoc for public APIs
   - Accessibility issues (missing ARIA labels, poor contrast)
   - Poor variable naming (x, tmp, data)
   - Magic numbers without explanation
   - Inconsistent formatting

4. **Output the review** in this format:

   ### Summary

   Brief overview of what was reviewed and overall assessment.

   ### Critical Issues (must fix)
   - `file:line` — description and how to fix

   ### Important Issues (should fix)
   - `file:line` — description and how to fix

   ### Suggestions (nice to have)
   - `file:line` — description and recommendation

   ### What's Done Well

   Acknowledge good patterns and quality code.

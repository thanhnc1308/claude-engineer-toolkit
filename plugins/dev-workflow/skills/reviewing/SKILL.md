---
name: reviewing
description: Comprehensive code review covering correctness, security, performance, maintainability, and test coverage. Use after implementing a feature, before committing, or when reviewing existing code.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [file path or description of changes to review]
---

# Code Review

You are performing a thorough code review. Be constructive, specific, and actionable.

## Review Checklist

### 1. Correctness

- Does the code do what it's supposed to do?
- Are there logic errors or off-by-one bugs?
- Are edge cases handled (null, empty, boundary values)?
- Are error paths handled correctly?

### 2. Security (OWASP Top 10)

- **Injection**: SQL injection, command injection, XSS
- **Authentication/Authorization**: Are access controls enforced?
- **Data exposure**: Are secrets, PII, or sensitive data protected?
- **Input validation**: Is all external input validated and sanitized?
- **Dependencies**: Are there known vulnerabilities?

### 3. Performance

- Are there N+1 queries or unnecessary database calls?
- Are there memory leaks or unbounded collections?
- Is there unnecessary computation in hot paths?
- Are appropriate caching strategies used?

### 4. Maintainability

- Is the code readable and self-documenting?
- Does it follow existing project conventions?
- Is there unnecessary complexity or over-engineering?
- Are responsibilities properly separated?

### 5. Test Coverage

- Are the critical paths tested?
- Are edge cases covered?
- Are error scenarios tested?
- Are tests meaningful (not just for coverage)?

## Output Format

For each finding:

- **Severity**: Critical / Warning / Suggestion
- **Location**: File and line reference
- **Issue**: What's wrong
- **Fix**: How to fix it

Start with critical issues, then warnings, then suggestions. If the code looks good, say so — don't invent problems.

Review target: $ARGUMENTS

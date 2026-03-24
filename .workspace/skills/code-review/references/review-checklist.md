# Review Checklist

Detailed checklist each review agent covers. Use to verify completeness.

## Code Quality (code-reviewer)

- Plan alignment — deviations from original plan justified?
- Patterns and conventions — follows project CLAUDE.md standards?
- Error handling — proper try/catch, type safety, defensive programming
- Code organization — naming, file structure, maintainability
- Test coverage — new code has tests, edge cases covered
- Red flags: functions >50 lines, files >800 lines, nesting >4 levels
- Red flags: console.log in production, mutation of shared state
- Architecture — SOLID, separation of concerns, loose coupling
- Documentation — comments where logic isn't self-evident

## Security (security-scanner)

- Hardcoded credentials (API keys, passwords, tokens)
- SQL injection (string concatenation in queries)
- XSS (unescaped user input in HTML/templates)
- Missing input validation at system boundaries
- SSRF (user-controlled URLs in server requests)
- Path traversal (user-controlled file paths)
- Auth bypass paths
- CSRF vulnerabilities
- Insecure crypto (MD5/SHA1 for passwords, weak random)
- Dependencies with known CVEs

## Performance (performance-reviewer)

- N+1 queries — loop with individual DB calls
- Missing indexes on filtered/sorted columns
- Unbounded queries — no LIMIT on growing tables
- Missing caching for hot, stable data
- Sequential await on independent async calls
- Synchronous blocking in request handlers
- Memory leaks — event listeners not cleaned up
- O(n²) or worse when O(n log n) possible

## Error Handling (silent-failure-hunter)

Only reviewed when diff contains error handling patterns.

- Empty catch blocks
- Catch blocks that log but continue without user feedback
- Returning null/default on error without logging
- Broad exception catching hiding unrelated errors
- Fallback logic masking underlying problems
- Retry logic exhausting attempts silently
- Optional chaining hiding meaningful failures

## Code Simplification (code-simplifier)

Only runs when no critical issues found.

- Unnecessary complexity and nesting
- Redundant code and abstractions
- Nested ternaries — prefer switch/if-else
- Dead code in changed files
- Inconsistent naming with project conventions
- Clarity over brevity — explicit > compact

# Security Report Templates

## Security Review Report Template

```markdown
# Security Review Report

**File/Component:** [path/to/file.ts]
**Reviewed:** YYYY-MM-DD
**Reviewer:** security-scanner agent

## Summary

- **Critical Issues:** X
- **High Issues:** Y
- **Medium Issues:** Z
- **Low Issues:** W
- **Risk Level:** HIGH / MEDIUM / LOW

## Critical Issues (Fix Immediately)

### 1. [Issue Title]

**Severity:** CRITICAL
**Category:** SQL Injection / XSS / Authentication / etc.
**Location:** `file.ts:123`

**Issue:**
[Description of the vulnerability]

**Impact:**
[What could happen if exploited]

**Proof of Concept:**
[Example of how this could be exploited]

**Remediation:**
[Secure implementation code example]

**References:**

- OWASP: [link]
- CWE: [number]

## High Issues (Fix Before Production)

[Same format as Critical]

## Medium Issues (Fix When Possible)

[Same format as Critical]

## Low Issues (Consider Fixing)

[Same format as Critical]

## Security Checklist

- [ ] No hardcoded secrets
- [ ] All inputs validated
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Authentication required
- [ ] Authorization verified
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Security headers set
- [ ] Dependencies up to date
- [ ] Logging sanitized
- [ ] Error messages safe

## Recommendations

1. [General security improvements]
2. [Security tooling to add]
3. [Process improvements]
```

## PR Security Review Template

```markdown
## Security Review

**Reviewer:** security-scanner agent
**Risk Level:** HIGH / MEDIUM / LOW

### Blocking Issues

- [ ] **CRITICAL**: [Description] @ `file:line`
- [ ] **HIGH**: [Description] @ `file:line`

### Non-Blocking Issues

- [ ] **MEDIUM**: [Description] @ `file:line`
- [ ] **LOW**: [Description] @ `file:line`

### Security Checklist

- [x] No secrets committed
- [x] Input validation present
- [ ] Rate limiting added
- [ ] Tests include security scenarios

**Recommendation:** BLOCK / APPROVE WITH CHANGES / APPROVE

---

> Security review performed by Claude Code security-scanner agent
```

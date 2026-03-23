---
name: security-audit
description: Use when adding authentication, handling user input, working with secrets, creating API endpoints, implementing payment/sensitive features, or before any production deployment. Provides the full security review workflow, OWASP Top 10 checklist, vulnerability patterns, report templates, and pre-deployment checklist.
---

# Security Audit

Comprehensive security review workflow covering vulnerability detection, OWASP Top 10 analysis, and remediation for web applications and APIs.

## When to Activate

### Always Review When

- Implementing authentication or authorization
- Handling user input or file uploads
- Creating new API endpoints
- Working with secrets or credentials
- Implementing payment features
- Storing or transmitting sensitive data
- Integrating third-party APIs
- Database queries modified
- Dependencies updated

### Immediately Review When

- Production incident occurred
- Dependency has known CVE
- User reports security concern
- Before major releases
- After security tool alerts

## Security Review Workflow

### Phase 1: Automated Scanning

Run automated tools to catch low-hanging vulnerabilities. See `references/automated-scanning.md` for tool setup and commands.

### Phase 2: High-Risk Area Manual Review

Target these areas in priority order:

1. Authentication and authorization code
2. All API endpoints that accept user input
3. Database query construction
4. File upload handlers
5. Payment and financial transaction code
6. Webhook handlers
7. Any code calling external APIs with user-supplied data

### Phase 3: OWASP Top 10 Systematic Check

Walk through each category against the codebase using these references:

- **Secrets, input validation, SQL/command injection** — `references/vulnerability-patterns.md`
- **Auth/authz, XSS, CSRF, rate limiting** — `references/auth-and-web-security.md`
- **Data exposure, blockchain, dependencies, race conditions, financial** — `references/data-and-financial-security.md`

### Phase 4: Report and Remediation

Generate a security review report using templates in `references/report-templates.md`.

## Pre-Deployment Checklist

Before ANY production deployment, run through the checklist in `references/automated-scanning.md`.

## Emergency Response Protocol

If a CRITICAL vulnerability is found in production or an actively exploited issue:

1. **Document** — Create a detailed report before touching anything
2. **Notify** — Alert the project owner immediately
3. **Recommend fix** — Provide secure code example
4. **Test fix** — Verify remediation works in isolation first
5. **Verify impact** — Determine if vulnerability was exploited and what data/funds were affected
6. **Rotate secrets** — If credentials were exposed, rotate all immediately
7. **Update docs** — Add to security knowledge base to prevent recurrence

## Output Format

### Summary

- **Risk Level:** CRITICAL / HIGH / MEDIUM / LOW
- **Critical Issues:** X | **High:** Y | **Medium:** Z | **Low:** W

### Findings

#### Critical (Fix Immediately)

[Actively exploitable vulnerabilities, exposed secrets, missing auth on sensitive endpoints]

#### High (Fix Before Production)

[SQL injection vectors, missing input validation, insecure token storage, missing RLS]

#### Medium (Fix When Possible)

[Missing rate limiting, weak CSP headers, overly verbose error messages]

#### Low (Consider Fixing)

[Dependency updates, logging improvements, minor header hardening]

**For each finding:**

- File:line reference
- OWASP category (e.g., A03:2021 Injection)
- What's vulnerable and how it could be exploited
- Remediation with code example

### Pre-Deployment Checklist Result

[Pass/Fail status of each item from `references/automated-scanning.md`]

### Verdict

**Safe to deploy?** [Yes / No / With fixes]

**Reasoning:** [1-2 sentence technical assessment]

## References

- Vulnerability patterns: `references/vulnerability-patterns.md`
- Auth and web security: `references/auth-and-web-security.md`
- Data and financial security: `references/data-and-financial-security.md`
- Report templates: `references/report-templates.md`
- Automated scanning and pre-deployment: `references/automated-scanning.md`

**Remember**: Security is not optional. One vulnerability can compromise the entire platform. When in doubt, err on the side of caution.

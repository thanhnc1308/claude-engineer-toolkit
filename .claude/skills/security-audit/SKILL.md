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

Run automated tools to catch low-hanging vulnerabilities:

```bash
# Check for vulnerable dependencies
npm audit
npm audit --audit-level=high

# Scan for hardcoded secrets in source
grep -r "api[_-]?key\|password\|secret\|token" --include="*.js" --include="*.ts" --include="*.json" .

# Check git history for accidentally committed secrets
git log -p | grep -i "password\|api_key\|secret"

# Static analysis for security issues (if configured)
npx eslint . --plugin security

# Deep secret scanning
npx trufflehog filesystem . --json
```

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

Walk through each OWASP category against the codebase (see checklist below).

### Phase 4: Report and Remediation

Generate a security review report using the templates at the bottom of this document.

## Security Checklist

### 1. Secrets Management

#### NEVER Do This

```typescript
const apiKey = 'sk-proj-xxxxx'; // Hardcoded secret
const dbPassword = 'password123'; // In source code
```

#### ALWAYS Do This

```typescript
const apiKey = process.env.OPENAI_API_KEY;
const dbUrl = process.env.DATABASE_URL;

// Verify secrets exist
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured');
}
```

#### Verification Steps

- [ ] No hardcoded API keys, tokens, or passwords
- [ ] All secrets in environment variables
- [ ] `.env.local` in .gitignore
- [ ] No secrets in git history
- [ ] Production secrets in hosting platform (Vercel, Railway)

### 2. Input Validation

#### Always Validate User Input

```typescript
import { z } from 'zod';

// Define validation schema
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150),
});

// Validate before processing
export async function createUser(input: unknown) {
  try {
    const validated = CreateUserSchema.parse(input);
    return await db.users.create(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    throw error;
  }
}
```

#### File Upload Validation

```typescript
function validateFileUpload(file: File) {
  // Size check (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)');
  }

  // Type check
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  // Extension check
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension');
  }

  return true;
}
```

#### Verification Steps

- [ ] All user inputs validated with schemas
- [ ] File uploads restricted (size, type, extension)
- [ ] No direct use of user input in queries
- [ ] Whitelist validation (not blacklist)
- [ ] Error messages don't leak sensitive info

### 3. SQL Injection Prevention

#### NEVER Concatenate SQL

```typescript
// DANGEROUS - SQL Injection vulnerability
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
await db.query(query);
```

#### ALWAYS Use Parameterized Queries

```typescript
// Safe - parameterized query
const { data } = await supabase.from('users').select('*').eq('email', userEmail);

// Or with raw SQL
await db.query('SELECT * FROM users WHERE email = $1', [userEmail]);
```

#### Verification Steps

- [ ] All database queries use parameterized queries
- [ ] No string concatenation in SQL
- [ ] ORM/query builder used correctly
- [ ] Supabase queries properly sanitized

### 4. Command Injection Prevention

#### NEVER Pass Unsanitized Input to Shell Commands

```typescript
import { exec } from 'child_process';

// DANGEROUS - Command injection vulnerability
const filename = req.query.file;
exec(`cat /uploads/${filename}`); // User sends: "; rm -rf /"
```

#### ALWAYS Use Safe Alternatives

```typescript
import { execFile } from 'child_process';

// Safe - execFile does not spawn a shell
const filename = req.query.file;
execFile('cat', ['/uploads/' + filename]);

// Even better - avoid shell commands entirely
import { readFile } from 'fs/promises';
import path from 'path';

const safeName = path.basename(filename); // Strip path traversal
const content = await readFile(path.join('/uploads', safeName), 'utf-8');
```

#### Allowlist Validation for Required Commands

```typescript
const ALLOWED_COMMANDS = ['convert', 'ffmpeg', 'pdftk'] as const;

function runTool(command: string, args: string[]) {
  if (!ALLOWED_COMMANDS.includes(command as any)) {
    throw new Error('Command not allowed');
  }
  // execFile avoids shell interpretation of args
  return execFile(command, args);
}
```

#### Verification Steps

- [ ] No user input passed to `exec()`, `execSync()`, or `spawn({ shell: true })`
- [ ] `execFile()` used instead of `exec()` when shell commands are necessary
- [ ] Arguments passed as arrays, never concatenated into command strings
- [ ] Path traversal prevented with `path.basename()` or allowlist
- [ ] Commands restricted to an allowlist when possible

### 5. Authentication & Authorization

#### JWT Token Handling

```typescript
// WRONG: localStorage (vulnerable to XSS)
localStorage.setItem('token', token);

// CORRECT: httpOnly cookies
res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
```

#### Authorization Checks

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // ALWAYS verify authorization first
  const requester = await db.users.findUnique({
    where: { id: requesterId },
  });

  if (requester.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Proceed with deletion
  await db.users.delete({ where: { id: userId } });
}
```

#### Row Level Security (Supabase)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only view their own data
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own data
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

#### Verification Steps

- [ ] Tokens stored in httpOnly cookies (not localStorage)
- [ ] Authorization checks before sensitive operations
- [ ] Row Level Security enabled in Supabase
- [ ] Role-based access control implemented
- [ ] Session management secure

### 6. XSS Prevention

#### Sanitize HTML

```typescript
import DOMPurify from 'isomorphic-dompurify'

// ALWAYS sanitize user-provided HTML
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

#### Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.example.com;
    `
      .replace(/\s{2,}/g, ' ')
      .trim(),
  },
];
```

#### Verification Steps

- [ ] User-provided HTML sanitized
- [ ] CSP headers configured
- [ ] No unvalidated dynamic content rendering
- [ ] React's built-in XSS protection used

### 7. CSRF Protection

#### CSRF Tokens

```typescript
import { csrf } from '@/lib/csrf';

export async function POST(request: Request) {
  const token = request.headers.get('X-CSRF-Token');

  if (!csrf.verify(token)) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  // Process request
}
```

#### SameSite Cookies

```typescript
res.setHeader('Set-Cookie', `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`);
```

#### Verification Steps

- [ ] CSRF tokens on state-changing operations
- [ ] SameSite=Strict on all cookies
- [ ] Double-submit cookie pattern implemented

### 8. Rate Limiting

#### API Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests',
});

// Apply to routes
app.use('/api/', limiter);
```

#### Expensive Operations

```typescript
// Aggressive rate limiting for searches
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many search requests',
});

app.use('/api/search', searchLimiter);
```

#### Verification Steps

- [ ] Rate limiting on all API endpoints
- [ ] Stricter limits on expensive operations
- [ ] IP-based rate limiting
- [ ] User-based rate limiting (authenticated)

### 9. Sensitive Data Exposure

#### Logging

```typescript
// WRONG: Logging sensitive data
console.log('User login:', { email, password });
console.log('Payment:', { cardNumber, cvv });

// CORRECT: Redact sensitive data
console.log('User login:', { email, userId });
console.log('Payment:', { last4: card.last4, userId });
```

#### Error Messages

```typescript
// WRONG: Exposing internal details
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// CORRECT: Generic error messages
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

#### Verification Steps

- [ ] No passwords, tokens, or secrets in logs
- [ ] Error messages generic for users
- [ ] Detailed errors only in server logs
- [ ] No stack traces exposed to users

### 10. Blockchain Security (Solana)

#### Wallet Verification

```typescript
import { verify } from '@solana/web3.js';

async function verifyWalletOwnership(publicKey: string, signature: string, message: string) {
  try {
    const isValid = verify(
      Buffer.from(message),
      Buffer.from(signature, 'base64'),
      Buffer.from(publicKey, 'base64'),
    );
    return isValid;
  } catch (error) {
    return false;
  }
}
```

#### Transaction Verification

```typescript
async function verifyTransaction(transaction: Transaction) {
  // Verify recipient
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient');
  }

  // Verify amount
  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit');
  }

  // Verify user has sufficient balance
  const balance = await getBalance(transaction.from);
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance');
  }

  return true;
}
```

#### Verification Steps

- [ ] Wallet signatures verified
- [ ] Transaction details validated
- [ ] Balance checks before transactions
- [ ] No blind transaction signing

### 11. Dependency Security

#### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

#### Lock Files

```bash
# ALWAYS commit lock files
git add package-lock.json

# Use in CI/CD for reproducible builds
npm ci  # Instead of npm install
```

#### Verification Steps

- [ ] Dependencies up to date
- [ ] No known vulnerabilities (npm audit clean)
- [ ] Lock files committed
- [ ] Dependabot enabled on GitHub
- [ ] Regular security updates

### 12. Race Conditions in Financial Operations

#### NEVER Use Non-Atomic Balance Checks

```typescript
// DANGEROUS - Race condition vulnerability
const balance = await getBalance(userId);
if (balance >= amount) {
  await withdraw(userId, amount); // Another request could withdraw in parallel!
}
```

#### ALWAYS Use Atomic Transactions with Row Locking

```typescript
// Safe - atomic transaction with row-level lock
await db.transaction(async (trx) => {
  const balance = await trx('balances')
    .where({ user_id: userId })
    .forUpdate() // Lock row
    .first();

  if (balance.amount < amount) {
    throw new Error('Insufficient balance');
  }

  await trx('balances').where({ user_id: userId }).decrement('amount', amount);
});
```

#### Verification Steps

- [ ] All financial operations use atomic transactions
- [ ] Row-level locking on balance checks and modifications
- [ ] No time-of-check to time-of-use (TOCTOU) gaps
- [ ] Double-entry bookkeeping validation where applicable
- [ ] No floating-point arithmetic for money (use integers/decimals)

### 13. Financial Platform Security

When the application handles real money, apply these additional checks:

- [ ] All market trades are atomic transactions
- [ ] Balance checks before any withdrawal or trade
- [ ] Rate limiting on all financial endpoints
- [ ] Audit logging for all money movements
- [ ] Transaction signatures verified
- [ ] Private keys never logged or stored in application code
- [ ] RPC endpoints rate limited
- [ ] Slippage protection on trades
- [ ] Malicious instruction detection

## Security Testing

### Automated Security Tests

```typescript
// Test authentication
test('requires authentication', async () => {
  const response = await fetch('/api/protected');
  expect(response.status).toBe(401);
});

// Test authorization
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  expect(response.status).toBe(403);
});

// Test input validation
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' }),
  });
  expect(response.status).toBe(400);
});

// Test rate limiting
test('enforces rate limits', async () => {
  const requests = Array(101)
    .fill(null)
    .map(() => fetch('/api/endpoint'));

  const responses = await Promise.all(requests);
  const tooManyRequests = responses.filter((r) => r.status === 429);

  expect(tooManyRequests.length).toBeGreaterThan(0);
});
```

## Security Review Report Template

```markdown
# Security Review Report

**File/Component:** [path/to/file.ts]
**Reviewed:** YYYY-MM-DD
**Reviewer:** security-reviewer agent

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
- [ ] No vulnerable packages
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

**Reviewer:** security-reviewer agent
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

> Security review performed by Claude Code security-reviewer agent
```

## Emergency Response Protocol

If you find a CRITICAL vulnerability in production or an actively exploited issue:

1. **Document** — Create a detailed report before touching anything
2. **Notify** — Alert the project owner immediately
3. **Recommend fix** — Provide secure code example
4. **Test fix** — Verify remediation works in isolation first
5. **Verify impact** — Determine if the vulnerability was exploited and what data/funds were affected
6. **Rotate secrets** — If credentials were exposed, rotate all of them immediately
7. **Update docs** — Add to security knowledge base to prevent recurrence

## Tool Setup

```bash
# Install security linting
npm install --save-dev eslint-plugin-security

# Install dependency auditing
npm install --save-dev audit-ci

# Add to package.json scripts
{
  "scripts": {
    "security:audit": "npm audit",
    "security:lint": "eslint . --plugin security",
    "security:check": "npm run security:audit && npm run security:lint"
  }
}
```

## Pre-Deployment Security Checklist

Before ANY production deployment:

- [ ] **Secrets**: No hardcoded secrets, all in env vars
- [ ] **Input Validation**: All user inputs validated
- [ ] **SQL Injection**: All queries parameterized
- [ ] **XSS**: User content sanitized
- [ ] **CSRF**: Protection enabled
- [ ] **Authentication**: Proper token handling
- [ ] **Authorization**: Role checks in place
- [ ] **Rate Limiting**: Enabled on all endpoints
- [ ] **HTTPS**: Enforced in production
- [ ] **Security Headers**: CSP, X-Frame-Options configured
- [ ] **Error Handling**: No sensitive data in errors
- [ ] **Logging**: No sensitive data logged
- [ ] **Dependencies**: Up to date, no vulnerabilities
- [ ] **Row Level Security**: Enabled in Supabase
- [ ] **CORS**: Properly configured
- [ ] **File Uploads**: Validated (size, type)
- [ ] **Wallet Signatures**: Verified (if blockchain)

---

**Remember**: Security is not optional. One vulnerability can compromise the entire platform. When in doubt, err on the side of caution.

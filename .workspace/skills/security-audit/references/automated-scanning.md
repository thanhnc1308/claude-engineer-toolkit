# Automated Scanning, Testing, and Pre-Deployment

## Automated Scanning Commands

```bash
# Vulnerable dependencies
npm audit
npm audit --audit-level=high

# Hardcoded secrets in source
grep -r "api[_-]?key\|password\|secret\|token" --include="*.js" --include="*.ts" --include="*.json" .

# Secrets in git history
git log -p | grep -i "password\|api_key\|secret"

# Static analysis (if configured)
npx eslint . --plugin security

# Deep secret scanning
npx trufflehog filesystem . --json
```

## Tool Setup

```bash
npm install --save-dev eslint-plugin-security audit-ci
```

```json
{
  "scripts": {
    "security:audit": "npm audit",
    "security:lint": "eslint . --plugin security",
    "security:check": "npm run security:audit && npm run security:lint"
  }
}
```

## Automated Security Tests

```typescript
test('requires authentication', async () => {
  const response = await fetch('/api/protected');
  expect(response.status).toBe(401);
});

test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  expect(response.status).toBe(403);
});

test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' }),
  });
  expect(response.status).toBe(400);
});

test('enforces rate limits', async () => {
  const requests = Array(101)
    .fill(null)
    .map(() => fetch('/api/endpoint'));
  const responses = await Promise.all(requests);
  expect(responses.filter((r) => r.status === 429).length).toBeGreaterThan(0);
});
```

## Pre-Deployment Checklist

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

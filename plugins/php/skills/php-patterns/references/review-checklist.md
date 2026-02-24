# Code Review Checklist

## 1. Security (OWASP Top 10)

- SQL injection: all queries use parameterized statements (Doctrine DBAL/ORM), no string concatenation
- XSS: output escaped in Twig templates (`{{ var|e }}`), JSON APIs return proper Content-Type
- CSRF: tokens present for state-changing operations
- Authentication: JWT validation on protected routes, token expiry checked
- Authorization: RBAC enforced, no insecure direct object references
- Secrets: no hardcoded credentials/API keys, environment variables used
- Input validation: user input validated at boundaries (beberlei/assert, Symfony Validator)
- File uploads: type, size, and content validated
- SSRF: URL validation and domain whitelisting for external requests
- Error messages: no stack traces or internal details exposed to clients

## 2. Architecture

- Controllers are thin — HTTP handling only, business logic in domain services
- Domain layer has no framework dependencies (no `Request`, `Response`, `Container` imports)
- Repository interfaces defined in domain, implementations in infrastructure
- SOLID principles followed (single responsibility, dependency inversion)
- No service locator pattern — all dependencies via constructor injection
- No anemic domain models (entities have behavior, not just getters/setters)

## 3. PHP 8.3+ Usage

- `declare(strict_types=1)` at top of every file
- Constructor property promotion with `readonly` where appropriate
- Union/intersection types used instead of docblock-only types
- Enums used instead of class constants for fixed value sets
- Match expressions preferred over switch statements
- Nullsafe operator (`?->`) used instead of nested null checks
- Named arguments used for clarity in complex function calls
- Return types declared on all methods

## 4. Error Handling

- Specific exceptions caught — no bare `catch (Exception $e)`
- Custom domain exceptions with static factory methods (e.g., `UserNotFoundException::withId()`)
- HTTP status codes semantically correct (400, 401, 403, 404, 409, 422, 500)
- Consistent JSON error response format across all endpoints
- Monolog logging with structured context (no sensitive data in logs)
- Log levels appropriate (ERROR for runtime errors, WARNING for recoverable issues, INFO for events)
- Graceful degradation with fallbacks for non-critical operations

## 5. Database & Performance

- No N+1 queries — use eager loading or batch fetching
- Indexes present for columns in WHERE, JOIN, ORDER BY clauses
- Transactions kept short with proper rollback on failure
- Batch processing for large datasets (chunked reads/writes)
- Query Builder preferred over raw SQL
- Migrations reversible and version controlled
- No data mutations inside schema migrations

## 6. Testing

- Domain services have unit tests with mocked dependencies (Prophecy)
- Arrange-Act-Assert pattern followed
- Test isolation — no shared state between tests
- Descriptive test names: `testMethodName_StateUnderTest_ExpectedBehavior`
- Specific assertions used (`assertSame`, `assertEquals`) over `assertTrue`
- Critical paths have integration tests
- Edge cases covered (null, empty, boundary values, error paths)
- Data providers used for parameterized tests

## 7. Code Style & Maintainability

- PSR-12 compliant (PascalCase classes, camelCase methods, UPPER_SNAKE_CASE constants)
- Methods under 50 lines, ideally under 20
- Cyclomatic complexity under 10
- No magic numbers — extracted to named constants
- No `@` error suppression operator
- Modern array syntax `[]` not `array()`
- Comments explain WHY, not WHAT
- Related methods grouped; public before private; constructor at top

## Output Format

For each finding, report:

- **Severity**: CRITICAL / HIGH / MEDIUM / LOW
- **Category**: Security / Architecture / PHP 8.3+ / Error Handling / Database / Testing / Style
- **Location**: file path and line number
- **Issue**: what is wrong and why it matters
- **Fix**: concrete code change

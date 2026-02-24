---
name: php-patterns
description: PHP/Silex/Symfony architecture patterns, code review checklist, refactoring catalog, dependency injection, module organization, and best practices. Use when working on PHP/Silex/Symfony projects, reviewing PHP code, or applying PHP-specific patterns.
---

# PHP/Silex/Symfony Development Patterns

## Reference Files

- **Architecture rules** — DDD layer separation, SOLID principles, repository pattern, Doctrine patterns, transaction management
  - **Reference:** `references/architecture.md`
- **Dependency injection** — Pimple/Symfony DI container, service providers, custom providers, avoiding service locator
  - **Reference:** `references/dependency-injection.md`
- **Module organization** — PSR-4 autoloading, PSR-12 coding standards, file structure, Composer conventions
  - **Reference:** `references/module-organization.md`
- **Code review checklist** — Security (OWASP Top 10), error handling, testing, code style, performance checks
  - **Reference:** `references/review-checklist.md`
- **Refactoring catalog** — Before/after patterns for fat controllers, generic exceptions, missing types, N+1 queries, and more
  - **Reference:** `references/refactoring-catalog.md`
- **Code generation** — Scaffolding templates for controllers, domain services, repositories, route definitions
  - **Reference:** `references/code-generation.md`

## Inline Patterns

### PHP 8.3+ Features

Use modern PHP capabilities throughout the codebase.

**Constructor Property Promotion:**

```php
// ❌ Verbose constructor
class AwardService
{
    private AwardRepository $awardRepository;
    private LoggerInterface $logger;

    public function __construct(AwardRepository $awardRepository, LoggerInterface $logger)
    {
        $this->awardRepository = $awardRepository;
        $this->logger = $logger;
    }
}

// ✅ Promoted properties with readonly
class AwardService
{
    public function __construct(
        private readonly AwardRepository $awardRepository,
        private readonly LoggerInterface $logger,
    ) {}
}
```

**Match Expressions:**

```php
// ❌ Verbose switch
switch ($status) {
    case 'active':
        $label = 'Active';
        break;
    case 'inactive':
        $label = 'Inactive';
        break;
    default:
        $label = 'Unknown';
}

// ✅ Match expression
$label = match ($status) {
    'active' => 'Active',
    'inactive' => 'Inactive',
    default => 'Unknown',
};
```

**Typed Enums:**

```php
// ❌ Class constants
class OrderStatus
{
    public const PENDING = 'pending';
    public const CONFIRMED = 'confirmed';
    public const CANCELLED = 'cancelled';
}

// ✅ Backed enum
enum OrderStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';
}
```

**Nullsafe Operator:**

```php
// ❌ Nested null checks
$country = null;
if ($user !== null) {
    $address = $user->getAddress();
    if ($address !== null) {
        $country = $address->getCountry();
    }
}

// ✅ Nullsafe chain
$country = $user?->getAddress()?->getCountry();
```

### Silex/Symfony HTTP Patterns

**Controller with Proper Request/Response:**

```php
// ✅ Thin controller delegating to domain service
public function assignAward(Request $request): JsonResponse
{
    $userId = $request->request->getInt('user_id');

    try {
        $award = $this->awardService->assign($userId);
        return new JsonResponse($award->toArray(), Response::HTTP_CREATED);
    } catch (UserNotFoundException $e) {
        return new JsonResponse(
            ['error' => $e->getMessage()],
            Response::HTTP_NOT_FOUND,
        );
    }
}
```

**Route Definitions:**

```php
// ✅ RESTful routes with type constraints
$app->get('/api/v1/awards/{id}', 'controller.award:get')
    ->assert('id', '\d+')
    ->convert('id', fn (string $id): int => (int) $id);

$app->post('/api/v1/awards', 'controller.award:create');
$app->put('/api/v1/awards/{id}', 'controller.award:update')->assert('id', '\d+');
$app->delete('/api/v1/awards/{id}', 'controller.award:delete')->assert('id', '\d+');
```

**Service Provider Registration:**

```php
// ✅ Proper service provider
class AwardServiceProvider implements ServiceProviderInterface
{
    public function register(Container $app): void
    {
        $app['award.repository'] = fn () => new AwardRepository($app['db']);
        $app['award.service'] = fn () => new AwardService(
            $app['award.repository'],
            $app['logger'],
        );
        $app['controller.award'] = fn () => new AwardController(
            $app['award.service'],
        );
    }
}
```

### API Design Patterns

**Consistent JSON Error Response:**

```php
// ✅ Standardized error format
class ApiErrorResponse extends JsonResponse
{
    public function __construct(
        string $message,
        int $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR,
        ?string $errorCode = null,
        array $details = [],
    ) {
        parent::__construct(
            [
                'error' => [
                    'code' => $errorCode ?? (string) $statusCode,
                    'message' => $message,
                    'details' => $details,
                ],
            ],
            $statusCode,
        );
    }
}
```

**Pagination Response:**

```php
// ✅ Consistent pagination envelope
public function list(Request $request): JsonResponse
{
    $page = $request->query->getInt('page', 1);
    $limit = min($request->query->getInt('limit', 20), 100);

    $result = $this->repository->paginate($page, $limit);

    return new JsonResponse([
        'data' => array_map(fn (Award $a) => $a->toArray(), $result->items),
        'meta' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $result->total,
        ],
    ]);
}
```

### Database Patterns

**Parameterized Queries with Doctrine DBAL:**

```php
// ❌ SQL injection risk
$sql = "SELECT * FROM awards WHERE user_id = " . $userId;

// ✅ Parameterized query
$stmt = $this->db->prepare('SELECT * FROM awards WHERE user_id = :userId');
$stmt->bindValue('userId', $userId, ParameterType::INTEGER);
$result = $stmt->executeQuery();

// ✅ Query Builder
$qb = $this->db->createQueryBuilder();
$qb->select('a.*')
    ->from('awards', 'a')
    ->where('a.user_id = :userId')
    ->setParameter('userId', $userId, ParameterType::INTEGER);
```

**Batch Processing:**

```php
// ✅ Process large datasets in chunks
public function processAllAwards(): void
{
    $offset = 0;
    $batchSize = 100;

    do {
        $awards = $this->repository->findBatch($offset, $batchSize);

        foreach ($awards as $award) {
            $this->processAward($award);
        }

        $offset += $batchSize;
    } while (count($awards) === $batchSize);
}
```

### Error Handling

**Custom Exception Hierarchy:**

```php
// ✅ Domain-specific exceptions
abstract class DomainException extends \RuntimeException {}

class UserNotFoundException extends DomainException
{
    public static function withId(int $id): self
    {
        return new self(sprintf('User with ID %d not found', $id));
    }
}

class InsufficientPointsException extends DomainException
{
    public static function forUser(int $userId, int $required, int $available): self
    {
        return new self(sprintf(
            'User %d has %d points but %d required',
            $userId,
            $available,
            $required,
        ));
    }
}
```

**Structured Logging with Monolog:**

```php
// ✅ Contextual logging
$this->logger->error('Award assignment failed', [
    'user_id' => $userId,
    'exception' => $e->getMessage(),
    'trace' => $e->getTraceAsString(),
]);

// ❌ Never log sensitive data
$this->logger->info('User logged in', ['password' => $password]); // WRONG
```

### Authentication & Authorization

**JWT Token Validation Middleware:**

```php
// ✅ Before middleware for JWT validation
$app->before(function (Request $request) use ($app) {
    $publicPaths = ['/health', '/api/v1/auth/login'];
    if (in_array($request->getPathInfo(), $publicPaths, true)) {
        return null;
    }

    $token = $request->headers->get('Authorization');
    if ($token === null || !str_starts_with($token, 'Bearer ')) {
        return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    try {
        $decoded = $app['jwt.decoder']->decode(substr($token, 7));
        $request->attributes->set('user', $decoded);
    } catch (InvalidTokenException $e) {
        return new JsonResponse(['error' => 'Invalid token'], Response::HTTP_UNAUTHORIZED);
    }

    return null;
});
```

### Testing Patterns

**PHPUnit with Prophecy:**

```php
// ✅ Unit test with Arrange-Act-Assert
class AwardServiceTest extends TestCase
{
    use ProphecyTrait;

    public function testAssignAward_ValidUser_CreatesAward(): void
    {
        // Arrange
        $repository = $this->prophesize(AwardRepository::class);
        $calculator = $this->prophesize(AwardCalculator::class);

        $calculator->calculatePoints(42)->willReturn(100);
        $repository->createAward(42, 100)->willReturn(new Award(1, 42, 100));

        $service = new AwardService($repository->reveal(), $calculator->reveal());

        // Act
        $award = $service->assign(42);

        // Assert
        $this->assertSame(42, $award->getUserId());
        $this->assertSame(100, $award->getPoints());
    }
}
```

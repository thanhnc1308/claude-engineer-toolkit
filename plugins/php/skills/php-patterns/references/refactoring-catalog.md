# Refactoring Catalog

## 1. Extract Domain Service from Fat Controller

**When:** Controller contains business logic beyond HTTP handling.

**Before:**

```php
class AwardController
{
    public function assign(Request $request): JsonResponse
    {
        $userId = $request->request->getInt('user_id');
        $user = $this->db->fetchAssociative('SELECT * FROM users WHERE id = ?', [$userId]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $points = $user['base_points'] * 1.5 + $user['bonus'];
        $this->db->insert('awards', [
            'user_id' => $userId,
            'points' => $points,
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        return new JsonResponse(['points' => $points], 201);
    }
}
```

**After:**

```php
// Controller — thin, HTTP only
class AwardController
{
    public function __construct(
        private readonly AwardService $awardService,
    ) {}

    public function assign(Request $request): JsonResponse
    {
        $userId = $request->request->getInt('user_id');

        try {
            $award = $this->awardService->assign($userId);
            return new JsonResponse($award->toArray(), Response::HTTP_CREATED);
        } catch (UserNotFoundException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }
}

// Domain service — business logic
class AwardService
{
    public function __construct(
        private readonly AwardRepositoryInterface $awardRepository,
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function assign(int $userId): Award
    {
        $user = $this->userRepository->findOrFail($userId);
        $points = $user->getBasePoints() * 1.5 + $user->getBonus();

        return $this->awardRepository->create($userId, (int) $points);
    }
}
```

## 2. Replace Generic Exception with Domain Exceptions

**When:** Code catches bare `Exception` or throws generic `\RuntimeException`.

**Before:**

```php
try {
    $this->processAward($userId);
} catch (Exception $e) {
    return new JsonResponse(['error' => 'Failed'], 500);
}
```

**After:**

```php
try {
    $this->processAward($userId);
} catch (AwardNotFoundException $e) {
    return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_NOT_FOUND);
} catch (InsufficientPointsException $e) {
    return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
} catch (DomainException $e) {
    $this->logger->error('Award processing failed', ['exception' => $e]);
    return new JsonResponse(['error' => 'Processing failed'], Response::HTTP_INTERNAL_SERVER_ERROR);
}
```

## 3. Add Type Declarations and Strict Types

**When:** Methods lack parameter types, return types, or `strict_types` declaration.

**Before:**

```php
class AwardCalculator
{
    private $multiplier;

    public function __construct($multiplier)
    {
        $this->multiplier = $multiplier;
    }

    public function calculate($basePoints, $bonus)
    {
        return $basePoints * $this->multiplier + $bonus;
    }
}
```

**After:**

```php
declare(strict_types=1);

class AwardCalculator
{
    public function __construct(
        private readonly float $multiplier,
    ) {}

    public function calculate(int $basePoints, int $bonus): int
    {
        return (int) ($basePoints * $this->multiplier + $bonus);
    }
}
```

## 4. Replace Service Locator with Constructor Injection

**When:** Services pull dependencies from a global container inside methods.

**Before:**

```php
class AwardService
{
    public function assign(int $userId): Award
    {
        $repo = Container::getInstance()->get('award.repository');
        $logger = Container::getInstance()->get('logger');

        $award = $repo->createAward($userId, 100);
        $logger->info('Award assigned', ['user_id' => $userId]);

        return $award;
    }
}
```

**After:**

```php
class AwardService
{
    public function __construct(
        private readonly AwardRepositoryInterface $awardRepository,
        private readonly LoggerInterface $logger,
    ) {}

    public function assign(int $userId): Award
    {
        $award = $this->awardRepository->createAward($userId, 100);
        $this->logger->info('Award assigned', ['user_id' => $userId]);

        return $award;
    }
}
```

## 5. Fix N+1 Query with Batch Fetching

**When:** A loop executes a query per iteration.

**Before:**

```php
$users = $this->db->fetchAllAssociative('SELECT * FROM users WHERE active = 1');

foreach ($users as $user) {
    $awards = $this->db->fetchAllAssociative(
        'SELECT * FROM awards WHERE user_id = ?',
        [$user['id']],
    );
    $user['awards'] = $awards;
    $results[] = $user;
}
```

**After:**

```php
$users = $this->db->fetchAllAssociative('SELECT * FROM users WHERE active = 1');
$userIds = array_column($users, 'id');

// Single query for all awards
$awards = $this->db->fetchAllAssociative(
    'SELECT * FROM awards WHERE user_id IN (?)',
    [$userIds],
    [ArrayParameterType::INTEGER],
);

// Group awards by user_id
$awardsByUser = [];
foreach ($awards as $award) {
    $awardsByUser[$award['user_id']][] = $award;
}

// Merge
foreach ($users as &$user) {
    $user['awards'] = $awardsByUser[$user['id']] ?? [];
}
```

## 6. Replace Class Constants with Backed Enum

**When:** Class constants represent a fixed set of related values.

**Before:**

```php
class OrderStatus
{
    public const PENDING = 'pending';
    public const CONFIRMED = 'confirmed';
    public const SHIPPED = 'shipped';
    public const CANCELLED = 'cancelled';

    public static function isValid(string $status): bool
    {
        return in_array($status, [self::PENDING, self::CONFIRMED, self::SHIPPED, self::CANCELLED], true);
    }
}
```

**After:**

```php
enum OrderStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Shipped = 'shipped';
    case Cancelled = 'cancelled';
}

// Usage: OrderStatus::from('pending'), OrderStatus::tryFrom($input)
// Validation is built-in — invalid values throw ValueError
```

## 7. Extract Value Object from Primitive Obsession

**When:** Primitives carry domain meaning and validation logic is scattered.

**Before:**

```php
class User
{
    public function __construct(
        private string $email,
    ) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Invalid email');
        }
    }

    public function getEmail(): string
    {
        return $this->email;
    }
}
```

**After:**

```php
// Value object — reusable, self-validating
final class Email
{
    private function __construct(
        private readonly string $value,
    ) {}

    public static function fromString(string $email): self
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidEmailException($email);
        }

        return new self($email);
    }

    public function toString(): string
    {
        return $this->value;
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }
}

class User
{
    public function __construct(
        private readonly Email $email,
    ) {}
}
```

## Refactoring Guidelines

1. **Preserve behavior** — refactoring must not change external behavior; write tests first if none exist
2. **Incremental steps** — make one change at a time, verify tests pass after each step
3. **Test-first** — ensure adequate test coverage before refactoring; add tests for uncovered paths
4. **Version control** — commit before and after each refactoring for easy rollback
5. **Risk assessment** — start with low-risk refactorings (rename, extract method) before structural changes

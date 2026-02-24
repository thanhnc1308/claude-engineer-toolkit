# Dependency Injection

## Pimple/Symfony DI Container

- Register services as factory closures in the container:

```php
$app['award.repository'] = fn () => new AwardRepository($app['db']);
$app['award.service'] = fn () => new AwardService(
    $app['award.repository'],
    $app['logger'],
);
```

- Use `$app->extend()` to decorate existing services without replacing them
- Prefer constructor injection — all dependencies explicit in the constructor signature

## Service Providers

- Group related services into `ServiceProviderInterface` implementations
- Each provider registers services for one bounded context (e.g., `AwardServiceProvider`)
- Register providers in the application bootstrap, not inside other providers
- Keep provider `register()` methods focused on wiring — no business logic

## Constructor Injection Pattern

```php
// ✅ Explicit dependencies, readonly, promoted
class AwardService
{
    public function __construct(
        private readonly AwardRepository $awardRepository,
        private readonly LoggerInterface $logger,
    ) {}
}
```

- Always use constructor injection over setter injection or property injection
- Use `readonly` for dependencies that should not change after construction
- Type-hint against interfaces, not concrete classes

## Service Locator Anti-Pattern

```php
// ❌ Service locator — hides dependencies
class AwardService
{
    public function assign(int $userId): Award
    {
        $repo = Container::getInstance()->get('award.repository');
        return $repo->createAward($userId, 100);
    }
}

// ✅ Explicit injection — dependencies visible
class AwardService
{
    public function __construct(
        private readonly AwardRepository $awardRepository,
    ) {}

    public function assign(int $userId): Award
    {
        return $this->awardRepository->createAward($userId, 100);
    }
}
```

- Never pull dependencies from a global container inside methods
- All dependencies should be declared in the constructor
- This makes classes testable — mock dependencies via constructor in tests

## Circular Dependencies

- Avoid circular dependencies between services; refactor to extract a shared dependency or use events
- If unavoidable, use lazy loading (`$app->factory()`) or event-based communication
- Circular dependencies usually signal a design problem — revisit the bounded context boundaries

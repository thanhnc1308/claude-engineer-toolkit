# Code Generation

## Before Generating

- Explore the existing codebase for conventions (naming, directory layout, patterns)
- Check for shared utilities, base classes, or traits that should be reused
- Identify the correct namespace and directory for the new code
- Review existing service provider registrations for the target bounded context

## Module Structure Template

```
src/<Feature>/
├── Controller/
│   └── <Feature>Controller.php        # Thin HTTP handler
├── Domain/
│   ├── Service/
│   │   └── <Feature>Service.php       # Business logic
│   ├── Repository/
│   │   └── <Feature>RepositoryInterface.php  # Data access contract
│   ├── Entity/
│   │   └── <Feature>.php              # Domain entity
│   ├── ValueObject/                   # Domain value objects (if needed)
│   └── Exception/
│       └── <Feature>NotFoundException.php    # Domain exceptions
├── Infrastructure/
│   └── Repository/
│       └── Doctrine<Feature>Repository.php  # Doctrine implementation
└── Provider/
    └── <Feature>ServiceProvider.php    # DI wiring
```

## Code Standards

- Always start files with `declare(strict_types=1);`
- Use constructor property promotion with `readonly` for immutable dependencies
- Type all parameters, return values, and properties
- Use `final` on classes not designed for extension
- Controller methods return `JsonResponse` with appropriate HTTP status codes
- Services throw domain exceptions, controllers catch and map to HTTP responses
- Repositories accept and return domain entities, not raw arrays
- Use Symfony Validator constraints or beberlei/assert for input validation

## Controller Template

```php
<?php

declare(strict_types=1);

namespace App\Controller;

use App\Domain\Service\FeatureService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class FeatureController
{
    public function __construct(
        private readonly FeatureService $featureService,
    ) {}

    public function get(Request $request, int $id): JsonResponse
    {
        $entity = $this->featureService->findById($id);

        return new JsonResponse($entity->toArray());
    }

    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        $entity = $this->featureService->create($data);

        return new JsonResponse($entity->toArray(), Response::HTTP_CREATED);
    }
}
```

## Service Provider Template

```php
<?php

declare(strict_types=1);

namespace App\Provider;

use App\Controller\FeatureController;
use App\Domain\Service\FeatureService;
use App\Infrastructure\Repository\DoctrineFeatureRepository;
use Pimple\Container;
use Pimple\ServiceProviderInterface;

final class FeatureServiceProvider implements ServiceProviderInterface
{
    public function register(Container $app): void
    {
        $app['feature.repository'] = fn () => new DoctrineFeatureRepository($app['db']);
        $app['feature.service'] = fn () => new FeatureService(
            $app['feature.repository'],
            $app['logger'],
        );
        $app['controller.feature'] = fn () => new FeatureController(
            $app['feature.service'],
        );
    }
}
```

## Route Registration

```php
// RESTful routes with type constraints
$app->get('/api/v1/features/{id}', 'controller.feature:get')
    ->assert('id', '\d+')
    ->convert('id', fn (string $id): int => (int) $id);

$app->post('/api/v1/features', 'controller.feature:create');
$app->put('/api/v1/features/{id}', 'controller.feature:update')->assert('id', '\d+');
$app->delete('/api/v1/features/{id}', 'controller.feature:delete')->assert('id', '\d+');
```

## Process

1. **Scaffold** — create directory structure and empty files following the template above
2. **Implement** — start with the domain layer (entity, repository interface, service), then infrastructure (Doctrine repository), then controller and service provider
3. **Test** — write unit tests for the service, integration tests for the repository, verify routes return expected responses

# Module Organization

## Directory Structure

```
src/
├── Controller/              # HTTP controllers (thin, delegate to domain)
│   ├── AwardController.php
│   └── UserController.php
├── Domain/                  # Business logic (framework-agnostic)
│   ├── Service/
│   │   └── AwardService.php
│   ├── Repository/          # Repository interfaces
│   │   └── AwardRepositoryInterface.php
│   ├── Entity/
│   │   └── Award.php
│   ├── ValueObject/
│   │   └── AwardPoints.php
│   ├── Exception/
│   │   └── AwardNotFoundException.php
│   └── Consumer/            # Event/message consumers
│       └── AwardEventConsumer.php
├── Infrastructure/          # Framework/library implementations
│   ├── Repository/
│   │   └── DoctrineAwardRepository.php
│   └── Client/
│       └── ExternalApiClient.php
├── Provider/                # Silex service providers
│   └── AwardServiceProvider.php
└── Migration/               # Doctrine migrations
    └── Version20240101000000.php
```

## PSR-4 Autoloading

- Configure in `composer.json`:

```json
{
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  }
}
```

- Namespace matches directory path: `App\Domain\Service\AwardService` maps to `src/Domain/Service/AwardService.php`
- One class per file, file name matches class name exactly

## PSR-12 Coding Standards

- Naming: PascalCase for classes, camelCase for methods/properties, UPPER_SNAKE_CASE for constants
- Always declare `strict_types=1` at the top of every file
- Always declare return types and parameter types
- Group `use` statements: PHP core, third-party, project namespaces (separated by blank lines)
- Opening braces on the same line for control structures, next line for classes and methods

## Composer Conventions

- Commit `composer.lock` to version control
- Use semantic versioning for dependency constraints
- No dev dependencies in production (`--no-dev` in deployment)
- Run `composer audit` regularly to check for known vulnerabilities
- Keep dependencies updated; review changelogs before major upgrades

## Testing Structure

```
tests/
├── Unit/
│   ├── Domain/
│   │   └── Service/
│   │       └── AwardServiceTest.php
│   └── Controller/
│       └── AwardControllerTest.php
├── Integration/
│   └── Repository/
│       └── DoctrineAwardRepositoryTest.php
└── bootstrap.php
```

- Mirror `src/` structure under `tests/Unit/` and `tests/Integration/`
- Unit tests for domain logic (mocked dependencies)
- Integration tests for repositories and external service clients
- Test class name = tested class name + `Test` suffix

# NestJS Dependency Injection Rules

## Constructor Injection

- Always use constructor injection — never use property injection or service locator
- List dependencies in constructor parameters with proper TypeScript types
- Mark optional dependencies with `@Optional()` decorator

```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    @Optional() private readonly cacheService?: CacheService,
  ) {}
}
```

## Provider Registration

- Register providers in the module that owns them
- Export only providers that other modules need
- Use `forRoot()` / `forRootAsync()` for configurable modules
- Use `forFeature()` for feature-specific registration (e.g., TypeORM entities)

## Injection Scopes

- Use `DEFAULT` (singleton) scope unless you have a specific reason not to
- Use `REQUEST` scope only when you need per-request state (multi-tenancy, request context)
- Be aware that `REQUEST` scope propagates up the injection chain
- Use `TRANSIENT` scope for stateless services that need fresh instances

## Custom Providers

- Use `useFactory` for providers that need async initialization or configuration
- Use `useValue` for constants and configuration objects
- Use `useClass` for swapping implementations (testing, feature flags)
- Use injection tokens (`Symbol` or `InjectionToken`) for interface-based injection

## Circular Dependencies

- Avoid circular dependencies between modules
- If unavoidable, use `forwardRef()` — but treat it as a code smell
- Consider extracting shared logic into a new module to break the cycle
- Use event-based communication (EventEmitter2) for loose coupling

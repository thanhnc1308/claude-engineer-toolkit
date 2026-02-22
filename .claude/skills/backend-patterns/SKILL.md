---
name: backend-patterns
description: Backend architecture patterns, API design, database optimization, and server-side best practices for NestJS applications.
---

# Backend Development Patterns

Backend architecture patterns and best practices for scalable NestJS applications.

## API Design Patterns

### RESTful Controller Structure

```typescript
// ✅ Resource-based controllers with proper decorators
@ApiTags("markets")
@Controller("markets")
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  @ApiOperation({ summary: "List markets" })
  findAll(@Query() query: FindMarketsDto): Promise<Market[]> {
    return this.marketsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single market" })
  findOne(@Param("id", ParseUUIDPipe) id: string): Promise<Market> {
    return this.marketsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a market" })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateMarketDto): Promise<Market> {
    return this.marketsService.create(dto);
  }

  @Put(":id")
  replace(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: CreateMarketDto,
  ): Promise<Market> {
    return this.marketsService.replace(id, dto);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateMarketDto,
  ): Promise<Market> {
    return this.marketsService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.marketsService.remove(id);
  }
}
```

### Query DTO with Validation

```typescript
// ✅ Query parameters for filtering, sorting, pagination
export class FindMarketsDto {
  @IsOptional()
  @IsEnum(MarketStatus)
  status?: MarketStatus;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}

// GET /markets?status=active&sort=volume&limit=20&offset=0
```

### Repository Pattern

```typescript
// Abstract data access logic using TypeORM repository
@Injectable()
export class MarketsRepository {
  constructor(
    @InjectRepository(Market)
    private readonly repo: Repository<Market>,
  ) {}

  async findAll(filters?: FindMarketsDto): Promise<Market[]> {
    const qb = this.repo.createQueryBuilder("market");

    if (filters?.status) {
      qb.andWhere("market.status = :status", { status: filters.status });
    }

    if (filters?.sort) {
      qb.orderBy(`market.${filters.sort}`, "DESC");
    }

    if (filters?.limit) {
      qb.limit(filters.limit);
    }

    if (filters?.offset) {
      qb.offset(filters.offset);
    }

    return qb.getMany();
  }

  async findById(id: string): Promise<Market | null> {
    return this.repo.findOneBy({ id });
  }

  async create(data: CreateMarketDto): Promise<Market> {
    const market = this.repo.create(data);
    return this.repo.save(market);
  }

  async update(id: string, data: UpdateMarketDto): Promise<Market> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
```

### Service Layer Pattern

```typescript
// Business logic separated from data access
@Injectable()
export class MarketsService {
  constructor(
    private readonly marketsRepo: MarketsRepository,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async findAll(query: FindMarketsDto): Promise<Market[]> {
    return this.marketsRepo.findAll(query);
  }

  async findOne(id: string): Promise<Market> {
    const market = await this.marketsRepo.findById(id);
    if (!market) {
      throw new NotFoundException(`Market #${id} not found`);
    }
    return market;
  }

  async searchMarkets(query: string, limit = 10): Promise<Market[]> {
    // Business logic
    const embedding = await this.embeddingService.generate(query);
    const results = await this.vectorSearch(embedding, limit);

    // Fetch full data
    const ids = results.map((r) => r.id);
    const markets = await this.marketsRepo.findByIds(ids);

    // Sort by similarity
    return markets.sort((a, b) => {
      const scoreA = results.find((r) => r.id === a.id)?.score ?? 0;
      const scoreB = results.find((r) => r.id === b.id)?.score ?? 0;
      return scoreA - scoreB;
    });
  }

  private async vectorSearch(
    embedding: number[],
    limit: number,
  ): Promise<{ id: string; score: number }[]> {
    // Vector search implementation
  }
}
```

### Middleware & Interceptors

```typescript
// NestJS middleware for request processing
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on("finish", () => {
      this.logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`,
      );
    });

    next();
  }
}

// Register in module
@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
```

```typescript
// Interceptor for response transformation
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  { success: boolean; data: T }
> {
  intercept(context: ExecutionContext, next: CallHandler<T>) {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}

// Apply globally or per controller
@UseInterceptors(TransformInterceptor)
@Controller("markets")
export class MarketsController {}
```

## Database Patterns

### Query Optimization

```typescript
// ✅ GOOD: Select only needed columns
const markets = await this.repo
  .createQueryBuilder("market")
  .select(["market.id", "market.name", "market.status", "market.volume"])
  .where("market.status = :status", { status: "active" })
  .orderBy("market.volume", "DESC")
  .limit(10)
  .getMany();

// ❌ BAD: Select everything
const markets = await this.repo.find();
```

### N+1 Query Prevention

```typescript
// ❌ BAD: N+1 query problem
const markets = await this.marketRepo.find();
for (const market of markets) {
  market.creator = await this.userRepo.findOneBy({ id: market.creatorId }); // N queries
}

// ✅ GOOD: Eager loading with relations
const markets = await this.marketRepo.find({
  relations: ["creator"],
});

// ✅ GOOD: QueryBuilder with join
const markets = await this.marketRepo
  .createQueryBuilder("market")
  .leftJoinAndSelect("market.creator", "creator")
  .getMany();

// ✅ GOOD: Batch fetch when relations aren't applicable
const markets = await this.marketRepo.find();
const creatorIds = [...new Set(markets.map((m) => m.creatorId))];
const creators = await this.userRepo.findBy({ id: In(creatorIds) });
const creatorMap = new Map(creators.map((c) => [c.id, c]));

markets.forEach((market) => {
  market.creator = creatorMap.get(market.creatorId);
});
```

### Transaction Pattern

```typescript
@Injectable()
export class MarketsService {
  constructor(private readonly dataSource: DataSource) {}

  async createMarketWithPosition(
    marketData: CreateMarketDto,
    positionData: CreatePositionDto,
  ): Promise<Market> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const market = queryRunner.manager.create(Market, marketData);
      await queryRunner.manager.save(market);

      const position = queryRunner.manager.create(Position, {
        ...positionData,
        marketId: market.id,
      });
      await queryRunner.manager.save(position);

      await queryRunner.commitTransaction();
      return market;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
```

## Caching Strategies

### NestJS Cache Manager

```typescript
// Register CacheModule in your module
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get("REDIS_HOST"),
        port: config.get("REDIS_PORT"),
        ttl: 300, // 5 minutes default
      }),
    }),
  ],
  providers: [MarketsService],
})
export class MarketsModule {}
```

```typescript
// Use cache in service
@Injectable()
export class MarketsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly marketsRepo: MarketsRepository,
  ) {}

  async findOne(id: string): Promise<Market> {
    const cacheKey = `market:${id}`;

    // Check cache first
    const cached = await this.cache.get<Market>(cacheKey);
    if (cached) return cached;

    // Cache miss — fetch from database
    const market = await this.marketsRepo.findById(id);
    if (!market) {
      throw new NotFoundException(`Market #${id} not found`);
    }

    // Store in cache
    await this.cache.set(cacheKey, market, 300_000); // 5 min TTL
    return market;
  }

  async update(id: string, dto: UpdateMarketDto): Promise<Market> {
    const market = await this.marketsRepo.update(id, dto);
    await this.cache.del(`market:${id}`); // Invalidate cache
    return market;
  }
}
```

### Cache Interceptor (Automatic Caching)

```typescript
// Auto-cache GET responses at controller or method level
@Controller("markets")
export class MarketsController {
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60) // 60 seconds
  @CacheKey("all-markets")
  findAll(): Promise<Market[]> {
    return this.marketsService.findAll();
  }
}
```

## Error Handling Patterns

### Custom Exception Filters

```typescript
// Domain-specific exceptions
export class MarketNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Market #${id} not found`);
  }
}

export class MarketClosedException extends ConflictException {
  constructor(id: string) {
    super(`Market #${id} is already closed`);
  }
}
```

```typescript
// Centralized exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      response.status(status).json({
        success: false,
        statusCode: status,
        message:
          typeof exceptionResponse === "string"
            ? exceptionResponse
            : (exceptionResponse as any).message,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Unexpected errors
    this.logger.error("Unhandled exception", (exception as Error).stack);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

// Register globally in main.ts
app.useGlobalFilters(new AllExceptionsFilter());
```

### Validation with Pipes

```typescript
// Global validation pipe in main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip unknown properties
    forbidNonWhitelisted: true, // Throw on unknown properties
    transform: true, // Auto-transform to DTO types
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);

// DTOs with class-validator
export class CreateMarketDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @IsString()
  description: string;

  @IsEnum(MarketStatus)
  status: MarketStatus;

  @IsNumber()
  @Min(0)
  volume: number;
}

export class UpdateMarketDto extends PartialType(CreateMarketDto) {}
```

### Retry with Exponential Backoff

```typescript
@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchWithRetry<T>(url: string, maxRetries = 3): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const { data } = await firstValueFrom(this.httpService.get<T>(url));
        return data;
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(
          `Request to ${url} failed (attempt ${i + 1}/${maxRetries})`,
        );

        if (i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}
```

## Authentication & Authorization

### JWT Auth with Passport

```typescript
// JWT strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}

// Auth module
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
```

```typescript
// JWT auth guard
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

// Usage — protect entire controller or individual routes
@UseGuards(JwtAuthGuard)
@Controller("markets")
export class MarketsController {
  @Get()
  findAll(@CurrentUser() user: AuthUser): Promise<Market[]> {
    return this.marketsService.findAllForUser(user.userId);
  }
}
```

### Role-Based Access Control

```typescript
// Roles decorator
export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// Roles guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}

// Usage — combine with JWT guard
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("markets")
export class MarketsController {
  @Delete(":id")
  @Roles(Role.ADMIN, Role.MODERATOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.marketsService.remove(id);
  }
}
```

## Rate Limiting

### NestJS Throttler

```typescript
// Install: npm install @nestjs/throttler

// Register in AppModule
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        { name: "short", ttl: 1000, limit: 3 }, // 3 req/sec
        { name: "medium", ttl: 10000, limit: 20 }, // 20 req/10sec
        { name: "long", ttl: 60000, limit: 100 }, // 100 req/min
      ],
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard }, // Apply globally
  ],
})
export class AppModule {}
```

```typescript
// Override per-route
@Controller("markets")
export class MarketsController {
  @Get()
  @Throttle({ short: { limit: 10, ttl: 1000 } }) // Override: 10 req/sec
  findAll(): Promise<Market[]> {
    return this.marketsService.findAll();
  }

  @Post()
  @Throttle({ short: { limit: 1, ttl: 1000 } }) // Stricter: 1 req/sec
  create(@Body() dto: CreateMarketDto): Promise<Market> {
    return this.marketsService.create(dto);
  }

  @Get("health")
  @SkipThrottle() // No rate limiting
  healthCheck() {
    return { status: "ok" };
  }
}
```

## Background Jobs & Queues

### Bull Queue with NestJS

```typescript
// Install: npm install @nestjs/bull bull

// Register in module
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get("REDIS_HOST"),
          port: config.get("REDIS_PORT"),
        },
      }),
    }),
    BullModule.registerQueue({ name: "market-indexing" }),
  ],
  providers: [MarketIndexingProcessor],
})
export class MarketsModule {}
```

```typescript
// Queue processor
@Processor("market-indexing")
export class MarketIndexingProcessor {
  private readonly logger = new Logger(MarketIndexingProcessor.name);

  @Process("index")
  async handleIndex(job: Job<{ marketId: string }>) {
    this.logger.log(`Indexing market ${job.data.marketId}`);

    // Perform indexing work
    await this.indexMarket(job.data.marketId);

    this.logger.log(`Finished indexing market ${job.data.marketId}`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`, error.stack);
  }

  private async indexMarket(marketId: string) {
    // Indexing implementation
  }
}
```

```typescript
// Add jobs from service
@Injectable()
export class MarketsService {
  constructor(
    @InjectQueue("market-indexing") private readonly indexQueue: Queue,
  ) {}

  async create(dto: CreateMarketDto): Promise<Market> {
    const market = await this.marketsRepo.create(dto);

    // Add to queue instead of blocking
    await this.indexQueue.add(
      "index",
      { marketId: market.id },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
      },
    );

    return market;
  }
}
```

## Logging & Monitoring

### NestJS Logger

```typescript
// Use the built-in NestJS Logger
@Injectable()
export class MarketsService {
  private readonly logger = new Logger(MarketsService.name);

  async findAll(query: FindMarketsDto): Promise<Market[]> {
    this.logger.log(`Fetching markets with filters: ${JSON.stringify(query)}`);

    try {
      const markets = await this.marketsRepo.findAll(query);
      this.logger.log(`Found ${markets.length} markets`);
      return markets;
    } catch (error) {
      this.logger.error("Failed to fetch markets", error.stack);
      throw error;
    }
  }
}
```

### Custom Logger with Structured Output

```typescript
// Custom logger for structured JSON logging
@Injectable()
export class StructuredLogger extends ConsoleLogger {
  log(message: string, context?: string) {
    super.log(this.formatMessage("info", message, context), context);
  }

  error(message: string, stack?: string, context?: string) {
    super.error(
      this.formatMessage("error", message, context, stack),
      stack,
      context,
    );
  }

  warn(message: string, context?: string) {
    super.warn(this.formatMessage("warn", message, context), context);
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
    stack?: string,
  ): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      ...(stack && { stack }),
    });
  }
}

// Use in main.ts
const app = await NestFactory.create(AppModule, {
  logger: new StructuredLogger(),
});
```

### Logging Interceptor

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url } = req;
    const requestId = crypto.randomUUID();
    const start = Date.now();

    this.logger.log(`[${requestId}] ${method} ${url} — started`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(`[${requestId}] ${method} ${url} — ${duration}ms`);
      }),
      catchError((error) => {
        const duration = Date.now() - start;
        this.logger.error(
          `[${requestId}] ${method} ${url} — failed after ${duration}ms`,
          error.stack,
        );
        throw error;
      }),
    );
  }
}

// Apply globally in main.ts
app.useGlobalInterceptors(new LoggingInterceptor());
```

**Remember**: NestJS provides built-in patterns for most backend concerns — prefer framework features (guards, interceptors, pipes, filters, modules) over custom implementations.

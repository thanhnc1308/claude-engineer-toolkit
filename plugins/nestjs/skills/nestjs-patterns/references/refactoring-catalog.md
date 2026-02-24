# NestJS Refactoring Catalog

Common NestJS refactoring patterns with before/after examples. Use when improving code structure without changing functionality.

## 1. Extract Feature Module

```typescript
// Before: Everything in one module
@Module({
  controllers: [UserController, OrderController, ProductController],
  providers: [UserService, OrderService, ProductService],
})
export class AppModule {}

// After: Separate feature modules
@Module({
  imports: [UserModule, OrderModule, ProductModule],
})
export class AppModule {}

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

## 2. Extract Service from Fat Service

```typescript
// Before: Service doing too much
@Injectable()
export class UserService {
  async createUser(dto: CreateUserDto) {
    // User creation logic
    // Email sending logic
    // Notification logic
    // Audit logging logic
  }
}

// After: Separated responsibilities
@Injectable()
export class UserService {
  constructor(
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService,
    private readonly auditService: AuditService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.createUserRecord(dto);
    await this.emailService.sendWelcomeEmail(user);
    await this.notificationService.notifyAdmins(user);
    await this.auditService.log('user.created', user);
    return user;
  }
}
```

## 3. Generic Repository Pattern

```typescript
// base.repository.ts
export abstract class BaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    const created = this.repository.create(entity);
    return this.repository.save(created);
  }

  async update(id: string, entity: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, entity as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

// user.repository.ts
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }
}
```

## 4. Custom Decorator Composition

```typescript
// Before: Repetitive decorator stacking
@Controller('users')
export class UserController {
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, type: UserDto })
  async getUser(@Param('id') id: string) {}

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: UserDto })
  async updateUser(@Param('id') id: string) {}
}

// After: Composed decorator
export const AuthenticatedEndpoint = (roles: string[], summary: string, responseType: Type<any>) =>
  applyDecorators(
    UseGuards(AuthGuard, RolesGuard),
    Roles(...roles),
    ApiOperation({ summary }),
    ApiResponse({ status: 200, type: responseType }),
  );

@Controller('users')
export class UserController {
  @Get(':id')
  @AuthenticatedEndpoint(['admin', 'user'], 'Get user', UserDto)
  async getUser(@Param('id') id: string) {}

  @Put(':id')
  @AuthenticatedEndpoint(['admin', 'user'], 'Update user', UserDto)
  async updateUser(@Param('id') id: string) {}
}
```

## 5. Interface-Based Injection

```typescript
// Before: Concrete dependency
@Injectable()
export class OrderService {
  constructor(private readonly paymentService: StripePaymentService) {}
}

// After: Interface-based with token
export const PAYMENT_SERVICE = Symbol('PAYMENT_SERVICE');

export interface PaymentService {
  processPayment(amount: number): Promise<PaymentResult>;
  refundPayment(transactionId: string): Promise<RefundResult>;
}

@Injectable()
export class OrderService {
  constructor(@Inject(PAYMENT_SERVICE) private readonly paymentService: PaymentService) {}
}

// In module
@Module({
  providers: [{ provide: PAYMENT_SERVICE, useClass: StripePaymentService }, OrderService],
})
export class OrderModule {}
```

## 6. Exception Handling Standardization

```typescript
// Before: Inconsistent error handling
@Injectable()
export class UserService {
  async findUser(id: string) {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

// After: Domain exceptions + exception filter
export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entity: string, identifier: string) {
    super(`${entity} with identifier ${identifier} not found`, 'ENTITY_NOT_FOUND', 404);
  }
}

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.statusCode).json({
      statusCode: exception.statusCode,
      code: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## 7. DTO Inheritance and Composition

```typescript
// Before: Duplicated DTO fields
export class CreateUserDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() password: string;
}

export class UpdateUserDto {
  @IsString() @IsOptional() name?: string;
  @IsEmail() @IsOptional() email?: string;
}

// After: Using composition and mapped types
export class BaseUserDto {
  @IsString() name: string;
  @IsEmail() email: string;
}

export class CreateUserDto extends BaseUserDto {
  @IsString() @MinLength(8) password: string;
}

export class UpdateUserDto extends PartialType(BaseUserDto) {}

export class UserResponseDto extends BaseUserDto {
  @Expose() id: string;
  @Expose() @Type(() => Date) createdAt: Date;
  @Exclude() password?: string;
}
```

## Refactoring Guidelines

1. **Preserve Functionality**: Never change external behavior — refactoring improves internal structure only
2. **Incremental Changes**: Break large refactorings into smaller, verifiable steps
3. **Test First**: Ensure tests exist before refactoring. If missing, add them first
4. **Version Control**: Commit after each successful refactoring step
5. **Risk Assessment**: Identify high-risk refactorings that affect multiple areas

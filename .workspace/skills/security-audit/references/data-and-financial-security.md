# Data Exposure, Blockchain, Dependencies, Race Conditions, Financial

## 9. Sensitive Data Exposure

### Logging

```typescript
// WRONG
console.log('User login:', { email, password });
console.log('Payment:', { cardNumber, cvv });

// CORRECT
console.log('User login:', { email, userId });
console.log('Payment:', { last4: card.last4, userId });
```

### Error Messages

```typescript
// WRONG: Exposing internals
catch (error) {
  return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
}

// CORRECT: Generic errors
catch (error) {
  console.error('Internal error:', error);
  return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
}
```

### Verification

- [ ] No passwords, tokens, or secrets in logs
- [ ] Error messages generic for users
- [ ] Detailed errors only in server logs
- [ ] No stack traces exposed to users

## 10. Blockchain Security (Solana)

### Wallet Verification

```typescript
import { verify } from '@solana/web3.js';

async function verifyWalletOwnership(publicKey: string, signature: string, message: string) {
  try {
    return verify(
      Buffer.from(message),
      Buffer.from(signature, 'base64'),
      Buffer.from(publicKey, 'base64'),
    );
  } catch {
    return false;
  }
}
```

### Verification

- [ ] Wallet signatures verified
- [ ] Transaction details validated
- [ ] Balance checks before transactions
- [ ] No blind transaction signing

## 11. Dependency Security

```bash
npm audit                    # Check vulnerabilities
npm audit fix                # Fix auto-fixable
npm outdated                 # Check outdated
npm ci                       # Reproducible builds in CI
```

### Verification

- [ ] Dependencies up to date, no known vulnerabilities
- [ ] Lock files committed
- [ ] Dependabot enabled on GitHub

## 12. Race Conditions in Financial Operations

### NEVER Use Non-Atomic Balance Checks

```typescript
// DANGEROUS - race condition
const balance = await getBalance(userId);
if (balance >= amount) {
  await withdraw(userId, amount); // Another request could withdraw in parallel!
}
```

### ALWAYS Use Atomic Transactions with Row Locking

```typescript
await db.transaction(async (trx) => {
  const balance = await trx('balances').where({ user_id: userId }).forUpdate().first();
  if (balance.amount < amount) throw new Error('Insufficient balance');
  await trx('balances').where({ user_id: userId }).decrement('amount', amount);
});
```

### Verification

- [ ] All financial operations use atomic transactions
- [ ] Row-level locking on balance checks and modifications
- [ ] No TOCTOU gaps
- [ ] No floating-point arithmetic for money (use integers/decimals)

## 13. Financial Platform Security

When the application handles real money, apply these additional checks:

- [ ] All market trades are atomic transactions
- [ ] Balance checks before any withdrawal or trade
- [ ] Rate limiting on all financial endpoints
- [ ] Audit logging for all money movements
- [ ] Transaction signatures verified
- [ ] Private keys never logged or stored in application code
- [ ] RPC endpoints rate limited
- [ ] Slippage protection on trades
- [ ] Malicious instruction detection

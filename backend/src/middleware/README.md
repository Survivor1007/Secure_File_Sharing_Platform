# Middleware Layer

Handles request preprocessing before reaching controllers.

---

## Authentication Middleware

### authenticateToken

Protects routes by verifying JWT access tokens.

---

## Flow

1. Extract token from Authorization header
2. Pass token to JwtService
3. Verify token signature and expiry
4. Validate payload structure using Zod
5. Attach user to request object
6. Allow request to proceed

---

## Request Format

Authorization: Bearer <access_token>

---

## Success Case

```ts
req.user = {
  id: string,
  email: string
}
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
```


# Rate Limiter Middleware

Prevents abuse by limiting repeated requests from the same client.

## Responsibilities

- Limit number of requests per IP
- Protect sensitive endpoints (e.g., auth routes)
- Reduce risk of brute-force attacks

---

## Usage

- Applied to routes like:
  - login
  - register
  - refresh token

---

## Behavior

- Tracks requests per IP
- Blocks requests after limit is exceeded
- Returns error response when limit is hit

---

## Error Handling

- Too many requests → 429 Too Many Requests

---

## Notes

- Helps protect against brute-force attacks
- Can be extended using Redis for distributed systems
- Typically stricter limits on auth routes


# Error Handling Middleware

Centralized error handler for consistent API responses.

## Responsibilities

- Catch unhandled errors
- Log error details
- Return safe and structured responses

---

## Error Types Handled

### Prisma Errors

- Database-related failures
- Returns generic message (no sensitive details)

---

### Zod Validation Errors

- Input validation failures
- Returns validation error details

---

### Multer Errors

- File upload issues
- Returns upload-related error message

---

### Default Errors

- Handles all other errors
- Hides internal details in production
- Shows stack trace in development

---

## Response Format

- `success: false`
- `message: error message`
- Optional:
  - `errors` (validation)
  - `stack` (development only)

---

## Notes

- Prevents leaking sensitive internal information
- Improves debugging in development
- Should be the last middleware in the app
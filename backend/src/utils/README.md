# Utilities Layer

Contains reusable helper services used across the application.

---

## JWT Service

The `JwtService` centralizes all JWT-related logic.

---

## Responsibilities

- Generate access tokens
- Generate refresh tokens
- Verify and decode tokens
- Validate token payload structure

---

## Methods

### generateAccessToken(payload)

- Signs JWT using access secret
- Applies expiration (short-lived)

---

### generateRefreshToken(payload)

- Signs JWT using refresh secret
- Applies longer expiration

---

### verifyAccessToken(token)

- Verifies token signature and expiry
- Validates payload using Zod schema
- Returns typed `UserPayload`

---

### verifyRefreshToken(token)

- Same as access token verification
- Uses refresh secret

---

## Security Notes

- Payload is validated using Zod (runtime safety)
- Prevents malformed or tampered tokens
- Secrets are stored in environment variables

---

## Benefits

- Centralized token logic
- Strong type safety
- Reusable across services and middleware
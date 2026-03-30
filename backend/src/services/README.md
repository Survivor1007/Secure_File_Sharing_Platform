# Services Layer

This layer contains the core business logic of the application.

## Responsibilities

- Handle authentication logic (register, login, token generation)
- Interact with the database using Prisma
- Perform password hashing and verification
- Generate and validate JWT tokens

## Auth Service

The `AuthService` is responsible for:

### Register
- Checks if user already exists
- Hashes password using argon2 (argon2id)
- Stores user in database

### Login
- Verifies user credentials
- Checks account status (isActive)
- Generates access and refresh tokens

### Token Generation
- Uses JWT for authentication
- Access token (short-lived)
- Refresh token (long-lived)

### Refresh Token
- Verifies refresh token
- Fetches user from database
- Issues new tokens

## Security Notes

- Passwords are hashed using argon2id
- Tokens contain minimal payload (id, email)
- No password data is ever returned
- Token secrets are stored in environment variables


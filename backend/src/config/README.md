# Configuration Layer

This folder handles application configuration and validation.

## Files

### env.ts
- Loads environment variables
- Validates using Zod schema
- Provides typed access to env variables

### validation.ts
- Contains request validation schemas
- Used for validating user input (register, login)

## Responsibilities

- Ensure all required environment variables are present
- Enforce type safety for configuration
- Validate incoming request data

## Important

- App will fail to start if env validation fails
- Prevents runtime errors due to missing config

## Example Validations

- Email format validation
- Password constraints
- JWT secret length enforcement
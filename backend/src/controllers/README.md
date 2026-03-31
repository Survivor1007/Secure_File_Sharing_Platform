# Controllers Layer

Handles HTTP request and response logic.

## Responsibilities

- Receive and parse incoming requests
- Validate request data using Zod schemas
- Call appropriate service methods
- Return structured API responses

## Auth Controller

### Register
- Validates input
- Calls AuthService.register
- Returns user data (without password)

### Login
- Validates input
- Calls AuthService.login
- Sets refresh token in HTTP-only cookie
- Returns access token

## Error Handling

- Zod validation errors → 400 Bad Request
- Authentication errors → 401 Unauthorized
- General errors handled gracefully

## File Controller

### Upload

- Checks if user is authenticated
- Ensures file is provided
- Calls `fileService.uploadFile`
- Returns uploaded file metadata

### Get My Files

- Checks if user is authenticated
- Calls `fileService.getUserFiles`
- Returns list of user's files

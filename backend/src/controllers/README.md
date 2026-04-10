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

### Logout

- Clears refresh token cookie
- Removes client session
- Returns success response

---

### Refresh Token

- Reads refresh token from HTTP-only cookie
- Validates token via `AuthService.refreshToken`
- Issues:
  - new access token
  - new refresh token (rotated)
- Sets new refresh token in cookie
- Returns new access token

---


### Change Password

- Requires authenticated user
- Validates:
  - current password
  - new password
- Calls `AuthService.changePassword`
- Returns success response

---



## Security Notes (Auth - Password)

- Current password must be verified before update
- New password is always hashed (never stored in plain text)
- Prevents unauthorized password changes

## Error Handling (Auth - Tokens)

- Missing refresh token → 401 Unauthorized
- Invalid refresh token → 401 Unauthorized

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

## Share Controller

### Create Share Link

- Requires authenticated user
- Validates `fileId`
- Accepts optional:
  - `expiresAt`
  - `maxDownloads` (default: 10)
  - `password`
- Calls `shareService.createShareLink`
- Returns generated share link

---

### Download File

- Public endpoint (no authentication required)
- Validates token from params
- Calls `shareService.validateAndDownload`
- Checks:
  - token validity
  - expiration
  - download limits
- Streams file to client

---

### Get My Share Links

- Requires authenticated user
- Calls `shareService.getMyShareLinks`
- Returns user's created share links

---

### Revoke Share Link
- Requires authenticated user
- Calls `shareService.revokeShareLink`
- Returns success message

---
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

### Change Password

- Fetches user by ID
- Verifies current password using argon2
- Hashes new password (argon2id)
- Updates password in database

---

## Security Notes (Auth - Password)

- Current password must be verified before update
- Passwords are always hashed (never stored in plain text)
- Prevents unauthorized password changes

## Security Notes

- Passwords are hashed using argon2id
- Tokens contain minimal payload (id, email)
- No password data is ever returned
- Token secrets are stored in environment variables



## File Service

The `FileService` is responsible for handling file uploads and retrieving user files.

### Upload File

- Reads uploaded file from disk
- Generates file checksum (SHA-256)
- Stores file metadata in database:
  - original name
  - stored name
  - MIME type
  - size
  - checksum
- Associates file with user
- Returns file metadata

---

### Get User Files

- Fetches all non-deleted files for user
- Orders by latest uploaded
- Returns selected file metadata:
  - id
  - original name
  - MIME type
  - size
  - checksum
  - upload time

---

### File Handling

- Files stored in `/uploads` directory
- Unique stored filenames used (handled in upload middleware)
- Checksum used for integrity verification

---

## Security Notes (File)

- Files linked to authenticated user only
- Soft delete supported (`isDeleted`)
- No direct file access without authorization
- Checksum helps detect file tampering

## Share Service

The `ShareService` is responsible for secure file sharing and controlled downloads.

### Create Share Link

- Verifies file ownership (user can only share their own files)
- Disables all currently active links of the file
- Generates secure random token
- Optionally hashes password using argon2
- Sets:
  - expiration date
  - max download limit
- Stores share link in database
- Returns shareable URL

---

### Validate and Download

- Fetches share link using token
- Checks:
  - token validity
  - expiration
  - download limit
- Increments download count
- Verifies file exists on disk
- Returns file metadata for streaming

---

### Get My Share Links

- Fetches all active share links for user's files
- Includes file metadata
- Orders by latest created
- Adds derived fields:
  - `isExpired`
  - formatted `shareUrl`

---

### Token Handling

- Uses `crypto.randomBytes` for secure token generation
- Tokens are unique and hard to guess
- Used for public file access (`/download/:token`)

---

## Security Notes (Share)

- File ownership is strictly enforced
- Tokens are random and unguessable
- Password protection supported (hashed with argon2)
- Download limits prevent abuse
- Expiration adds time-based control
- File existence verified before download
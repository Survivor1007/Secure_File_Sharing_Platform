# Routes Layer

Defines API endpoints and maps them to controllers.

## Auth Routes

- POST /register → User registration
- POST /login → User login
- POST /refresh → Refresh Token
- POST /logout → Logs out user
- POST /change-password → Change password 

## Responsibilities

- Route incoming HTTP requests
- Delegate handling to controllers
- Keep routing logic minimal and clean
- Refresh token 
- Log out user 
- Changing the user password

## File Routes

### POST /upload

- Middleware:
  - `authenticateToken`
  - `upload` (Multer)
  - `handleUploadErrors`
- Controller:
  - `fileController.upload`

---

### GET /my-files

- Middleware:
  - `authenticateToken`
- Controller:
  - `fileController.getMyFiles`

---

## Error Handling

- Missing user → 401 Unauthorized
- Missing file → 400 Bad Request
- Upload errors → handled by middleware
- General errors → 500 Internal Server Error

---

## Notes

- File validation handled in upload middleware
- Users can only access their own files
- Service layer handles storage + DB logic

## Share Routes

### POST /create

- Middleware:
  - `authenticateToken`
- Controller:
  - `shareController.createShareLink`

---

### GET /download/:token

- Public route
- Controller:
  - `shareController.downloadFile`

---

### GET /my-links

- Middleware:
  - `authenticateToken`
- Controller:
  - `shareController.getMyShareLinks`

---

## Error Handling

- Missing user → 401 Unauthorized
- Missing fileId → 400 Bad Request
- Invalid/expired token → handled in service
- File not found → 404 Not Found
- Stream errors → 500 Internal Server Error
- General errors → 400 / 500 responses

---

## Notes

- Token-based access for secure downloads
- File streaming used for efficient downloads
- Download limits and expiration enforced in service layer
- File path resolved from local `/uploads` directory
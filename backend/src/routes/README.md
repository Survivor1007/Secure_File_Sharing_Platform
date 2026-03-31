# Routes Layer

Defines API endpoints and maps them to controllers.

## Auth Routes

- POST /register → User registration
- POST /login → User login

## Responsibilities

- Route incoming HTTP requests
- Delegate handling to controllers
- Keep routing logic minimal and clean

## Routes

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
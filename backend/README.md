# 🔐 Secure File Sharing Platform — Backend

## 📌 Overview

This backend powers a secure file sharing platform where authenticated users can upload files and generate controlled, secure download links.

The system is designed with a strong focus on:

- Authentication & authorization
- Secure file handling
- Controlled file sharing
- Production-grade backend practices

---

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | Server framework |
| TypeScript | Type-safe development |
| PostgreSQL | Relational database |
| Prisma ORM | Database access layer |
| Docker | Containerization |
| JWT | Authentication tokens |
| Argon2id | Password hashing |
| Multer | File uploads |
| Zod | Input validation |

---

## 🔐 Core Features

### 1. Authentication System
- User Registration & Login
- Password hashing using **Argon2id**
- JWT-based authentication
  - Access Tokens
  - Refresh Tokens
- Secure Logout (refresh token invalidation)
- Change Password functionality
- Input validation using **Zod**

### 2. File Upload System
- Secure file uploads using **Multer**
- File type and size validation
- Unique stored filenames (no collisions)
- Checksum generation for integrity
- Safe file storage on server

### 3. File Management
- List files uploaded by the authenticated user
- Strict authorization (users can only access their own files)

### 4. Secure File Sharing
- Generate unique shareable download links
- Token-based access (`/download/:token`)
- Configurable:
  - Expiration time
  - Download limits

### 5. Secure File Download
- Token validation before access
- Expiration & usage checks
- Download count tracking
- File streaming (memory-efficient & secure)

---

## 🛡️ Security Features

- Argon2id password hashing
- JWT validation middleware
- `httpOnly` cookies for refresh tokens
- Zod-based request validation
- File type & size restrictions
- Protection against unauthorized access
- No sensitive data leakage in errors
- Helmet for secure HTTP headers
- CORS configuration

---

## 🚦 Rate Limiting

Applied to prevent abuse and brute-force attacks:

- Authentication endpoints
- File upload endpoints
- File download endpoints

---

## ⚠️ Error Handling

- Centralized global error handler
- Consistent API response structure
- Stack traces only in development
- Safe error messages in production

---

## 📊 Audit Logging

Basic logging implemented for:

- File uploads
- Share link creation
- File downloads

Logs are stored in the `/logs` directory.

---

## 🐳 Docker Setup

- Containerized backend service
- PostgreSQL database via Docker
- Environment-based configuration
- Easy local development & deployment

---

## 📁 Project Structure
```plaintext
src/
│
├── controllers/
├── services/
├── middlewares/
├── routes/
├── utils/
├── config/
├── types/
└── app.ts
```

---

## 🔄 API Flow

- User authenticates  →  receives JWT
- User uploads file   →  stored securely
- User generates link →  token created
- Recipient uses link →  token validated
- File streamed securely with restrictions

---

## 🚀 Key Highlights

- Production-oriented backend design
- Strong focus on security best practices
- Clean architecture with separation of concerns
- Scalable and maintainable structure

---

## 📌 Future Improvements

- [ ] Redis-based token storage & rate limiting
- [ ] Cloud storage (AWS S3)
- [ ] Encrypted file storage
- [ ] Advanced audit logging
- [ ] Malware scanning

---

## 🧠 Learning Outcomes

This project demonstrates:

- Backend system design
- Authentication & authorization
- Secure file handling
- API development with TypeScript
- Real-world security practices

---

## 🧑‍💻 Author

Built as part of a full-stack learning project focused on secure backend engineering and production-ready practices.
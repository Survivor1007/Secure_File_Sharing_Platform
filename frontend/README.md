# 🔐 Secure File Sharing Platform — Frontend

A modern, responsive frontend for a secure file sharing system. Built with React 18 and TypeScript, it lets authenticated users upload, manage, and share files through a clean and intuitive UI.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Fast build tooling |
| Tailwind CSS v3 | Styling with full dark mode support |
| Native Fetch API | Lightweight API communication (no Axios) |

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- Token-based session handling
- Automatic session refresh via backend integration

### 📤 File Upload
- Drag & drop file upload
- File validation feedback
- Upload progress handling
- Toast notifications for success/failure

### 📂 My Files
- View all uploaded files
- Download and delete files
- File metadata display (name, size, date)

### 🔗 Share Links
- Generate secure shareable links
- Configure expiration time and download limits
- Copy link to clipboard with toast feedback

### 📋 My Share Links
- View all generated links
- Revoke active links
- Track usage (downloads / expiry)

### 🎨 UI/UX
- Fully responsive design
- Dark mode support
- Skeleton loaders for better perceived performance
- Toast notifications throughout

---

## 📁 Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/          # Route-level components
├── context/        # Auth and global state
├── lib/            # API calls (Fetch-based)
├── tyoes/          #Define interfaces
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🔌 Backend Dependency

This frontend requires the backend API to be running. Make sure the backend server is up before using the app.

---

## 🧪 Planned Improvements

- [ ] Error boundary handling
- [ ] Improved accessibility (ARIA support)
- [ ] Advanced file previews
- [ ] Optimistic UI updates
- [ ] Pagination / infinite scrolling

---

## 🧠 Notes

- Uses the **native Fetch API** instead of Axios for a lightweight footprint
- Designed with a focus on clean UX and responsiveness
- Built to integrate seamlessly with a secure backend architecture

---

## 👨‍💻 Author

Built as part of a full-stack secure file sharing system, with a focus on:

- Authentication & Authorization
- Secure file handling
- Clean UI/UX design

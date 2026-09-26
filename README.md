# Todo App Backend

Backend REST API untuk Todo App yang dibangun menggunakan **Express.js**, **TypeScript**, dan **MySQL**.

## 📌 Fitur & Pembaruan (Tugas #6)
- **Kontrak Data & TypeScript Types**: Pemisahan definisi tipe data per domain di dalam folder `src/types/` (`api.types.ts`, `auth.types.ts`, `todo.types.ts`, `express.d.ts`).
- **Standardized API Response**: Format respons terpusat menggunakan utility `src/utils/response.ts` dengan format seragam `{ success, message, data, meta }`.
- **Request Augmentation**: Memperluas objek `Request` Express untuk menyertakan `req.user` (identitas user terautentikasi) dan `req.requestId`.
- **Logging & Request Tracing**: Middleware pencatat (`loggerMiddleware.ts`) yang mencatat baris log `[REQUEST] [requestId] METHOD URL` dan menyertakan header `X-Request-Id` pada setiap respons HTTP.
- **Pagination Support**: Menerapkan pagination pada endpoint `GET /api/todos?page=1&limit=10` dengan metadata `page`, `limit`, `total`, dan `totalPages`.

---

## 🛠️ Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- [MySQL](https://www.mysql.com/) atau MariaDB (misalnya via XAMPP)
- npm / yarn / pnpm

---

## ⚙️ Setup & Instalasi

1. **Clone repository:**
   ```bash
   git clone https://github.com/josswinaya/backend.git
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Sesuaikan konfigurasi database dan kredensial di dalam file `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=todo_db
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Import Database MySQL:**
   - Buka **phpMyAdmin** atau terminal MySQL.
   - Buat database baru bernama `todo_db` (atau sesuai konfigurasi di `.env`):
     ```sql
     CREATE DATABASE todo_db;
     ```
   - Import file `database.sql` yang telah disediakan ke dalam database tersebut:
     ```bash
     mysql -u root -p todo_db < database.sql
     ```

---

## 🚀 Menjalankan Server

- **Mode Pengembangan (Development):**
  ```bash
  npm run dev
  ```
  Server akan berjalan di `http://localhost:5000`.

---

## 📖 Endpoint API

### 1. Root & Health Check
- `GET /` : Memeriksa status server.

### 2. Autentikasi
- `POST /api/auth/register` : Registrasi akun baru.
  - Body: `{ "username": "user", "email": "user@example.com", "password": "password123" }`
- `POST /api/auth/login` : Login akun dan menerima JWT token.
  - Body: `{ "username": "user", "password": "password123" }`

### 3. Todos (Protected - Memerlukan Header `Authorization: Bearer <token>`)
- `GET /api/todos` : Mengambil semua data todo milik pengguna.
- `GET /api/todos?page=1&limit=10` : Mengambil daftar todo dengan paginasi.
- `GET /api/todos/:id` : Mengambil satu data todo berdasarkan ID.
- `POST /api/todos` : Menambahkan todo baru.
  - Body: `{ "task": "Belajar Express & TypeScript" }`
- `PUT /api/todos/:id` : Mengubah task atau status selesai todo.
  - Body: `{ "task": "Revisi task", "is_completed": true }`
- `DELETE /api/todos/:id` : Menghapus todo.

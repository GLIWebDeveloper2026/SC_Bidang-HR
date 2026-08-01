# Dokumentasi API - Modul Auth (Manual Register & Login)

Base URL: `http://localhost:5000/api/v1/auth` (atau sesuai konfigurasi base URL server Anda)

Modul ini digunakan untuk mengelola autentikasi pengguna secara manual tanpa OAuth (seperti Google Login). Sistem autentikasi menggunakan MySQL untuk penyimpanan data dan `bcryptjs` untuk mengamankan (*hash*) password. JWT digunakan sebagai token *session* atau *bearer*.

---

## 1. Pendaftaran Pengguna Baru (Register Manual)
Digunakan untuk mendaftarkan akun pengguna baru ke dalam database MySQL. Proses ini akan membuat user baru lengkap dengan perannya (role) di dalam tabel `users` dan `level`.

* **URL:** `/register`
* **Method:** `POST`
* **Headers:** 
  - `Content-Type: application/json`
* **Body Request (JSON):**
  ```json
  {
    "nama": "Nama Lengkap Pengguna",
    "email": "email.baru@contoh.com",
    "password": "PasswordSuperKuat123",
    "role": "mahasiswa"
  }
  ```
  *(Catatan: Semua field (nama, email, password, role) wajib diisi)*

* **Response Sukses (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registrasi berhasil",
    "data": {
      "uid": "uuid-dari-user-baru",
      "nama": "Nama Lengkap Pengguna",
      "email": "email.baru@contoh.com",
      "role": "mahasiswa"
    }
  }
  ```

* **Response Gagal (400 Bad Request - Field Kosong):**
  ```json
  {
    "success": false,
    "message": "Semua field (nama, email, password, role) wajib diisi"
  }
  ```

* **Response Gagal (500 Internal Server Error - Email Sudah Terdaftar):**
  ```json
  {
    "success": false,
    "message": "Email sudah terdaftar"
  }
  ```

---

## 2. Masuk / Autentikasi Pengguna (Login Manual)
Digunakan untuk mengautentikasi pengguna dan mendapatkan JWT Token yang dapat digunakan untuk mengakses endpoint-endpoint terproteksi lainnya.

* **URL:** `/login`
* **Method:** `POST`
* **Headers:** 
  - `Content-Type: application/json`
* **Body Request (JSON):**
  ```json
  {
    "email": "email.baru@contoh.com",
    "password": "PasswordSuperKuat123"
  }
  ```
  *(Catatan: Semua field (email, password) wajib diisi)*

* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "uid": "uuid-dari-user",
        "nama": "Nama Lengkap Pengguna",
        "email": "email.baru@contoh.com",
        "role": "mahasiswa"
      }
    }
  }
  ```

* **Response Gagal (400 Bad Request - Field Kosong):**
  ```json
  {
    "success": false,
    "message": "Email dan password wajib diisi"
  }
  ```

* **Response Gagal (401 Unauthorized - Kredensial Salah):**
  ```json
  {
    "success": false,
    "message": "Email atau password salah"
  }
  ```

* **Response Gagal (401 Unauthorized - Akun Google SSO):**
  ```json
  {
    "success": false,
    "message": "Akun ini menggunakan login Google. Silakan login dengan Google."
  }
  ```

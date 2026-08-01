# Dokumentasi API - Modul Auth (Autentikasi & Registrasi)

Base URL: `http://localhost:5000/api/v1/auth`

Modul ini digunakan untuk mengelola autentikasi pengguna, termasuk pendaftaran (Registrasi) pengguna baru yang terhubung langsung dengan sistem autentikasi Supabase dan tabel `profiles`.

---

## 1. Pendaftaran Pengguna Baru (Register)
Digunakan untuk mendaftarkan akun pengguna baru. Proses ini akan membuatkan akun pada sistem otentikasi Supabase (Auth) dan secara otomatis membuatkan profil pengguna pada tabel `profiles`.

* **URL:** `/register`
* **Method:** `POST`
* **Headers:** 
  - `Content-Type: application/json`
* **Body Request (JSON):**
  ```json
  {
    "email": "email.baru@contoh.com",
    "password": "PasswordSuperKuat123",
    "nama": "Nama Lengkap Pengguna",
    "level_id": "uuid-level-yang-valid"
  }
  ```
  *(Catatan: Semua field di atas wajib diisi)*

* **Response Sukses (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registrasi berhasil",
    "data": {
      "user": {
        "id": "uuid-dari-supabase-auth",
        "aud": "authenticated",
        "role": "authenticated",
        "email": "email.baru@contoh.com",
        "created_at": "2026-08-01T10:00:00Z"
      },
      "profile": {
        "uid": "uuid-dari-supabase-auth",
        "nama": "Nama Lengkap Pengguna",
        "email": "email.baru@contoh.com",
        "level_id": "uuid-level-yang-valid",
        "status": true,
        "created_at": "2026-08-01T10:00:00Z",
        "updated_at": "2026-08-01T10:00:00Z"
      }
    }
  }
  ```

* **Response Gagal (400 Bad Request - Field Kosong):**
  ```json
  {
    "success": false,
    "message": "Semua field (email, password, nama, level_id) wajib diisi"
  }
  ```

* **Response Gagal (400 Bad Request - Error Supabase / Email Sudah Terdaftar):**
  ```json
  {
    "success": false,
    "message": "User already registered" 
  }
  ```

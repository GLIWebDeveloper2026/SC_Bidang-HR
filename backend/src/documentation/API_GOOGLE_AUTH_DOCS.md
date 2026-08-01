# Dokumentasi API - Modul Auth (Google SSO)

Base URL: `http://localhost:5000/api/v1/auth/google` (atau sesuai konfigurasi base URL server Anda)

Modul ini digunakan untuk mengelola autentikasi pengguna menggunakan **Google SSO (Single Sign-On)**. Sistem akan secara otomatis mendaftarkan pengguna ke database jika belum ada, atau langsung masuk (login) jika sudah terdaftar, lalu mengembalikan JWT Token.

---

## 1. Dapatkan URL Login Google (Redirect)
Endpoint ini bertugas untuk meng-generate URL autentikasi Google dan secara langsung me-redirect pengguna ke halaman login Google.

* **URL:** `/google`
* **Method:** `GET`
* **Response:** 
  Akan mengembalikan HTTP Status `302 Found` dan melakukan *redirect* otomatis ke halaman persetujuan/login Google (`https://accounts.google.com/o/oauth2/v2/auth?...`).

* **Response Gagal (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Gagal mendapatkan URL Login Google"
  }
  ```

---

## 2. Google Auth Callback (Menerima Token)
Endpoint ini akan dipanggil otomatis oleh Google setelah pengguna berhasil login dan memberikan persetujuan (consent). Google akan menyematkan parameter `code` pada URL. Endpoint ini **harus didaftarkan** sebagai *Redirect URI* pada Google Cloud Console.

* **URL:** `/google/callback`
* **Method:** `GET`
* **Query Parameters:**
  - `code`: (Otomatis dari Google) Kode otorisasi yang akan ditukar dengan access token.

* **Response Sukses (200 OK):**
  Mengembalikan data user beserta Token JWT untuk mengakses endpoint terproteksi.
  ```json
  {
    "success": true,
    "message": "Google Login berhasil",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "uid": "uuid-dari-user",
        "nama": "Nama Lengkap Pengguna (dari Google)",
        "email": "emailpengguna@gmail.com",
        "role": "guest" // Role default atau role yang ada di database
      }
    }
  }
  ```

* **Response Gagal (400 Bad Request - Parameter `code` tidak ada):**
  ```json
  {
    "success": false,
    "message": "Authorization code tidak ditemukan"
  }
  ```

* **Response Gagal (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Gagal memproses Google Callback"
  }
  ```

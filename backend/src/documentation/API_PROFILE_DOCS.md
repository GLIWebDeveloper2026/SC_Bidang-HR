# Dokumentasi API - Modul Profile (Manajemen Profil)

Base URL: `http://localhost:5000/api/v1/profiles`

> **PENTING:** Seluruh endpoint pada modul ini **wajib** menyertakan Header otentikasi.
> 
> **Header Request yang Dibutuhkan:**
> `Authorization: Bearer <TOKEN_JWT_DARI_SUPABASE>`

---

## 1. Mendapatkan Data Profil Sendiri (Get My Profile)
Digunakan untuk mengambil data profil *user* yang sedang *login*. API ini secara otomatis menggabungkan data bawaan dari Supabase Auth (`user_metadata`) dengan data spesifik dari tabel `profiles` di database (seperti nama, bio, status, dll).

* **URL:** `/me`
* **Method:** `GET`
* **Headers:** 
  - `Authorization: Bearer <TOKEN>`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid-user-auth",
      "email": "user@email.com",
      "name": "Nama Lengkap User",
      "avatar": "https://url-ke-foto.jpg",
      "bio": "Isi dari bio pengguna"
    }
  }
  ```
* **Response Gagal (401 Unauthorized - Token Tidak Valid/Expired):**
  ```json
  {
    "success": false,
    "message": "Belum login atau session telah berakhir"
  }
  ```

---

## 2. Memperbarui Profil Sendiri (Update Profile)
Digunakan untuk mengubah atau memperbarui informasi profil user yang sedang *login* ke dalam tabel `profiles`. Data apa pun yang dikirim melalui `body request` akan disinkronkan dan di-update pada tabel tersebut.

* **URL:** `/update`
* **Method:** `PUT`
* **Headers:** 
  - `Authorization: Bearer <TOKEN>`
  - `Content-Type: application/json`
* **Body Request (JSON):**
  *(Anda bebas mengirimkan field apa saja sesuai dengan kolom yang ada di tabel `profiles`. Contoh di bawah adalah merubah `nama` dan `bio`)*
  ```json
  {
    "nama": "Nama Baru Saya",
    "bio": "Mencari tantangan baru di dunia rekayasa perangkat lunak."
  }
  ```
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profil berhasil diperbarui!",
    "data": {
      "uid": "uuid-user-auth",
      "nama": "Nama Baru Saya",
      "email": "user@email.com",
      "bio": "Mencari tantangan baru di dunia rekayasa perangkat lunak.",
      "level_id": "uuid-level",
      "status": true,
      "updated_at": "2026-08-01T10:00:00Z"
    }
  }
  ```
* **Response Gagal (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Gagal memperbarui profil: [pesan error dari database]"
  }
  ```

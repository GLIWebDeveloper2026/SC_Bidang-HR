# Dokumentasi API - Modul Level (Manajemen Role Level)

Base URL: `http://localhost:5000/api/v1/levels`

Modul ini digunakan untuk mengelola data *Role Level* atau *Level Hierarki* pengguna dalam sistem.

---

## 1. Mendapatkan Semua Data Level (Get All Levels)
Digunakan untuk mengambil seluruh data level yang ada di dalam database.

* **URL:** `/`
* **Method:** `GET`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "uid": "uuid-level-1",
        "role": "Super Admin",
        "level": 1,
        "created_at": "2026-08-01T10:00:00Z",
        "updated_at": null
      },
      {
        "uid": "uuid-level-2",
        "role": "HRD",
        "level": 2,
        "created_at": "2026-08-01T10:05:00Z",
        "updated_at": null
      }
    ]
  }
  ```

---

## 2. Mendapatkan Detail Data Level (Get Level by ID)
Digunakan untuk mengambil data spesifik dari satu level berdasarkan `uid`.

* **URL:** `/:id`
* **Method:** `GET`
* **Parameter URL:**
  - `id` (uid / UUID dari tabel level)
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "uid": "uuid-level-1",
      "role": "Super Admin",
      "level": 1,
      "created_at": "2026-08-01T10:00:00Z",
      "updated_at": null
    }
  }
  ```
* **Response Gagal (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Role Level tidak ditemukan"
  }
  ```

---

## 3. Menambahkan Data Level Baru (Create Level)
Digunakan untuk menambahkan data level/role baru.

* **URL:** `/`
* **Method:** `POST`
* **Headers:** 
  - `Content-Type: application/json`
* **Body Request (JSON):**
  ```json
  {
    "role": "Staff",
    "level": 3
  }
  ```
  *(Catatan: `role` dan `level` wajib diisi)*
* **Response Sukses (201 Created):**
  ```json
  {
    "success": true,
    "message": "Role Level berhasil ditambahkan",
    "data": {
      "uid": "uuid-level-baru",
      "role": "Staff",
      "level": 3,
      "created_at": "2026-08-01T10:30:00Z",
      "updated_at": null
    }
  }
  ```
* **Response Gagal (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Level (angka hierarki) wajib diisi" 
  }
  ```

---

## 4. Memperbarui Data Level (Update Level)
Digunakan untuk memperbarui data level/role yang sudah ada berdasarkan `uid`.

* **URL:** `/:id`
* **Method:** `PUT`
* **Headers:** 
  - `Content-Type: application/json`
* **Parameter URL:**
  - `id` (uid / UUID dari tabel level)
* **Body Request (JSON):**
  ```json
  {
    "role": "Senior Staff",
    "level": 4
  }
  ```
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Role Level berhasil diperbarui",
    "data": {
      "uid": "uuid-level-yang-diupdate",
      "role": "Senior Staff",
      "level": 4,
      "created_at": "2026-08-01T10:30:00Z",
      "updated_at": "2026-08-01T11:00:00Z"
    }
  }
  ```

---

## 5. Menghapus Data Level (Delete Level)
Digunakan untuk menghapus data level berdasarkan `uid`.

* **URL:** `/:id`
* **Method:** `DELETE`
* **Parameter URL:**
  - `id` (uid / UUID dari tabel level)
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Role Level berhasil dihapus",
    "data": {
      "uid": "uuid-level-yang-dihapus",
      "role": "Senior Staff",
      "level": 4,
      "created_at": "2026-08-01T10:30:00Z",
      "updated_at": "2026-08-01T11:00:00Z"
    }
  }
  ```

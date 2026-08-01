# Dokumentasi API - Modul Campus (Institusi Kampus)

Base URL: `http://localhost:5000/api/v1/campus`

---

## 1. Menambahkan Kampus Baru (Create)
Digunakan (biasanya oleh Admin BKK) untuk mendaftarkan institusi/kampus baru ke dalam sistem.

* **URL:** `/`
* **Method:** `POST`
* **Body Request (JSON):**
  ```json
  {
    "nama_campus": "Universitas Teknologi Jaya",
    "akreditasi": "A"
  }
  ```
  *(Catatan: `nama_campus` wajib diisi, `akreditasi` bersifat opsional)*
* **Response Sukses (201 Created):**
  ```json
  {
    "success": true,
    "message": "Kampus berhasil ditambahkan",
    "data": {
      "uid": "uuid-campus",
      "nama_campus": "Universitas Teknologi Jaya",
      "akreditasi": "A",
      "created_at": "2026-08-01T10:00:00.000Z",
      "updated_at": "2026-08-01T10:00:00.000Z"
    }
  }
  ```

---

## 2. Mendapatkan Semua Data Kampus (Read All)
Digunakan untuk melihat daftar semua institusi kampus yang telah terdaftar, umumnya untuk ditampilkan pada *dropdown* formulir pendaftaran mahasiswa.

* **URL:** `/`
* **Method:** `GET`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "uid": "uuid-campus",
        "nama_campus": "Universitas Teknologi Jaya",
        "akreditasi": "A",
        "created_at": "...",
        "updated_at": "..."
      }
    ]
  }
  ```

---

## 3. Mendapatkan Detail Satu Kampus (Read by ID)
Mendapatkan secara spesifik detail satu kampus berdasarkan UID-nya.

* **URL:** `/:id`
* **Method:** `GET`
* **URL Params:** `id=[UUID_CAMPUS]`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "uid": "uuid-campus",
      "nama_campus": "Universitas Teknologi Jaya",
      "akreditasi": "A",
      "created_at": "...",
      "updated_at": "..."
    }
  }
  ```
* **Response Gagal (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Kampus tidak ditemukan"
  }
  ```

---

## 4. Mengupdate Data Kampus (Update)
Digunakan untuk mengubah atau memperbaiki nama maupun akreditasi sebuah kampus.

* **URL:** `/:id`
* **Method:** `PUT`
* **URL Params:** `id=[UUID_CAMPUS]`
* **Body Request (JSON):**
  *(Anda hanya perlu mengirim kolom yang ingin diubah)*
  ```json
  {
    "nama_campus": "Universitas Teknologi Jaya (UTJ)",
    "akreditasi": "Unggul"
  }
  ```
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Data kampus berhasil diperbarui",
    "data": {
      "uid": "uuid-campus",
      "nama_campus": "Universitas Teknologi Jaya (UTJ)",
      "akreditasi": "Unggul",
      "updated_at": "2026-08-01T10:00:00.000Z"
    }
  }
  ```

---

## 5. Menghapus Data Kampus (Delete)
Digunakan untuk menghapus data institusi kampus dari database. 
> **Peringatan Integritas Data:** Pada skema database tabel `mahasiswa`, Anda menyetel relasinya sebagai `ON DELETE RESTRICT`. Artinya, jika kampus tersebut *sedang digunakan* atau di-*link* oleh seorang mahasiswa, proses penghapusan (DELETE) kampus ini akan ditolak (Error) oleh sistem untuk menghindari kerusakan referensi data. Anda harus menghapus/memindahkan mahasiswanya terlebih dahulu.

* **URL:** `/:id`
* **Method:** `DELETE`
* **URL Params:** `id=[UUID_CAMPUS]`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Data kampus berhasil dihapus",
    "data": {
       "uid": "uuid-campus",
       "nama_campus": "..."
    }
  }
  ```

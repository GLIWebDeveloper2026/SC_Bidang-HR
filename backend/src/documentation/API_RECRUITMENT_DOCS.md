# Dokumentasi API - Modul Recruitment (Lowongan Pekerjaan)

Base URL: `http://localhost:5000/api/v1/recruitments`

> **Catatan:** Untuk **Membuat Lowongan Baru (POST)**, *endpoint* tersebut tidak berada di modul ini, melainkan berada di dalam Modul Company, yaitu melalui `POST /api/v1/companies/jobs` (karena proses pembuatan lowongan berkaitan erat dengan kepemilikan dan hak akses sebuah perusahaan).
> Modul Recruitment ini lebih difokuskan pada aktivitas *Read, Update,* dan *Delete* lowongan tersebut.

---

## 1. Mendapatkan Semua Data Lowongan (Get All)
Menampilkan daftar seluruh lowongan yang tersedia di sistem. *Response* yang dihasilkan telah *join* (bergabung) secara otomatis dengan relasi data profil perusahaan, daftar posisi (kuota), dan tahapan seleksinya.

* **URL:** `/`
* **Method:** `GET`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "uid": "uuid-recruitment",
        "judul_pengumuman": "Dicari Frontend Developer",
        "deskripsi": "Deskripsi pekerjaan yang panjang...",
        "lokasi_kerja": "Jakarta Selatan",
        "tanggal_buka": "2026-08-01",
        "tanggal_tutup": "2026-12-31",
        "perusahaan": {
          "uid": "uuid-company",
          "nama_perusahaan": "PT Teknologi Maju",
          "alamat": "Jl. Merdeka No 1",
          "email": "hr@tekomaju.com",
          "telepon": "08111222333"
        },
        "positions": [
          {
            "uid": "uuid-posisi",
            "posisi": "Frontend Developer",
            "kuota_posisi": 5,
            "bidang_industri": "IT/Software",
            "persyaratan": "Minimal pengalaman 1 tahun menggunakan React"
          }
        ],
     
      }
    ]
  }
  ```

---

## 2. Mendapatkan Detail Satu Lowongan (Get By ID)
Menampilkan detail lengkap dari spesifik 1 lowongan pekerjaan berdasarkan ID (UID).

* **URL:** `/:id`
* **Method:** `GET`
* **URL Params:** `id=[UUID_RECRUITMENT]`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "uid": "uuid-recruitment",
      "judul_pengumuman": "Dicari Frontend Developer",
      "perusahaan": { ... },
      "positions": [ ... ],
      "stages": [ ... ]
    }
  }
  ```
* **Response Gagal (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Lowongan tidak ditemukan"
  }
  ```

---

## 3. Memperbarui Data Lowongan (Update)
Digunakan untuk mengubah atau memperbarui informasi dasar lowongan. *(Catatan: API ini hanya memperbarui tabel utama `recruitment` seperti judul, tanggal, deskripsi, lokasi; tidak memperbarui relasi children seperti `positions` atau `stages`)*.

* **URL:** `/:id`
* **Method:** `PUT`
* **URL Params:** `id=[UUID_RECRUITMENT]`
* **Body Request (JSON):**
  *(Anda hanya perlu mengirimkan field yang ingin diubah)*
  ```json
  {
    "judul_pengumuman": "Dicari Frontend & Backend Developer (Urgently Needed)",
    "lokasi_kerja": "Jakarta Pusat",
    "tanggal_tutup": "2026-10-01"
  }
  ```
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Lowongan berhasil diubah",
    "data": {
      "uid": "uuid-recruitment",
      "judul_pengumuman": "Dicari Frontend & Backend Developer (Urgently Needed)",
      "lokasi_kerja": "Jakarta Pusat",
      "tanggal_tutup": "2026-10-01",
      "updated_at": "2026-08-01T10:00:00.000Z"
    }
  }
  ```

---

## 4. Menghapus Lowongan (Delete)
Menghapus permanen data lowongan pekerjaan. Berkat *constraint* `ON DELETE CASCADE` di database Supabase Anda, maka ketika endpoint ini dieksekusi, data turunan seperti **positions**, **stages**, dan **applications** (lamaran mahasiswa terkait) akan ikut terhapus secara otomatis tanpa menyisakan sampah data.

* **URL:** `/:id`
* **Method:** `DELETE`
* **URL Params:** `id=[UUID_RECRUITMENT]`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Lowongan berhasil dihapus",
    "data": {
      "uid": "uuid-recruitment",
      "judul_pengumuman": "Dicari Frontend Developer"
    }
  }
  ```

# Dokumentasi API - Modul Company (Perusahaan)

Base URL: `http://localhost:5000/api/v1/companies`

> **Catatan:** Endpoint yang memerlukan otentikasi harus menyertakan Header `Authorization: Bearer <token_jwt>` (sesuai konfigurasi middleware Auth Anda di masa depan).

---

## 1. Mendaftarkan Perusahaan Baru
Digunakan oleh perwakilan HR untuk mendaftarkan perusahaan. (Membuat entri di tabel `perusahaan` dan mendaftarkan pembuatnya di tabel `hr`).

* **URL:** `/register`
* **Method:** `POST`
* **Body Request (JSON):**
  ```json
  {
    "nama_perusahaan": "PT Teknologi Maju",
    "alamat": "Jl. Kemerdekaan No 45, Jakarta",
    "email": "hr@tekomaju.com",
    "telepon": "081234567890",
    "nib_npwp": "123456789012345",
    "legal_doc_url": "https://storage.url/docs/legal.pdf",
    "jabatan": "HR Manager"
  }
  ```
  *(Catatan: `jabatan` adalah posisi pendaftar (opsional, default: "HRD").)*
* **Response Sukses (201 Created):**
  ```json
  {
    "success": true,
    "message": "Pendaftaran perusahaan berhasil, menunggu verifikasi Admin BKK",
    "data": {
      "uid": "uuid-perusahaan",
      "nama_perusahaan": "PT Teknologi Maju",
      ...
    }
  }
  ```

---

## 2. Mendapatkan Semua Data Perusahaan
Menampilkan list semua perusahaan. (Bisa difilter statusnya oleh Admin, default mengambil semua).

* **URL:** `/`
* **Method:** `GET`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "uid": "uuid-perusahaan",
        "nama_perusahaan": "PT Teknologi Maju",
        "alamat": "...",
        "email": "...",
        "status_verifikasi": "PENDING",
        "hr": [ ... ],
        "recruitment": [ ... ]
      }
    ]
  }
  ```

---

## 3. Mendapatkan Detail Satu Perusahaan
Menampilkan detail lengkap suatu perusahaan beserta daftar lowongan (recruitment) mereka berdasarkan ID.

* **URL:** `/:id`
* **Method:** `GET`
* **URL Params:** `id=[UUID_PERUSAHAAN]`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "uid": "uuid-perusahaan",
      "nama_perusahaan": "PT Teknologi Maju",
      "recruitment": [
        {
          "uid": "uuid-lowongan",
          "judul_pengumuman": "Dicari Frontend Developer",
          ...
        }
      ]
    }
  }
  ```

---

## 4. Update Data Perusahaan
Mengubah data profil perusahaan (contoh: diubah oleh admin atau HR).

* **URL:** `/:id`
* **Method:** `PUT`
* **URL Params:** `id=[UUID_PERUSAHAAN]`
* **Body Request (JSON):** *(Kirim hanya field yang ingin diubah)*
  ```json
  {
    "alamat": "Jl. Baru No 99, Jakarta",
    "status_verifikasi": "VERIFIED"
  }
  ```
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Data perusahaan berhasil diperbarui",
    "data": { ...data_terbaru... }
  }
  ```

---

## 5. Menghapus Perusahaan
Menghapus permanen data perusahaan beserta data relasinya (termasuk pendaftar & lowongan karena efek `CASCADE`).

* **URL:** `/:id`
* **Method:** `DELETE`
* **URL Params:** `id=[UUID_PERUSAHAAN]`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Perusahaan berhasil dihapus",
    "data": { ...data_terhapus... }
  }
  ```

---

## 6. Membuat Lowongan Pekerjaan (Recruitment) Baru
Digunakan oleh perwakilan perusahaan untuk memposting lowongan kerja beserta posisi & tahapan seleksinya.

* **URL:** `/jobs`
* **Method:** `POST`
* **Body Request (JSON):**
  ```json
  {
    "judul_pengumuman": "Rekrutmen Besar 2026",
    "deskripsi": "Mencari lulusan terbaik.",
    "lokasi_kerja": "Jakarta Selatan",
    "tanggal_tutup": "2026-12-31",
    "positions": [
      {
        "posisi": "Software Engineer",
        "kuota_posisi": 5,
        "bidang_industri": "IT",
        "persyaratan": "Minimal IPK 3.0"
      }
    ],
    "stages": [
      { "nama_tahapan": "Seleksi Berkas", "urutan_tahapan": 1 },
      { "nama_tahapan": "Interview HR", "urutan_tahapan": 2 }
    ]
  }
  ```
* **Response Sukses (201 Created):**
  ```json
  {
    "success": true,
    "message": "Pengumuman lowongan berhasil dipublikasikan",
    "data": { ... }
  }
  ```

---

## 7. Mendapatkan Daftar Pelamar (Applicants)
Melihat daftar mahasiswa yang melamar ke perusahaan dari *user* HR yang sedang *login*.

* **URL:** `/applicants`
* **Method:** `GET`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "uid": "uuid-lamaran",
        "snapshot_cv_url": "...",
        "status": "IN_PROGRESS",
        "mahasiswa": { ... },
        "recruitment_positions": { ... }
      }
    ]
  }
  ```

---

## 8. Mengubah Tahap/Status Pelamar
Digunakan oleh HR untuk menaikkan tahap seleksi kandidat atau mengubah status akhir lamaran (`IN_PROGRESS`, `HIRED`, `REJECTED`).

* **URL:** `/applicants/:id/stage`
* **Method:** `PATCH`
* **URL Params:** `id=[UUID_LAMARAN]`
* **Body Request (JSON):**
  ```json
  {
    "stage_id": "uuid-tahapan-selanjutnya",
    "result_status": "HIRED" 
  }
  ```
  *(Catatan: `result_status` bersifat opsional, hanya dikirim jika kandidat sudah final diterima/ditolak).*
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Tahapan seleksi pelamar berhasil diperbarui",
    "data": { ... }
  }
  ```

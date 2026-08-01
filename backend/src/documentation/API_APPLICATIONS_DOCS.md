# Dokumentasi API - Modul Applications (Lamaran Pekerjaan)

Base URL: `http://localhost:5000/api/v1/applications`

---

## 1. Mendaftar / Mengirim Lamaran (POST)
Digunakan (biasanya oleh Mahasiswa/Alumni) untuk melamar pada salah satu posisi lowongan pekerjaan yang tersedia.

* **URL:** `/`
* **Method:** `POST`
* **Body Request (JSON):**
  ```json
  {
    "position_id": "uuid-dari-recruitment-positions",
    "mahasiswa_id": "uuid-dari-mahasiswa",
    "snapshot_cv_url": "https://storage.domain/cv/dimas_terbaru.pdf"
  }
  ```
* **Response Sukses (201 Created):**
  ```json
  {
    "success": true,
    "message": "Berhasil melamar pekerjaan",
    "data": {
      "uid": "uuid-application",
      "position_id": "...",
      "mahasiswa_id": "...",
      "snapshot_cv_url": "...",
      "status": "IN_PROGRESS",
      "created_at": "2026-08-01T10:00:00Z"
    }
  }
  ```

---

## 2. Mendapatkan Semua Data Lamaran (GET All)
Digunakan (biasanya oleh Admin BKK) untuk melihat daftar semua lamaran yang masuk ke sistem. API ini telah diatur (join) untuk otomatis menampilkan detail pelamar (mahasiswa) dan lowongan (posisi).

* **URL:** `/`
* **Method:** `GET`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "uid": "uuid-application",
        "snapshot_cv_url": "https://...",
        "status": "IN_PROGRESS",
        "hired_at": null,
        "mahasiswa": {
          "uid": "...",
          "nim": "10111222",
          "jurusan": "Teknik Informatika",
          "profiles": {
            "nama": "Dimas",
            "email": "dimas@email.com"
          }
        },
        "position": {
          "uid": "...",
          "posisi": "Frontend Developer",
          "recruitment": {
            "judul_pengumuman": "Dicari Frontend Developer",
            "perusahaan": {
              "nama_perusahaan": "PT Teknologi Maju"
            }
          }
        }
      }
    ]
  }
  ```

---

## 3. Mendapatkan Detail Satu Lamaran (GET by ID)
Mendapatkan detail secara spesifik atas satu berkas lamaran masuk.

* **URL:** `/:id`
* **Method:** `GET`
* **URL Params:** `id=[UUID_APPLICATION]`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": {
       // ... format sama persis dengan item di GET All
    }
  }
  ```

---

## 4. Mengupdate Status Lamaran (PUT)
Jika status pelamar diubah menjadi `HIRED`, maka backend akan secara cerdas memicu otomatis pengisian *timestamp* pada kolom `hired_at` dengan waktu saat ini.
*(Catatan: Ini adalah Endpoint umum. Untuk sisi HRD perusahaan, biasanya mereka mengubah status pelamar dari Modul Company via `PATCH /api/v1/companies/applicants/:id/status`)*

* **URL:** `/:id`
* **Method:** `PUT`
* **URL Params:** `id=[UUID_APPLICATION]`
* **Body Request (JSON):**
  ```json
  {
    "status": "HIRED"
  }
  ```
  *(Status yang diizinkan sesuai ENUM: `IN_PROGRESS`, `HIRED`, `REJECTED`)*
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Data lamaran berhasil diperbarui",
    "data": {
      "uid": "uuid-application",
      "status": "HIRED",
      "hired_at": "2026-08-01T10:00:00Z"
    }
  }
  ```

---

## 5. Menghapus Data Lamaran (DELETE)
Digunakan (biasanya oleh Mahasiswa) untuk menarik kembali atau membatalkan lamaran mereka.

* **URL:** `/:id`
* **Method:** `DELETE`
* **URL Params:** `id=[UUID_APPLICATION]`
* **Response Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Data lamaran berhasil dihapus",
    "data": {
       "uid": "uuid-application"
    }
  }
  ```

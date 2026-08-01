CREATE TABLE level (
  uid VARCHAR(36) NOT NULL DEFAULT (UUID()),
  role VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  level BIGINT,
  CONSTRAINT level_pkey PRIMARY KEY (uid)
);

CREATE TABLE users (
  uid VARCHAR(36) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  level_id VARCHAR(36) NOT NULL,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (uid),
  CONSTRAINT users_level_id_fkey FOREIGN KEY (level_id) REFERENCES level(uid)
);

CREATE TABLE admin (
  uid VARCHAR(36) NOT NULL DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL UNIQUE,
  nip VARCHAR(255),
  jabatan VARCHAR(255) DEFAULT 'Staf BKK',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT admin_pkey PRIMARY KEY (uid),
  CONSTRAINT admin_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(uid)
);

CREATE TABLE campus (
  uid VARCHAR(36) NOT NULL DEFAULT (UUID()),
  nama_campus VARCHAR(255) NOT NULL,
  akreditasi VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT campus_pkey PRIMARY KEY (uid)
);

CREATE TABLE mahasiswa (
  uid VARCHAR(36) NOT NULL DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL UNIQUE,
  campus_id VARCHAR(36) NOT NULL,
  nim VARCHAR(255),
  jurusan VARCHAR(255),
  tahun_lulus INT,
  current_cv_url TEXT,
  is_employed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT mahasiswa_pkey PRIMARY KEY (uid),
  CONSTRAINT mahasiswa_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(uid),
  CONSTRAINT mahasiswa_campus_id_fkey FOREIGN KEY (campus_id) REFERENCES campus(uid)
);

CREATE TABLE perusahaan (
  uid VARCHAR(36) NOT NULL DEFAULT (UUID()),
  nama_perusahaan VARCHAR(255) NOT NULL,
  alamat TEXT,
  email VARCHAR(255),
  telepon VARCHAR(255),
  nib_npwp VARCHAR(255),
  legal_doc_url TEXT,
  status_verifikasi VARCHAR(50) DEFAULT 'PENDING',
  verified_by VARCHAR(36),
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT perusahaan_pkey PRIMARY KEY (uid),
  CONSTRAINT perusahaan_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES users(uid)
);

CREATE TABLE hr (
  uid VARCHAR(36) NOT NULL DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL UNIQUE,
  perusahaan_id VARCHAR(36) NOT NULL,
  jabatan VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT hr_pkey PRIMARY KEY (uid),
  CONSTRAINT hr_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(uid),
  CONSTRAINT hr_perusahaan_id_fkey FOREIGN KEY (perusahaan_id) REFERENCES perusahaan(uid)
);

CREATE TABLE recruitment (
  uid VARCHAR(36) NOT NULL DEFAULT (UUID()),
  perusahaan_id VARCHAR(36) NOT NULL,
  judul_pengumuman VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  lokasi_kerja VARCHAR(255),
  tanggal_buka DATE DEFAULT (CURRENT_DATE),
  tanggal_tutup DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status VARCHAR(255),
  CONSTRAINT recruitment_pkey PRIMARY KEY (uid),
  CONSTRAINT recruitment_perusahaan_id_fkey FOREIGN KEY (perusahaan_id) REFERENCES perusahaan(uid)
);

CREATE TABLE recruitment_positions (
  uid VARCHAR(36) NOT NULL DEFAULT (UUID()),
  recruitment_id VARCHAR(36) NOT NULL,
  posisi VARCHAR(255) NOT NULL,
  kuota_posisi INT NOT NULL DEFAULT 1,
  bidang_industri VARCHAR(255) NOT NULL,
  persyaratan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT recruitment_positions_pkey PRIMARY KEY (uid),
  CONSTRAINT recruitment_positions_recruitment_id_fkey FOREIGN KEY (recruitment_id) REFERENCES recruitment(uid)
);

CREATE TABLE applications (
  uid VARCHAR(36) NOT NULL DEFAULT (UUID()),
  position_id VARCHAR(36) NOT NULL,
  mahasiswa_id VARCHAR(36) NOT NULL,
  snapshot_cv_url TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'IN_PROGRESS',
  hired_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT applications_pkey PRIMARY KEY (uid),
  CONSTRAINT applications_position_id_fkey FOREIGN KEY (position_id) REFERENCES recruitment_positions(uid),
  CONSTRAINT applications_mahasiswa_id_fkey FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(uid)
);
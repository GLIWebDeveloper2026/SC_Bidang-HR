const db = require('../config/db');
const crypto = require('crypto');

class CompanyRepository {
   
  async findAllCompanies(filterStatus = null) {
    let query = `
      SELECT 
        c.uid, 
        c.nama_perusahaan, 
        c.alamat, 
        c.email, 
        c.telepon, 
        c.status_verifikasi, 
        c.legal_doc_url, 
        c.nib_npwp, 
        c.created_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'nama', u.nama,
            'email', u.email,
            'jabatan', hr.jabatan
          )
        ) as hr_list
      FROM companies c
      LEFT JOIN master_user_hr hr ON c.uid = hr.perusahaan_id
      LEFT JOIN users u ON hr.user_id = u.uid
    `;

    const params = [];
    if (filterStatus) {
      query += ` WHERE c.status_verifikasi = ?`;
      params.push(filterStatus);
    }

    query += ` GROUP BY c.uid ORDER BY c.created_at DESC`;

    const [rows] = await db.query(query, params);
    
    // Konversi hasil JSON agar serupa dengan struktur Supabase jika diperlukan
    return rows.map(row => {
      // Dalam MySQL, hr_list mungkin berisi [null] jika tidak ada HR
      let parsedHr = [];
      try {
        parsedHr = typeof row.hr_list === 'string' ? JSON.parse(row.hr_list) : row.hr_list;
        if (parsedHr.length === 1 && parsedHr[0].nama === null) {
          parsedHr = [];
        }
      } catch (e) {}

      return {
        uid: row.uid,
        nama_perusahaan: row.nama_perusahaan,
        alamat: row.alamat,
        email: row.email,
        telepon: row.telepon,
        status_verifikasi: row.status_verifikasi,
        legal_doc_url: row.legal_doc_url,
        nib_npwp: row.nib_npwp,
        created_at: row.created_at,
        hr: parsedHr.map(h => ({ profiles: { nama: h.nama, email: h.email } }))
      };
    });
  }

  async findCompanyById(companyId) {
    const query = `
      SELECT 
        uid, 
        nama_perusahaan, 
        alamat, 
        email, 
        telepon, 
        status_verifikasi 
      FROM companies 
      WHERE uid = ?
    `;
    const [rows] = await db.query(query, [companyId]);
    if (rows.length === 0) return null;

    const company = rows[0];

    // Ambil data recruitment beserta positions
    const recQuery = `
      SELECT 
        r.uid, 
        r.judul_pengumuman, 
        r.deskripsi, 
        r.lokasi_kerja, 
        r.tanggal_tutup,
        rp.uid as pos_uid,
        rp.posisi,
        rp.kuota_posisi,
        rp.bidang_industri
      FROM recruitments r
      LEFT JOIN recruitment_positions rp ON r.uid = rp.recruitment_id
      WHERE r.perusahaan_id = ?
    `;
    const [recRows] = await db.query(recQuery, [companyId]);

    // Grouping recruitment dan positions
    const recruitmentsMap = {};
    for (const row of recRows) {
      if (!recruitmentsMap[row.uid]) {
        recruitmentsMap[row.uid] = {
          uid: row.uid,
          judul_pengumuman: row.judul_pengumuman,
          deskripsi: row.deskripsi,
          lokasi_kerja: row.lokasi_kerja,
          tanggal_tutup: row.tanggal_tutup,
          recruitment_positions: []
        };
      }
      if (row.pos_uid) {
        recruitmentsMap[row.uid].recruitment_positions.push({
          uid: row.pos_uid,
          posisi: row.posisi,
          kuota_posisi: row.kuota_posisi,
          bidang_industri: row.bidang_industri
        });
      }
    }

    company.recruitment = Object.values(recruitmentsMap);
    return company;
  }

  async createCompanyWithHR(userId, companyData) {
    const { nama_perusahaan, alamat, email, telepon, nib_npwp, legal_doc_url, jabatan } = companyData;
    const companyUid = crypto.randomUUID();
    const hrUid = crypto.randomUUID();

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert ke tabel companies
      const insertCompanyQuery = `
        INSERT INTO companies (uid, nama_perusahaan, alamat, email, telepon, nib_npwp, legal_doc_url, status_verifikasi)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
      `;
      await connection.query(insertCompanyQuery, [
        companyUid, nama_perusahaan, alamat, email, telepon, nib_npwp, legal_doc_url
      ]);

      // 2. Insert ke master_user_hr
      const insertHrQuery = `
        INSERT INTO master_user_hr (uid, user_id, perusahaan_id, jabatan)
        VALUES (?, ?, ?, ?)
      `;
      await connection.query(insertHrQuery, [
        hrUid, userId, companyUid, jabatan || 'HRD'
      ]);

      await connection.commit();

      return { uid: companyUid, nama_perusahaan, alamat, email, telepon, nib_npwp, legal_doc_url, status_verifikasi: 'PENDING' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findCompanyByProfileId(userId) {
    const query = `
      SELECT c.uid, c.nama_perusahaan, c.alamat, c.email, c.telepon, c.status_verifikasi
      FROM master_user_hr hr
      JOIN companies c ON hr.perusahaan_id = c.uid
      WHERE hr.user_id = ?
    `;
    const [rows] = await db.query(query, [userId]);
    if (rows.length === 0) return null;
    return rows[0];
  }

  async createRecruitment(perusahaanId, userId, jobData) {
    const { judul_pengumuman, deskripsi, lokasi_kerja, tanggal_tutup, positions } = jobData;
    const recruitmentUid = crypto.randomUUID();

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const insertRecQuery = `
        INSERT INTO recruitments (uid, perusahaan_id, judul_pengumuman, deskripsi, lokasi_kerja, tanggal_tutup, status)
        VALUES (?, ?, ?, ?, ?, ?, 'OPEN')
      `;
      await connection.query(insertRecQuery, [
        recruitmentUid, perusahaanId, judul_pengumuman, deskripsi, lokasi_kerja, tanggal_tutup
      ]);

      if (positions && positions.length > 0) {
        const insertPosQuery = `
          INSERT INTO recruitment_positions (uid, recruitment_id, posisi, kuota_posisi, bidang_industri, persyaratan)
          VALUES ?
        `;
        const posValues = positions.map(pos => [
          crypto.randomUUID(), recruitmentUid, pos.posisi, pos.kuota_posisi, pos.bidang_industri, pos.persyaratan || null
        ]);
        
        await connection.query(insertPosQuery, [posValues]);
      }

      await connection.commit();
      return { uid: recruitmentUid, perusahaan_id: perusahaanId, judul_pengumuman };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findApplicantsByCompany(perusahaanId) {
    const query = `
      SELECT 
        a.uid as application_id, 
        a.snapshot_cv_url, 
        a.status, 
        a.created_at,
        m.uid as mahasiswa_id, 
        m.nim, 
        m.jurusan, 
        m.tahun_lulus,
        u.nama, 
        u.email,
        rp.posisi, 
        rp.bidang_industri,
        r.uid as recruitment_id, 
        r.judul_pengumuman
      FROM applications a
      JOIN master_user_student m ON a.mahasiswa_id = m.uid
      JOIN users u ON m.user_id = u.uid
      JOIN recruitment_positions rp ON a.position_id = rp.uid
      JOIN recruitments r ON rp.recruitment_id = r.uid
      WHERE r.perusahaan_id = ?
      ORDER BY a.created_at DESC
    `;
    const [rows] = await db.query(query, [perusahaanId]);

    return rows.map(row => ({
      uid: row.application_id,
      snapshot_cv_url: row.snapshot_cv_url,
      status: row.status,
      created_at: row.created_at,
      mahasiswa: {
        uid: row.mahasiswa_id,
        nim: row.nim,
        jurusan: row.jurusan,
        tahun_lulus: row.tahun_lulus,
        profiles: { nama: row.nama, email: row.email }
      },
      recruitment_positions: {
        posisi: row.posisi,
        bidang_industri: row.bidang_industri,
        recruitment: {
          uid: row.recruitment_id,
          judul_pengumuman: row.judul_pengumuman,
          perusahaan_id: perusahaanId
        }
      }
    }));
  }

  async updateApplicationStatus(applicationId, resultStatus) {
    let query = `UPDATE applications SET status = ?`;
    const params = [resultStatus];

    if (resultStatus === 'HIRED') {
      query += `, hired_at = CURRENT_TIMESTAMP`;
    }
    
    query += ` WHERE uid = ?`;
    params.push(applicationId);

    const [result] = await db.query(query, params);
    return result;
  }

  async updateCompany(companyId, payload) {
    const fields = [];
    const params = [];
    for (const [key, value] of Object.entries(payload)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    
    if (fields.length === 0) return null;
    
    params.push(companyId);
    const query = `UPDATE companies SET ${fields.join(', ')} WHERE uid = ?`;
    await db.query(query, params);
    
    const [rows] = await db.query(`SELECT * FROM companies WHERE uid = ?`, [companyId]);
    return rows[0];
  }

  async deleteCompany(companyId) {
    const [result] = await db.query(`DELETE FROM companies WHERE uid = ?`, [companyId]);
    return result;
  }
}

module.exports = new CompanyRepository();
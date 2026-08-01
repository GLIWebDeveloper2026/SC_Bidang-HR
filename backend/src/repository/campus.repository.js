const db = require('../config/db'); // path ke config mysql2 pool kamu
const { v4: uuidv4 } = require('uuid');

class CampusRepository {
  // 1. Ambil Semua Campus (Diurutkan dari yang terbaru)
  async findAllCampus() {
    const query = `
      SELECT uid, nama_campus, akreditasi, created_at, updated_at 
      FROM campus 
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  }

  // 2. Ambil Campus Berdasarkan UID
  async findCampusById(id) {
    const query = `
      SELECT uid, nama_campus, akreditasi, created_at, updated_at 
      FROM campus 
      WHERE uid = ?
    `;
    const [rows] = await db.query(query, [id]);
    
    if (rows.length === 0) return null;
    return rows[0];
  }

  // 3. Tambah Campus Baru
  async createCampus(payload) {
    const { nama_campus, akreditasi } = payload;
    const uid = payload.uid || uuidv4();

    const query = `
      INSERT INTO campus (uid, nama_campus, akreditasi) 
      VALUES (?, ?, ?)
    `;
    
    await db.query(query, [uid, nama_campus, akreditasi || null]);
    
    return this.findCampusById(uid);
  }

  // 4. Update Data Campus
  async updateCampus(id, payload) {
    const { nama_campus, akreditasi } = payload;

    const query = `
      UPDATE campus 
      SET nama_campus = COALESCE(?, nama_campus), 
          akreditasi = COALESCE(?, akreditasi), 
          updated_at = CURRENT_TIMESTAMP 
      WHERE uid = ?
    `;
    
    const [result] = await db.query(query, [nama_campus, akreditasi, id]);

    if (result.affectedRows === 0) return null;

    return this.findCampusById(id);
  }

  // 5. Delete Campus
  async deleteCampus(id) {
    const campusData = await this.findCampusById(id);
    if (!campusData) return null;

    const query = `DELETE FROM campus WHERE uid = ?`;
    await db.query(query, [id]);

    return campusData;
  }
}

module.exports = new CampusRepository();
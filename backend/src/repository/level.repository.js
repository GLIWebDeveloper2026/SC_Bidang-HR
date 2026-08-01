const db = require('../config/database'); // path ke config mysql2 pool kamu
const { v4: uuidv4 } = require('uuid');

class LevelRepository {
  // 1. Ambil Semua Level
  async findAllLevels() {
    const query = `
      SELECT uid, role, level, created_at, updated_at 
      FROM level 
      ORDER BY created_at ASC
    `;
    const [rows] = await db.query(query);
    return rows;
  }

  // 2. Ambil Level berdasarkan ID (UID)
  async findLevelById(id) {
    const query = `
      SELECT uid, role, level, created_at, updated_at 
      FROM level 
      WHERE uid = ?
    `;
    const [rows] = await db.query(query, [id]);
    
    if (rows.length === 0) return null;
    return rows[0];
  }

  // 3. Tambah Level Baru
  async createLevel(payload) {
    const { role, level } = payload;
    const uid = payload.uid || uuidv4(); // Generate UUID jika tidak dikirim di payload

    const query = `
      INSERT INTO level (uid, role, level) 
      VALUES (?, ?, ?)
    `;
    
    await db.query(query, [uid, role, level]);
    
    // Kembalikan data yang baru dimasukkan
    return this.findLevelById(uid);
  }

  // 4. Update Level
  async updateLevel(id, payload) {
    const { role, level } = payload;

    const query = `
      UPDATE level 
      SET role = COALESCE(?, role), 
          level = COALESCE(?, level), 
          updated_at = CURRENT_TIMESTAMP 
      WHERE uid = ?
    `;
    
    const [result] = await db.query(query, [role, level, id]);

    if (result.affectedRows === 0) return null;

    return this.findLevelById(id);
  }

  // 5. Delete Level
  async deleteLevel(id) {
    // Ambil data sebelum dihapus untuk dikembalikan sebagai response
    const levelData = await this.findLevelById(id);
    if (!levelData) return null;

    const query = `DELETE FROM level WHERE uid = ?`;
    await db.query(query, [id]);

    return levelData;
  }
}

module.exports = new LevelRepository();
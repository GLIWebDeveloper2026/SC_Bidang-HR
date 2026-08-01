const db = require('../config/db');

class AuthRepository {
  async createUser(payload) {
    const query = `
      INSERT INTO users (uid, nama, email, password, level_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      payload.uid, payload.nama, payload.email, payload.password, payload.level_id, payload.status
    ]);
    return result;
  }

  async getUserByEmail(email) {
    const query = `
      SELECT u.*, l.role, l.level 
      FROM users u 
      LEFT JOIN level l ON u.level_id = l.uid 
      WHERE u.email = ?
    `;
    const [rows] = await db.query(query, [email]);
    return rows[0]; // mengembalikan undefined jika tidak ada
  }

  async getLevelByName(roleName) {
    const query = `SELECT uid FROM level WHERE role = ? LIMIT 1`;
    const [rows] = await db.query(query, [roleName]);
    return rows[0];
  }

  async createLevel(payload) {
    const query = `INSERT INTO level (uid, role, level) VALUES (?, ?, ?)`;
    const [result] = await db.query(query, [payload.uid, payload.role, payload.level]);
    return result;
  }
}

module.exports = new AuthRepository();

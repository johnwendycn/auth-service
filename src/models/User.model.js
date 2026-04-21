// MODEL: database queries only. No business logic.
const { pool } = require('../config/database');

module.exports = {
  async create({ email, password_hash, full_name, email_verification_token, email_verification_expires }) {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, email_verification_token, email_verification_expires, is_email_verified, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [email, password_hash, full_name, email_verification_token, email_verification_expires, false, true]
    );
    return result.rows[0].id;
  },

  async findByEmail(email) {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [id]);
    return result.rows[0] || null;
  },

  async findByVerificationToken(token) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email_verification_token = $1 LIMIT 1`, [token]
    );
    return result.rows[0] || null;
  },

  async findByResetToken(token) {
    const result = await pool.query(
      `SELECT * FROM users WHERE password_reset_token = $1 LIMIT 1`, [token]
    );
    return result.rows[0] || null;
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return 0;
    
    // Build dynamic UPDATE query for PostgreSQL
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = keys.map(key => fields[key]);
    values.push(id);
    
    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $${values.length} RETURNING id`,
      values
    );
    return result.rowCount || 0;
  },

  async delete(id) {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    return result.rowCount || 0;
  },

  async list({ limit = 20, offset = 0 }) {
    const rows = await pool.query(
      `SELECT id, email, full_name, is_email_verified, is_active, last_login_at, created_at
       FROM users ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const totalResult = await pool.query(`SELECT COUNT(*) AS total FROM users`);
    const total = parseInt(totalResult.rows[0].total);
    
    return { rows: rows.rows, total };
  },
};
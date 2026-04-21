// MODEL: database queries only. No business logic.
const { pool } = require('../config/database');

module.exports = {
  async create({ email, password_hash, full_name, email_verification_token, email_verification_expires }) {
    const [r] = await pool.execute(
      `INSERT INTO users (email, password_hash, full_name, email_verification_token, email_verification_expires)
       VALUES (:email, :password_hash, :full_name, :token, :expires)`,
      { email, password_hash, full_name, token: email_verification_token, expires: email_verification_expires }
    );
    return r.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.execute(`SELECT * FROM users WHERE email = :email LIMIT 1`, { email });
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.execute(`SELECT * FROM users WHERE id = :id LIMIT 1`, { id });
    return rows[0] || null;
  },

  async findByVerificationToken(token) {
    const [rows] = await pool.execute(
      `SELECT * FROM users WHERE email_verification_token = :token LIMIT 1`, { token });
    return rows[0] || null;
  },

  async findByResetToken(token) {
    const [rows] = await pool.execute(
      `SELECT * FROM users WHERE password_reset_token = :token LIMIT 1`, { token });
    return rows[0] || null;
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return 0;
    const set = keys.map(k => `${k} = :${k}`).join(', ');
    const [r] = await pool.execute(`UPDATE users SET ${set} WHERE id = :id`, { ...fields, id });
    return r.affectedRows;
  },

  async delete(id) {
    const [r] = await pool.execute(`DELETE FROM users WHERE id = :id`, { id });
    return r.affectedRows;
  },

  async list({ limit = 20, offset = 0 }) {
    const [rows] = await pool.query(
      `SELECT id, email, full_name, is_email_verified, is_active, last_login_at, created_at
       FROM users ORDER BY id DESC LIMIT ? OFFSET ?`, [limit, offset]);
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM users`);
    return { rows, total };
  },
};

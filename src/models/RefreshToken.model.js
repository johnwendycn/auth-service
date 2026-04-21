// MODEL: database queries only.
const { pool } = require('../config/database');

module.exports = {
  async create({ user_id, token, expires_at }) {
    const [r] = await pool.execute(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)`,
      { user_id, token, expires_at });
    return r.insertId;
  },

  async findByToken(token) {
    const [rows] = await pool.execute(
      `SELECT * FROM refresh_tokens WHERE token = :token LIMIT 1`, { token });
    return rows[0] || null;
  },

  async revoke(token) {
    const [r] = await pool.execute(
      `UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token = :token AND revoked_at IS NULL`,
      { token });
    return r.affectedRows;
  },

  async revokeAllForUser(user_id) {
    const [r] = await pool.execute(
      `UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = :user_id AND revoked_at IS NULL`,
      { user_id });
    return r.affectedRows;
  },

  async delete(token) {
    const [r] = await pool.execute(`DELETE FROM refresh_tokens WHERE token = :token`, { token });
    return r.affectedRows;
  },
};

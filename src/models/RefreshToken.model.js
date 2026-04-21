// MODEL: database queries only.
const { pool } = require('../config/database');

module.exports = {
  async create({ user_id, token, expires_at }) {
    const result = await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [user_id, token, expires_at]
    );
    return result.rows[0].id;
  },

  async findByToken(token) {
    const result = await pool.query(
      `SELECT * FROM refresh_tokens WHERE token = $1 LIMIT 1`,
      [token]
    );
    return result.rows[0] || null;
  },

  async revoke(token) {
    const result = await pool.query(
      `UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP 
       WHERE token = $1 AND revoked_at IS NULL
       RETURNING id`,
      [token]
    );
    return result.rowCount;
  },

  async revokeAllForUser(user_id) {
    const result = await pool.query(
      `UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [user_id]
    );
    return result.rowCount;
  },

  async delete(token) {
    const result = await pool.query(
      `DELETE FROM refresh_tokens WHERE token = $1`,
      [token]
    );
    return result.rowCount;
  },
};
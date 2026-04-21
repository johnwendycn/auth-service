// MODEL: database queries only.
const { pool } = require('../config/database');

module.exports = {
  async add({ jti, expires_at }) {
    const result = await pool.query(
      `INSERT INTO token_blacklist (jti, expires_at)
       VALUES ($1, $2)
       ON CONFLICT (jti) DO NOTHING`,
      [jti, expires_at]
    );
    return result.rowCount;
  },

  async isBlacklisted(jti) {
    const result = await pool.query(
      `SELECT 1 FROM token_blacklist WHERE jti = $1 LIMIT 1`,
      [jti]
    );
    return result.rows.length > 0;
  },

  async cleanup() {
    const result = await pool.query(
      `DELETE FROM token_blacklist WHERE expires_at < CURRENT_TIMESTAMP`
    );
    return result.rowCount;
  },
};
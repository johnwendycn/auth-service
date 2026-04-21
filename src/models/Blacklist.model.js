// MODEL: database queries only.
const { pool } = require('../config/database');

module.exports = {
  async add({ jti, expires_at }) {
    await pool.execute(
      `INSERT IGNORE INTO token_blacklist (jti, expires_at) VALUES (:jti, :expires_at)`,
      { jti, expires_at });
  },

  async isBlacklisted(jti) {
    const [rows] = await pool.execute(
      `SELECT 1 FROM token_blacklist WHERE jti = :jti LIMIT 1`, { jti });
    return rows.length > 0;
  },

  async cleanup() {
    const [r] = await pool.execute(`DELETE FROM token_blacklist WHERE expires_at < CURRENT_TIMESTAMP`);
    return r.affectedRows;
  },
};

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  // Always enable SSL for Render (both development and production)
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    console.error('💡 Make sure you are using the external URL or have SSL enabled');
  } else {
    console.log('✅ PostgreSQL connected successfully to Render');
    release();
  }
});

module.exports = { pool };
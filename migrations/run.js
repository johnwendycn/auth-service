require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });
  const sql = fs.readFileSync(path.join(__dirname, '001_init.sql'), 'utf8');
  await conn.query(sql);
  console.log('Migration applied.');
  await conn.end();
})().catch(e => { console.error(e); process.exit(1); });

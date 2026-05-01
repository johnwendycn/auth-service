require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  console.log('🔍 Checking Render database...\n');
  
  try {
    const tables = ['users', 'features', 'significants', 'blacklisted_tokens'];
    
    for (const table of tables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        ) as exists
      `, [table]);
      
      const exists = result.rows[0].exists;
      console.log(`${exists ? '✅' : '❌'} Table '${table}': ${exists ? 'exists' : 'missing'}`);
      
      if (exists) {
        const count = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`   📊 Records: ${count.rows[0].count}`);
        
        // Get column info
        const columns = await pool.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
          ORDER BY ordinal_position
        `, [table]);
        
        console.log(`   📋 Columns: ${columns.rows.map(c => c.column_name).join(', ')}`);
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
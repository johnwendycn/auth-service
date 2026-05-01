require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function createTables() {
  console.log('🚀 Creating database tables...\n');

  try {
    // Drop existing tables to start fresh (optional - comment out if you want to keep data)
    // await pool.query('DROP TABLE IF EXISTS significants CASCADE');
    // await pool.query('DROP TABLE IF EXISTS features CASCADE');
    // console.log('✅ Dropped existing tables');

    // Create features table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS features (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(500),
        thumbnail_url VARCHAR(500),
        category VARCHAR(100),
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Features table created');

    // Create significants table with proper defaults
    await pool.query(`
      CREATE TABLE IF NOT EXISTS significants (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(500),
        thumbnail_url VARCHAR(500),
        icon_url VARCHAR(500),
        highlight_text VARCHAR(255),
        priority INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Significants table created');

    // Clear existing data (optional)
    await pool.query('TRUNCATE features RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE significants RESTART IDENTITY CASCADE');
    console.log('✅ Cleared existing data');

    // Insert sample features with explicit timestamps
    await pool.query(`
      INSERT INTO features (title, description, image_url, category, order_index, is_active, created_at, updated_at)
      VALUES 
        ('Seamless Integration', 'Integrate with your favorite tools in seconds.', 'https://picsum.photos/300/200', 'integration', 1, true, NOW(), NOW()),
        ('Enterprise Security', 'Bank-grade security for your business data.', 'https://picsum.photos/300/201', 'security', 2, true, NOW(), NOW()),
        ('Real-time Analytics', 'Get insights instantly with real-time data processing.', 'https://picsum.photos/300/202', 'analytics', 3, true, NOW(), NOW())
    `);
    console.log('✅ Sample features inserted');

    // Insert sample significants with explicit timestamps
    await pool.query(`
      INSERT INTO significants (title, description, image_url, highlight_text, priority, is_active, created_at, updated_at)
      VALUES 
        ('Award-Winning Platform', 'Recognized as best in class 2026', 'https://picsum.photos/300/203', 'WINNER', 10, true, NOW(), NOW()),
        ('1M+ Users', 'Trusted by over one million users worldwide', 'https://picsum.photos/300/204', 'MILESTONE', 9, true, NOW(), NOW()),
        ('24/7 Support', 'Round-the-clock customer support', 'https://picsum.photos/300/205', 'AVAILABLE', 8, true, NOW(), NOW())
    `);
    console.log('✅ Sample significants inserted');

    // Verify tables
    const featuresCount = await pool.query('SELECT COUNT(*) FROM features');
    const significantsCount = await pool.query('SELECT COUNT(*) FROM significants');
    
    console.log(`\n📊 Features count: ${featuresCount.rows[0].count}`);
    console.log(`📊 Significants count: ${significantsCount.rows[0].count}`);
    
    // Show sample data
    const features = await pool.query('SELECT id, title, category FROM features LIMIT 3');
    console.log('\n📋 Sample features:');
    features.rows.forEach(f => {
      console.log(`   - ID: ${f.id} | ${f.title} | ${f.category}`);
    });
    
    const significants = await pool.query('SELECT id, title, priority FROM significants LIMIT 3');
    console.log('\n📋 Sample significants:');
    significants.rows.forEach(s => {
      console.log(`   - ID: ${s.id} | ${s.title} | Priority: ${s.priority}`);
    });
    
    console.log('\n🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createTables();
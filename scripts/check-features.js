require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkFeatures() {
  try {
    // Check if features table exists and has data
    const result = await pool.query(`
      SELECT COUNT(*) as count FROM features
    `);
    
    console.log(`📊 Total features in database: ${result.rows[0].count}`);
    
    if (parseInt(result.rows[0].count) === 0) {
      console.log('\n⚠️ No features found. Adding sample data...');
      
      // Insert sample features with explicit timestamps
      await pool.query(`
        INSERT INTO features (title, description, image_url, thumbnail_url, category, order_index, is_active, created_at, updated_at)
        VALUES 
          ('Seamless Integration', 'Integrate with your favorite tools in seconds.', 'https://example.com/integration.jpg', 'https://example.com/integration-thumb.jpg', 'integration', 1, true, NOW(), NOW()),
          ('Enterprise Security', 'Bank-grade security for your business data.', 'https://example.com/security.jpg', 'https://example.com/security-thumb.jpg', 'security', 2, true, NOW(), NOW()),
          ('Real-time Analytics', 'Get insights instantly with real-time data processing.', 'https://example.com/analytics.jpg', 'https://example.com/analytics-thumb.jpg', 'analytics', 3, true, NOW(), NOW())
      `);
      
      console.log('✅ Sample features added!');
    }
    
    // List all features
    const features = await pool.query(`
      SELECT id, title, category, is_active, created_at FROM features ORDER BY id
    `);
    
    console.log('\n📋 Features in database:');
    features.rows.forEach(feature => {
      console.log(`   ID: ${feature.id} | Title: ${feature.title} | Category: ${feature.category} | Active: ${feature.is_active}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Tip: Make sure your table has the correct structure.');
  } finally {
    await pool.end();
  }
}

checkFeatures();
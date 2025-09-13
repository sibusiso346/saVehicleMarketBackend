const { Pool } = require('pg');

// Test with the corrected configuration
const config = {
  host: 'localhost',
  port: 5432,
  database: 'postgres', // Connect to default database first
  user: 'postgres',
  password: 'sam346.COM#', // Password with quotes in code
  ssl: false
};

async function testConnection() {
  console.log('🔍 Testing with corrected configuration...');
  console.log('Host:', config.host);
  console.log('Port:', config.port);
  console.log('Database:', config.database);
  console.log('User:', config.user);
  console.log('Password:', 'sam346.COM#');

  const pool = new Pool(config);

  try {
    const result = await pool.query('SELECT version()');
    console.log('✅ Connection successful!');
    console.log('PostgreSQL version:', result.rows[0].version);
    
    // Try to create our database
    console.log('\n📝 Creating sa_vehicle_db database...');
    await pool.query('CREATE DATABASE sa_vehicle_db');
    console.log('✅ Database created successfully!');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Database already exists!');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await pool.end();
  }
}

testConnection();

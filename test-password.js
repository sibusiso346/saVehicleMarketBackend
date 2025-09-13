require('dotenv').config();

console.log('🔍 Environment Variables Debug:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'undefined');

// Test database connection
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false
});

pool.query('SELECT version()')
  .then(result => {
    console.log('✅ Database connection successful!');
    console.log('PostgreSQL version:', result.rows[0].version);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  });

// Test with different password formats
const passwords = [
  'sam346.COM#',
  '"sam346.COM#"',
  "'sam346.COM#'",
  'sam346.COM\\#',
  'sam346.COM'
];

console.log('\n🧪 Testing different password formats:');
passwords.forEach((pwd, index) => {
  console.log(`${index + 1}. "${pwd}" (length: ${pwd.length})`);
});

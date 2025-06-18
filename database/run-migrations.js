
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'run_tasov',
  multipleStatements: true
};

async function runMigrations() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('Connected to MySQL database');

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database}`);
    await connection.execute(`USE ${DB_CONFIG.database}`);

    // Read migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(file => file.endsWith('.sql')).sort();

    // Execute each migration
    for (const file of sqlFiles) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf8');
      
      try {
        await connection.execute(sql);
        console.log(`✓ ${file} executed successfully`);
      } catch (error) {
        console.error(`✗ Error executing ${file}:`, error.message);
        throw error;
      }
    }

    console.log('All migrations completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };

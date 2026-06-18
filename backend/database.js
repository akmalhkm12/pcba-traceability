const { Pool } = require('pg');

// PostgreSQL connection pool
let pool = null;

// Initialize database connection
async function initDatabase() {
  // Get connection string from environment variable or use default
  const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres:H%40kim28837922@db.mgcmisttioxpmesnnzbr.supabase.co:5432/postgres';

  // Create connection pool
  pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Test connection
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }

  // Create tables (PostgreSQL syntax)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pcbas (
      id VARCHAR(255) PRIMARY KEY,
      serial_number VARCHAR(255) UNIQUE NOT NULL,
      board_type VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS assembly_records (
      id SERIAL PRIMARY KEY,
      pcba_id VARCHAR(255) NOT NULL,
      process_stage VARCHAR(255) NOT NULL,
      operator_name VARCHAR(255) NOT NULL,
      notes TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pcba_id) REFERENCES pcbas(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS test_records (
      id SERIAL PRIMARY KEY,
      pcba_id VARCHAR(255) NOT NULL,
      test_type VARCHAR(255) NOT NULL,
      test_result VARCHAR(50) NOT NULL,
      measured_value REAL,
      expected_value REAL,
      unit VARCHAR(50),
      operator_name VARCHAR(255) NOT NULL,
      notes TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pcba_id) REFERENCES pcbas(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS components (
      id SERIAL PRIMARY KEY,
      pcba_id VARCHAR(255) NOT NULL,
      component_name VARCHAR(255) NOT NULL,
      component_value VARCHAR(255),
      lot_code VARCHAR(255),
      supplier VARCHAR(255),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pcba_id) REFERENCES pcbas(id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables initialized successfully');
}

// Wrapper object with prepare method (maintains compatibility with existing code)
const dbWrapper = {
  prepare: function(sql) {
    return {
      run: async function(...params) {
        try {
          // Convert ? placeholders to $1, $2, etc. for PostgreSQL
          let paramIndex = 1;
          const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

          const result = await pool.query(pgSql, params);

          return {
            changes: result.rowCount,
            lastInsertRowid: result.rows[0]?.id || 0
          };
        } catch (error) {
          console.error('Database run error:', error);
          throw error;
        }
      },
      get: async function(...params) {
        try {
          // Convert ? placeholders to $1, $2, etc. for PostgreSQL
          let paramIndex = 1;
          const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

          const result = await pool.query(pgSql, params);
          return result.rows[0] || undefined;
        } catch (error) {
          console.error('Database get error:', error);
          throw error;
        }
      },
      all: async function(...params) {
        try {
          // Convert ? placeholders to $1, $2, etc. for PostgreSQL
          let paramIndex = 1;
          const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

          const result = await pool.query(pgSql, params);
          return result.rows;
        } catch (error) {
          console.error('Database all error:', error);
          throw error;
        }
      }
    };
  },

  isReady: function() {
    return pool !== null;
  }
};

module.exports = { dbWrapper, initDatabase };

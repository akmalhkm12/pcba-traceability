const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'pcba_traceability.db');
let db = null;
let SQL = null;

// Initialize database
async function initDatabase() {
  SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log('Loaded existing database');
  } else {
    db = new SQL.Database();
    console.log('Created new database');
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS pcbas (
      id TEXT PRIMARY KEY,
      serial_number TEXT UNIQUE NOT NULL,
      board_type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS assembly_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pcba_id TEXT NOT NULL,
      process_stage TEXT NOT NULL,
      operator_name TEXT NOT NULL,
      notes TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pcba_id) REFERENCES pcbas(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS test_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pcba_id TEXT NOT NULL,
      test_type TEXT NOT NULL,
      test_result TEXT NOT NULL,
      measured_value REAL,
      expected_value REAL,
      unit TEXT,
      operator_name TEXT NOT NULL,
      notes TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pcba_id) REFERENCES pcbas(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pcba_id TEXT NOT NULL,
      component_name TEXT NOT NULL,
      component_value TEXT,
      lot_code TEXT,
      supplier TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pcba_id) REFERENCES pcbas(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
  saveDatabase();
}

// Save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Wrapper object with prepare method
const dbWrapper = {
  prepare: function(sql) {
    return {
      run: async function(...params) {
        try {
          const stmt = db.prepare(sql);
          stmt.bind(params);
          stmt.step();
          stmt.free();

          saveDatabase();

          return {
            changes: db.getRowsModified(),
            lastInsertRowid: db.exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0] || 0
          };
        } catch (error) {
          throw error;
        }
      },
      get: async function(...params) {
        try {
          const stmt = db.prepare(sql);
          stmt.bind(params);

          if (stmt.step()) {
            const columns = stmt.getColumnNames();
            const values = stmt.get();

            const row = {};
            columns.forEach((col, idx) => {
              row[col] = values[idx];
            });

            stmt.free();
            return row;
          }

          stmt.free();
          return undefined;
        } catch (error) {
          throw error;
        }
      },
      all: async function(...params) {
        try {
          const stmt = db.prepare(sql);
          stmt.bind(params);

          const rows = [];
          const columns = stmt.getColumnNames();

          while (stmt.step()) {
            const values = stmt.get();
            const row = {};
            columns.forEach((col, idx) => {
              row[col] = values[idx];
            });
            rows.push(row);
          }

          stmt.free();
          return rows;
        } catch (error) {
          throw error;
        }
      }
    };
  },

  isReady: function() {
    return db !== null;
  }
};

module.exports = { dbWrapper, initDatabase };

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { dbWrapper: db, initDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(bodyParser.json());

// ===== PCBA Routes =====

// Create new PCBA
app.post('/api/pcbas', async (req, res) => {
  try {
    const { serial_number, board_type } = req.body;

    if (!serial_number || !board_type) {
      return res.status(400).json({ error: 'Serial number and board type are required' });
    }

    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO pcbas (id, serial_number, board_type) VALUES (?, ?, ?)');
    await stmt.run(id, serial_number, board_type);

    res.status(201).json({ id, serial_number, board_type, status: 'pending' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Serial number already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get all PCBAs
app.get('/api/pcbas', async (req, res) => {
  try {
    const pcbas = await db.prepare('SELECT * FROM pcbas ORDER BY created_at DESC').all();
    res.json(pcbas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single PCBA by ID or serial number
app.get('/api/pcbas/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    // Try to find by ID first, then by serial number
    let pcba = await db.prepare('SELECT * FROM pcbas WHERE id = ?').get(identifier);

    if (!pcba) {
      pcba = await db.prepare('SELECT * FROM pcbas WHERE serial_number = ?').get(identifier);
    }

    if (!pcba) {
      return res.status(404).json({ error: 'PCBA not found' });
    }

    // Get related records
    const assemblyRecords = await db.prepare('SELECT * FROM assembly_records WHERE pcba_id = ? ORDER BY timestamp DESC').all(pcba.id);
    const testRecords = await db.prepare('SELECT * FROM test_records WHERE pcba_id = ? ORDER BY timestamp DESC').all(pcba.id);
    const components = await db.prepare('SELECT * FROM components WHERE pcba_id = ?').all(pcba.id);

    res.json({
      ...pcba,
      assembly_records: assemblyRecords,
      test_records: testRecords,
      components: components
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update PCBA status
app.patch('/api/pcbas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const stmt = db.prepare('UPDATE pcbas SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = await stmt.run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'PCBA not found' });
    }

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Assembly Records Routes =====

app.post('/api/assembly-records', async (req, res) => {
  try {
    const { pcba_id, process_stage, operator_name, notes } = req.body;

    if (!pcba_id || !process_stage || !operator_name) {
      return res.status(400).json({ error: 'PCBA ID, process stage, and operator name are required' });
    }

    const stmt = db.prepare('INSERT INTO assembly_records (pcba_id, process_stage, operator_name, notes) VALUES (?, ?, ?, ?)');
    const result = await stmt.run(pcba_id, process_stage, operator_name, notes);

    res.status(201).json({ id: result.lastInsertRowid, pcba_id, process_stage, operator_name, notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/assembly-records/:pcba_id', async (req, res) => {
  try {
    const records = await db.prepare('SELECT * FROM assembly_records WHERE pcba_id = ? ORDER BY timestamp DESC').all(req.params.pcba_id);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Test Records Routes =====

app.post('/api/test-records', async (req, res) => {
  try {
    const { pcba_id, test_type, test_result, measured_value, expected_value, unit, operator_name, notes } = req.body;

    if (!pcba_id || !test_type || !test_result || !operator_name) {
      return res.status(400).json({ error: 'PCBA ID, test type, test result, and operator name are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO test_records (pcba_id, test_type, test_result, measured_value, expected_value, unit, operator_name, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = await stmt.run(pcba_id, test_type, test_result, measured_value, expected_value, unit, operator_name, notes);

    // Update PCBA status based on test result
    if (test_result === 'fail') {
      await db.prepare('UPDATE pcbas SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('failed', pcba_id);
    } else if (test_result === 'pass') {
      await db.prepare('UPDATE pcbas SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('passed', pcba_id);
    }

    res.status(201).json({ id: result.lastInsertRowid, pcba_id, test_type, test_result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/test-records/:pcba_id', async (req, res) => {
  try {
    const records = await db.prepare('SELECT * FROM test_records WHERE pcba_id = ? ORDER BY timestamp DESC').all(req.params.pcba_id);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Component Routes =====

app.post('/api/components', async (req, res) => {
  try {
    const { pcba_id, component_name, component_value, lot_code, supplier } = req.body;

    if (!pcba_id || !component_name) {
      return res.status(400).json({ error: 'PCBA ID and component name are required' });
    }

    const stmt = db.prepare('INSERT INTO components (pcba_id, component_name, component_value, lot_code, supplier) VALUES (?, ?, ?, ?, ?)');
    const result = await stmt.run(pcba_id, component_name, component_value, lot_code, supplier);

    res.status(201).json({ id: result.lastInsertRowid, pcba_id, component_name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Statistics Route =====

app.get('/api/statistics', async (req, res) => {
  try {
    const totalPCBAs = await db.prepare('SELECT COUNT(*) as count FROM pcbas').get();
    const passedPCBAs = await db.prepare('SELECT COUNT(*) as count FROM pcbas WHERE status = "passed"').get();
    const failedPCBAs = await db.prepare('SELECT COUNT(*) as count FROM pcbas WHERE status = "failed"').get();
    const pendingPCBAs = await db.prepare('SELECT COUNT(*) as count FROM pcbas WHERE status = "pending"').get();

    res.json({
      total: totalPCBAs.count,
      passed: passedPCBAs.count,
      failed: failedPCBAs.count,
      pending: pendingPCBAs.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server after database initialization
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`PCBA Traceability Backend running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { authMiddleware } = require('../middleware/authMiddleware');

const DATA_DIR = path.join(__dirname, '../../data');
const STATE_FILE = path.join(DATA_DIR, 'erp_state.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Read state helper
function readState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = fs.readFileSync(STATE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[ERP Route] Error reading state file:', err.message);
  }
  return null;
}

// Write state helper
function writeState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[ERP Route] Error writing state file:', err.message);
    return false;
  }
}

// GET /api/erp/health - Health check endpoint for judges
router.get('/health', (req, res) => {
  const state = readState();
  res.json({
    status: 'ONLINE',
    service: 'Nexora ERP State Synchronization Engine',
    version: '1.2.0',
    mode: 'Hybrid (Offline-First + REST Sync)',
    hasPersistedState: !!state,
    studentsTracked: state?.students?.length || 0,
    timestamp: new Date().toISOString()
  });
});

// GET /api/erp/state - Retrieve current synchronized ERP state
router.get('/state', (req, res) => {
  const state = readState();
  if (state) {
    return res.json({
      success: true,
      source: 'server_cache',
      students: state.students || [],
      lastSyncedAt: state.lastSyncedAt || new Date().toISOString()
    });
  }
  return res.json({
    success: true,
    source: 'empty',
    students: [],
    message: 'No server state yet; client seed will initialize.'
  });
});

// POST /api/erp/sync - Synchronize client changes to backend (Protected)
router.post('/sync', authMiddleware, (req, res) => {
  const { students, clientVersion } = req.body;

  if (!students || !Array.isArray(students)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid payload: "students" array is required.'
    });
  }

  const newState = {
    students,
    clientVersion: clientVersion || 1,
    lastSyncedAt: new Date().toISOString(),
    recordCount: students.length,
    authenticatedUser: req.user?.name || 'Administrator'
  };

  const ok = writeState(newState);

  if (ok) {
    return res.json({
      success: true,
      message: 'ERP state synchronized successfully across institutional ledger.',
      studentsCount: students.length,
      timestamp: newState.lastSyncedAt,
      actor: req.user?.name || 'Authorized Auditor'
    });
  } else {
    return res.status(500).json({
      success: false,
      error: 'Failed to write ERP state to disk.'
    });
  }
});

// POST /api/erp/reset - Reset to factory defaults (Protected)
router.post('/reset', authMiddleware, (req, res) => {
  try {
    if (fs.existsSync(STATE_FILE)) {
      fs.unlinkSync(STATE_FILE);
    }
    return res.json({
      success: true,
      message: 'Server ERP state reset to factory defaults.'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;

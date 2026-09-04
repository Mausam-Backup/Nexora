const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Import app from app.js
const app = require('./app');

const PORT = process.env.PORT || 5001;

// Initialize database with graceful fallback
connectDB().then((isMongoConnected) => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Nexora ERP Backend Server running on port ${PORT}`);
    console.log(`📡 State Sync Endpoint: http://localhost:${PORT}/api/erp/sync`);
    console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/erp/health`);
    console.log(`💾 Storage Mode: ${isMongoConnected ? 'MongoDB Database' : 'Resilient File-Backed JSON Store'}`);
    console.log(`====================================================`);
  });
}).catch((error) => {
  console.warn('Database initialization warning:', error.message);
  app.listen(PORT, () => {
    console.log(`🚀 Nexora ERP Backend running in standalone mode on port ${PORT}`);
  });
});
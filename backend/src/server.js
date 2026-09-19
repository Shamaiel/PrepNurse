const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const { seedInitialData } = require('./utils/seed');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const questionRoutes = require('./routes/questionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development and standard origins
    if (!origin || origin === clientUrl || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for initial deploy/cross-device mobile testing
    }
  },
  credentials: true
}));

// Body parsing with generous limit for bulk question imports
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging in dev
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    platform: 'PrepNurse (NORCET Mock Test Platform)',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static frontend files (Single Service Deployment on Render / Cloud)
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error Handler
app.use(errorHandler);

// Bootstrap
async function startServer() {
  await connectDB();
  await seedInitialData();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 PrepNurse Server listening on http://localhost:${PORT}`);
    console.log(`🏥 Platform: PrepNurse — Practice. Prepare. Succeed.`);
    console.log(`📱 Mobile/LAN URL: Available on local network IP`);
    console.log(`====================================================`);
  });
}

startServer();

module.exports = app;

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

import healthRouter from './routes/health.js';
import hospitalsRouter from './routes/hospitals.js';
import roomsRouter from './routes/rooms.js';
import appointmentsRouter from './routes/appointments.js';
import doctorsRouter from './routes/doctors.js';
import pharmacyRouter from './routes/pharmacy.js';
import schemesRouter from './routes/schemes.js';
import emergencyRouter from './routes/emergency.js';
import paymentsRouter from './routes/payments.js';
import aiRouter from './routes/ai.js';
import { readDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Initialize database on server start
readDb();

// Mount REST API Routes
app.use('/api/health', healthRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/pharmacy', pharmacyRouter);
app.use('/api/schemes', schemesRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/ai', aiRouter);

// Serve static PWA (React build)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    // Proper headers for PWA files
    if (filePath.endsWith('sw.js')) {
      res.setHeader('Service-Worker-Allowed', '/');
      res.setHeader('Cache-Control', 'no-cache');
    }
    if (filePath.endsWith('manifest.json')) {
      res.setHeader('Content-Type', 'application/manifest+json');
    }
  }
}));

// Serve assets folder from root
const assetsPath = path.join(__dirname, '../assets');
app.use('/assets', express.static(assetsPath));

// Install / download page
app.get('/install', (req, res) => {
  res.sendFile(path.join(distPath, 'install.html'));
});

// SPA fallback — serve index.html for all non-API routes
app.get('/*splat', (req, res) => {
  // Don't intercept API calls
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: `API route not found: ${req.originalUrl}`
    });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  const localIPs = getLocalIPs();
  console.log(`=============================================`);
  console.log(`  🏥 HeloDoc Full-Stack Server Online!`);
  console.log(`  🌐 Local:   http://localhost:${PORT}`);
  localIPs.forEach(ip => {
    console.log(`  📱 Network: http://${ip}:${PORT}`);
  });
  console.log(`  🔍 API:     http://localhost:${PORT}/api/health`);
  console.log(`  📱 PWA:     http://localhost:${PORT}/`);
  console.log(`=============================================`);
});

// Helper to get local IP addresses
function getLocalIPs() {
  const nets = os.networkInterfaces();
  const results = [];
  for (const iface of Object.values(nets)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        results.push(alias.address);
      }
    }
  }
  return results;
}

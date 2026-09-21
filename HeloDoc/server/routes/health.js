import { Router } from 'express';
import { readDb } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    status: 'healthy',
    service: 'HeloDoc Medical Backend API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    collections: {
      hospitals: db.hospitals?.length || 0,
      doctors: db.doctors?.length || 0,
      appointments: db.appointments?.length || 0,
      medicines: db.medicines?.length || 0,
      orders: db.orders?.length || 0,
      schemes: db.schemes?.length || 0,
      emergencyAlerts: db.emergencyAlerts?.length || 0,
      payments: db.payments?.length || 0
    }
  });
});

export default router;

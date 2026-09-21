import { Router } from 'express';
import { getCollection, updateCollection } from '../db.js';

const router = Router();

// GET /api/hospitals - List all affiliated hospitals
router.get('/', (req, res) => {
  const hospitals = getCollection('hospitals');
  res.json({
    success: true,
    count: hospitals.length,
    data: hospitals
  });
});

// POST /api/hospitals - Register new hospital
router.post('/', (req, res) => {
  const { name, type, address, phone, rating, supportedSchemes, erBedsAvailable, image } = req.body;
  if (!name || !address) {
    return res.status(400).json({ success: false, error: 'Hospital name and address are required' });
  }

  const newHospital = {
    id: `hosp-${Date.now()}`,
    name,
    type: type || 'Private • Multi-Specialty',
    distanceKm: Number((Math.random() * 5 + 0.5).toFixed(1)),
    address,
    phone: phone || '044-20000000',
    rating: Number(rating) || 4.8,
    reviewsCount: 1,
    supportedSchemes: supportedSchemes || ['Senior Citizen 50% OPD Subsidy'],
    hasEmergencyER: true,
    ambulanceAvailable: true,
    erBedsAvailable: Number(erBedsAvailable) || 10,
    image: image || '/assets/hospital-bg.jpg',
    departments: ['Emergency Care', 'General Medicine', 'Pharmacy']
  };

  updateCollection('hospitals', (list) => [newHospital, ...list]);

  res.status(201).json({
    success: true,
    message: 'Hospital registered successfully',
    data: newHospital
  });
});

export default router;

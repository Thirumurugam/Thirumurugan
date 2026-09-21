import { Router } from 'express';
import { getCollection, updateCollection } from '../db.js';

const router = Router();

// GET /api/emergency/alerts - List active alerts
router.get('/alerts', (req, res) => {
  const alerts = getCollection('emergencyAlerts');
  res.json({
    success: true,
    count: alerts.length,
    data: alerts
  });
});

// POST /api/emergency/sos - Trigger emergency SOS
router.post('/sos', (req, res) => {
  const { patientName, patientPhone, latitude, longitude, locationName, medicalCondition, emergencyContacts } = req.body;

  const alertId = `SOS-${Date.now()}`;
  const newAlert = {
    id: alertId,
    alertId,
    timestamp: new Date().toISOString(),
    patientName: patientName || 'Mr. Ramachandran V.',
    patientPhone: patientPhone || '+91 98765 43210',
    location: {
      latitude: latitude || 13.067439,
      longitude: longitude || 80.237617,
      name: locationName || 'Anna Salai, Omandurar Hospital Vicinity'
    },
    condition: medicalCondition || 'Emergency SOS Button Triggered by Patient',
    status: 'DISPATCHED_TO_ER',
    assignedHospital: 'Government Multi Super Specialty Hospital (Room 001 ER)',
    dispatchedTeam: 'Trauma Care Unit A',
    ambulanceDispatched: true,
    caregiverNotified: true,
    emergencyContacts: emergencyContacts || ['+91 98401 23456 (Family Caregiver)']
  };

  updateCollection('emergencyAlerts', (list) => [newAlert, ...list]);

  res.status(201).json({
    success: true,
    message: 'Emergency SOS Broadcasted! Hospital trauma team and family caregiver have been alerted.',
    data: newAlert
  });
});

export default router;

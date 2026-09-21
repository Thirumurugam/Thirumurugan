import { Router } from 'express';
import { getCollection, updateCollection } from '../db.js';

const router = Router();

// GET /api/doctors - List doctors
router.get('/', (req, res) => {
  const doctors = getCollection('doctors');
  res.json({
    success: true,
    count: doctors.length,
    data: doctors
  });
});

// POST /api/doctors/verify - Verify NMC Registration Credential
router.post('/verify', (req, res) => {
  const { nmcNumber, registrationNumber, doctorName, stateMedicalCouncil } = req.body;
  const regNo = nmcNumber || registrationNumber;

  if (!regNo) {
    return res.status(400).json({ success: false, error: 'NMC Registration Number is required' });
  }

  // Verification simulator
  const isValid = regNo.toUpperCase().startsWith('NMC-') || regNo.length >= 6;
  const doctors = getCollection('doctors');
  const matchedDoc = doctors.find(d => d.nmcNumber === regNo || d.name === doctorName) || doctors[0];

  res.json({
    success: true,
    verified: isValid,
    status: isValid ? 'Active & Validated' : 'Flagged for Review',
    verificationId: `NMC-VER-${Date.now()}`,
    verifiedAt: new Date().toISOString(),
    doctor: matchedDoc,
    details: {
      nmcNumber: regNo,
      doctorName: matchedDoc ? matchedDoc.name : (doctorName || 'Dr. Registered Practitioner'),
      council: stateMedicalCouncil || 'Tamil Nadu Medical Council',
      validUntil: '31-Dec-2029'
    }
  });
});

export default router;

import { Router } from 'express';
import { getCollection } from '../db.js';

const router = Router();

// GET /api/schemes - List government health schemes
router.get('/', (req, res) => {
  const schemes = getCollection('schemes');
  res.json({
    success: true,
    count: schemes.length,
    data: schemes
  });
});

// POST /api/schemes/verify - Check scheme eligibility
router.post('/verify', (req, res) => {
  const { schemeId, cardOrAadhaarNumber, age, patientAge, annualIncome, incomeLevel } = req.body;

  if (!schemeId) {
    return res.status(400).json({ success: false, error: 'Scheme ID is required' });
  }

  const userAge = Number(patientAge || age) || 68;
  const isSenior = userAge >= 60;

  let eligible = true;
  let discountPercent = 50;
  let benefitDescription = 'Eligible for benefits';

  const sId = schemeId.toLowerCase();
  if (sId.includes('senior') || sId === 'senior-opd') {
    eligible = isSenior;
    discountPercent = eligible ? 50 : 0;
    benefitDescription = eligible 
      ? 'Verified: 50% OPD Subsidy Applied on Consultation & Generic Medicines' 
      : 'Applicant must be 60 years or above for Senior Concession';
  } else if (sId.includes('pmjay') || sId.includes('ayushman')) {
    eligible = true;
    discountPercent = 100;
    benefitDescription = 'Verified: Full ₹5,00,000 Cashless Hospitalization Coverage Active';
  }

  res.json({
    success: true,
    eligible,
    schemeId,
    discountPercent,
    verificationCode: `SCH-AUTH-${Date.now().toString().slice(-6)}`,
    benefitDescription,
    timestamp: new Date().toISOString()
  });
});

export default router;

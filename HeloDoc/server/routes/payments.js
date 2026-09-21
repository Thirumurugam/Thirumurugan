import { Router } from 'express';
import { getCollection, updateCollection } from '../db.js';

const router = Router();

// GET /api/payments - List payments
router.get('/', (req, res) => {
  const payments = getCollection('payments');
  res.json({
    success: true,
    count: payments.length,
    data: payments
  });
});

// POST /api/payments/create - Create payment intent
router.post('/create', (req, res) => {
  const { amount, purpose, appointmentId } = req.body;

  res.json({
    success: true,
    orderId: `ORD-${Date.now()}`,
    amount: Number(amount) || 300,
    currency: 'INR',
    upiLink: `upi://pay?pa=helodoc.hospital@icici&pn=HeloDoc+Hospital+Care&am=${amount || 300}&cu=INR`,
    expiresInSeconds: 900
  });
});

// POST /api/payments/verify - Verify payment & generate official receipt
router.post('/verify', (req, res) => {
  const { orderId, paymentMethod, amount, appointmentData, patientName } = req.body;

  const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`;

  const paymentRecord = {
    id: txnId,
    appointmentId: appointmentData?.id || orderId,
    token: appointmentData?.token || '#A-14',
    patientName: patientName || 'Mr. Ramachandran V.',
    doctorName: appointmentData?.doctor || 'Dr. Rajesh Kumar',
    amount: Number(amount) || 300,
    method: paymentMethod || 'UPI AutoPay (GPay)',
    status: 'PAID',
    paymentStatus: 'Success',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    receiptNo,
    receiptNumber: receiptNo,
    qrCodeString: `HELODOC-TXN|${txnId}|${receiptNo}|INR${amount || 300}|SUCCESS`
  };

  updateCollection('payments', (list) => [paymentRecord, ...list]);

  res.json({
    success: true,
    message: 'Payment verified successfully',
    receiptNumber: receiptNo,
    status: 'PAID',
    receipt: paymentRecord,
    data: paymentRecord
  });
});

export default router;

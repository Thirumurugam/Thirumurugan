import { Router } from 'express';
import { getCollection, updateCollection } from '../db.js';

const router = Router();

// GET /api/pharmacy/medicines - Get generic medicines
router.get('/medicines', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const medicines = getCollection('medicines');

  const filtered = query
    ? medicines.filter(m => 
        m.name.toLowerCase().includes(query) || 
        m.genericName.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      )
    : medicines;

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// GET /api/pharmacy/orders - List medicine orders
router.get('/orders', (req, res) => {
  const orders = getCollection('orders');
  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// POST /api/pharmacy/orders - Place medicine delivery order
router.post('/orders', (req, res) => {
  const { items, medicines, totalAmount, savingsVsMarket, deliveryAddress, patientName, patientPhone } = req.body;
  const orderItems = items || medicines || [];

  if (!orderItems || !orderItems.length) {
    return res.status(400).json({ success: false, error: 'Order items or medicines are required' });
  }

  // Generate secure 4-digit Delivery OTP
  const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));
  const orderNumber = `HD-JAN-${Math.floor(1000 + Math.random() * 8999)}`;

  const newOrder = {
    id: `ord-${Date.now()}`,
    orderId: orderNumber,
    orderNumber,
    items: orderItems,
    totalAmount: Number(totalAmount) || 120,
    savingsVsMarket: Number(savingsVsMarket) || 540,
    status: 'Confirmed - Dispatching from Ground Floor Jan Aushadhi Kendra',
    deliveryOtp,
    placedDate: 'Just now',
    deliveryAddress: deliveryAddress || 'Flat 3B, Sri Krishna Apts, Gandhi Road, Chennai',
    patientName: patientName || 'Patient',
    patientPhone: patientPhone || '+91 98765 43210',
    riderName: 'Murugan S. (Hospital Express Rider)',
    riderPhone: '+91 94451 90812'
  };

  updateCollection('orders', (list) => [newOrder, ...list]);

  res.status(201).json({
    success: true,
    message: `Order placed. Your Delivery OTP is ${deliveryOtp}`,
    data: newOrder
  });
});

export default router;

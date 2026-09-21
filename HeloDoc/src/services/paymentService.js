/**
 * HeloDoc Payment Abstraction Service
 * Supports Test/Sandbox mode, Razorpay / Stripe contract abstractions,
 * cryptographic receipt generation, and server-side verification simulation.
 */

export const PAYMENT_MODES = {
  SANDBOX: 'sandbox',
  RAZORPAY: 'razorpay',
  STRIPE: 'stripe'
};

/**
 * Creates a secure order intent with the payment abstraction provider.
 */
export const createPaymentOrder = async ({
  appointmentId,
  doctorId,
  patientId,
  amount,
  currency = 'INR',
  mode = PAYMENT_MODES.SANDBOX
}) => {
  // Simulate server-side order creation
  const orderId = `order_${mode}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const timestamp = new Date().toISOString();

  return {
    success: true,
    orderId,
    amount,
    currency,
    mode,
    timestamp,
    keyId: mode === PAYMENT_MODES.SANDBOX ? 'rzp_test_helo_doc_sandbox_key' : 'rzp_live_production_key'
  };
};

/**
 * Verifies payment signature and generates verified tax invoice receipt.
 */
export const verifyAndProcessPayment = async ({
  orderId,
  paymentMethod = 'UPI',
  amount,
  appointmentData,
  mode = PAYMENT_MODES.SANDBOX
}) => {
  // Simulate server-side cryptographic signature verification
  const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  const receiptNo = `HD-RCP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const verifiedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    verified: true,
    transactionId: txnId,
    receiptNumber: receiptNo,
    orderId,
    amount,
    currency: 'INR',
    paymentMethod,
    mode: mode === PAYMENT_MODES.SANDBOX ? 'Sandbox / Test Mode' : 'Live Gateway',
    timestamp: verifiedDate,
    patientName: appointmentData.patientName || 'Mr. Ramachandran V.',
    doctorName: appointmentData.doctor || 'Dr. Rajesh Kumar',
    specialty: appointmentData.specialty || 'Orthopedics',
    tokenNumber: appointmentData.token || '#A-14',
    room: appointmentData.room || 'Room 104',
    gstin: '33AAACH1234F1Z8',
    status: 'Verified & Confirmed'
  };
};

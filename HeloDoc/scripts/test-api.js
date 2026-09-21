/**
 * HeloDoc Full-Stack API Automated Verification Suite
 * Tests all 11 backend service domains end-to-end
 */

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🏥 [HeloDoc Test Suite] Starting Automated Verification...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health
  await test('GET /api/health returns 200 and healthy status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error('Status not healthy');
  });

  // 2. Hospitals
  await test('GET /api/hospitals returns list with City Care / Government Multi-Specialty', async () => {
    const res = await fetch(`${BASE_URL}/hospitals`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const body = await res.json();
    const list = body.data || body;
    if (!Array.isArray(list) || list.length === 0) throw new Error('Expected hospital array');
    const govtHosp = list.find(h => h.name.includes('Government Multi Super Specialty') || h.name.includes('Hospital'));
    if (!govtHosp) throw new Error('Missing primary hospital');
  });

  // 3. Rooms
  await test('GET /api/rooms returns floors with Room 404 ICU', async () => {
    const res = await fetch(`${BASE_URL}/rooms`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const body = await res.json();
    const rooms = body.data || body;
    const allRooms = Object.values(rooms).flat();
    const r404 = allRooms.find(r => r.room === 'Room 404');
    if (!r404 || !r404.isICU) throw new Error('Room 404 ICU not found or missing isICU flag');
  });

  await test('GET /api/rooms/404 returns specific room details', async () => {
    const res = await fetch(`${BASE_URL}/rooms/404`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const body = await res.json();
    const room = body.data || body;
    if (room.room !== 'Room 404' || !room.doctor) throw new Error('Invalid room 404 response');
  });

  // 4. Doctors
  await test('GET /api/doctors & POST /api/doctors/verify verifies NMC registration', async () => {
    const listRes = await fetch(`${BASE_URL}/doctors`);
    if (!listRes.ok) throw new Error(`Status ${listRes.status}`);
    const listBody = await listRes.json();
    const docs = listBody.data || listBody;
    if (docs.length < 3) throw new Error('Expected at least 3 doctors');

    const verifyRes = await fetch(`${BASE_URL}/doctors/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationNumber: 'NMC-TN-84920' })
    });
    if (!verifyRes.ok) throw new Error(`Status ${verifyRes.status}`);
    const verifyData = await verifyRes.json();
    if (!verifyData.verified || !verifyData.doctor) {
      throw new Error('NMC verification failed for doctor registration');
    }
  });

  // 5. Appointments & Queue
  await test('POST /api/appointments creates appointment with token and updates queue', async () => {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: 'Mr. Test Patient',
        doctor: 'Dr. Rajesh Kumar',
        date: 'Today',
        time: '11:00 AM',
        specialty: 'Orthopedics'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const body = await res.json();
    const apt = body.data || body;
    if (!apt.token || !apt.token.startsWith('#')) throw new Error('Invalid token generated');
  });

  await test('GET /api/appointments/queue/live returns active live queue', async () => {
    const res = await fetch(`${BASE_URL}/appointments/queue/live`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const body = await res.json();
    const q = body.queue || body.data;
    if (!Array.isArray(q) || q.length === 0) throw new Error('Expected non-empty live queue');
  });

  // 6. Pharmacy & 4-Digit OTP Orders
  await test('GET /api/pharmacy/medicines returns Jan Aushadhi generic catalog', async () => {
    const res = await fetch(`${BASE_URL}/pharmacy/medicines`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const body = await res.json();
    const meds = body.data || body;
    if (!Array.isArray(meds) || meds.length < 4) throw new Error('Expected generic medicines list');
    const gluco = meds.find(m => m.genericName.includes('Glucosamine'));
    if (!gluco) throw new Error('Missing Glucosamine');
  });

  await test('POST /api/pharmacy/orders generates delivery order with 4-digit OTP', async () => {
    const res = await fetch(`${BASE_URL}/pharmacy/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: 'Mr. Ramachandran V.',
        medicines: ['Glucosamine & Chondroitin', 'Pantoprazole 40mg'],
        totalAmount: 210,
        deliveryAddress: '42, 3rd Cross Street, Gandhinagar, Chennai'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const body = await res.json();
    const order = body.data || body;
    const otp = order.deliveryOtp || order.otp;
    if (!otp || otp.length !== 4) throw new Error(`Expected 4-digit OTP, got ${otp}`);
    const ordId = order.orderId || order.orderNumber;
    if (!ordId || !ordId.startsWith('HD-JAN-')) throw new Error(`Invalid orderId ${ordId}`);
  });

  // 7. Govt Schemes
  await test('POST /api/schemes/verify checks Ayushman Bharat eligibility', async () => {
    const res = await fetch(`${BASE_URL}/schemes/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schemeId: 'scheme_pmjay',
        patientAge: 68,
        incomeLevel: 'bpl'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.eligible || data.discountPercent !== 100) throw new Error('Eligibility calculation incorrect');
  });

  // 8. Emergency SOS
  await test('POST /api/emergency/sos dispatches code blue emergency alert', async () => {
    const res = await fetch(`${BASE_URL}/emergency/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: 'Mr. Ramachandran V.',
        locationName: 'Room 104, 1st Floor',
        medicalCondition: 'Cardiac Alert'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const body = await res.json();
    const alert = body.data || body;
    if (!alert.alertId || alert.dispatchedTeam !== 'Trauma Care Unit A') {
      throw new Error('Emergency dispatch failed');
    }
  });

  // 9. Payments
  await test('POST /api/payments/verify records digital payment', async () => {
    const res = await fetch(`${BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: 'ORD-101',
        amount: 250,
        paymentMethod: 'UPI'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const pmt = await res.json();
    if (!pmt.receiptNumber || pmt.status !== 'PAID') throw new Error('Payment verification failed');
  });

  // 10. Multilingual AI Medical Triage
  await test('POST /api/ai/chat returns localized guidance for Room 404 in English, Tamil, and Hindi', async () => {
    // English
    const resEn = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Where is ICU room 404?', language: 'en' })
    });
    const dataEn = await resEn.json();
    const replyEn = dataEn.reply || dataEn.guidance;
    if (!replyEn || !replyEn.includes('404') || !replyEn.includes('ICU')) {
      throw new Error(`English AI triage unexpected reply: ${replyEn}`);
    }

    // Tamil
    const resTa = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'தோல் மருத்துவர் அறை எங்கே?', language: 'ta' })
    });
    const dataTa = await resTa.json();
    const replyTa = dataTa.reply || dataTa.guidance;
    if (!replyTa || !replyTa.includes('401')) {
      throw new Error(`Tamil AI triage unexpected reply: ${replyTa}`);
    }

    // Hindi
    const resHi = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'दिल के डॉक्टर कहां हैं?', language: 'hi' })
    });
    const dataHi = await resHi.json();
    const replyHi = dataHi.reply || dataHi.guidance;
    if (!replyHi || (!replyHi.includes('201') && !replyHi.includes('402'))) {
      throw new Error(`Hindi AI triage unexpected reply: ${replyHi}`);
    }
  });

  // 11. Edge Cases & Error Boundary Tests
  await test('GET /api/rooms/invalid-999 returns 404 Not Found', async () => {
    const res = await fetch(`${BASE_URL}/rooms/invalid-999`);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
  });

  await test('POST /api/doctors/verify with empty body returns 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/doctors/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await test('POST /api/pharmacy/orders with empty medicines returns 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/pharmacy/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName: 'Test', items: [] })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await test('POST /api/schemes/verify with young age fails Senior OPD concession', async () => {
    const res = await fetch(`${BASE_URL}/schemes/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemeId: 'senior-opd', age: 35 })
    });
    const data = await res.json();
    if (data.eligible !== false) throw new Error('Expected eligible: false for 35yo applicant');
  });

  await test('POST /api/ai/chat with missing query returns 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await test('POST /api/ai/chat flags critical emergency for "sudden chest pain and breathlessness"', async () => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'I have severe chest pain and breathlessness', language: 'en' })
    });
    const data = await res.json();
    if (!data.isEmergency || !data.recommendedRoom.includes('001')) {
      throw new Error('Emergency triage failed to flag critical symptom');
    }
  });

  await test('POST /api/ai/chat flags critical emergency in Tamil for "நெஞ்சு வலி"', async () => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'எனக்கு கடுமையான நெஞ்சு வலி உள்ளது', language: 'ta' })
    });
    const data = await res.json();
    if (!data.isEmergency || !data.reply.includes('அவசர')) {
      throw new Error('Tamil emergency triage failed');
    }
  });

  await test('POST /api/payments/create returns UPI payment link', async () => {
    const res = await fetch(`${BASE_URL}/payments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 500, purpose: 'Doctor Consultation' })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.upiLink || !data.upiLink.startsWith('upi://')) {
      throw new Error('Invalid UPI link generated');
    }
  });

  console.log(`\n=============================================`);
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`=============================================`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All HeloDoc Backend APIs verified with 100% SUCCESS!\n');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

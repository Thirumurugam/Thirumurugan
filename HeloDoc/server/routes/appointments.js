import { Router } from 'express';
import { getCollection, updateCollection } from '../db.js';

const router = Router();

// GET /api/appointments - List all appointments
router.get('/', (req, res) => {
  const appointments = getCollection('appointments');
  res.json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

// POST /api/appointments - Book a new appointment
router.post('/', (req, res) => {
  const { doctor, doctorId, specialty, date, time, room, floor, fee, subsidyDiscount, finalPrice, patientName, patientAge, patientPhone, symptoms, attachedReports } = req.body;

  // Generate unique appointment token: #A-15, #B-22, etc.
  const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 4)); // A, B, C, D
  const tokenNum = Math.floor(10 + Math.random() * 89);
  const token = `#${prefix}-${tokenNum}`;

  const newAppointment = {
    id: `apt-${Date.now()}`,
    token,
    doctor: doctor || 'Dr. Rajesh Kumar',
    doctorId: doctorId || 'doc-101',
    specialty: specialty || 'Orthopedics',
    treatment: symptoms ? (symptoms.length > 40 ? symptoms.substring(0, 38) + '...' : symptoms) : 'Specialist Consultation',
    date: date || 'Today',
    time: time || '11:00 AM',
    room: room || 'Room 104',
    floor: floor || '1st Floor (OPD)',
    fee: Number(fee) || 600,
    subsidyDiscount: Number(subsidyDiscount) || 300,
    finalPrice: Number(finalPrice) || 300,
    status: 'Confirmed',
    patientProblem: {
      symptoms: symptoms || 'General consultation follow-up',
      duration: '1 Week',
      hasVoiceNote: false,
      attachedReports: attachedReports || []
    },
    bookedAt: new Date().toISOString()
  };

  // Add to appointments collection
  updateCollection('appointments', (list) => [newAppointment, ...list]);

  // Add to Live Doctor Queue
  updateCollection('doctorQueue', (queue) => [
    ...queue,
    {
      id: newAppointment.id,
      token: newAppointment.token,
      patient: patientName || 'Patient',
      age: patientAge || 65,
      problem: newAppointment.patientProblem.symptoms,
      phone: patientPhone || '+91 98765 43210',
      active: false,
      reports: newAppointment.patientProblem.attachedReports
    }
  ]);

  res.status(201).json({
    success: true,
    message: `Appointment booked successfully. Token: ${token}`,
    data: newAppointment
  });
});

// PATCH /api/appointments/:id - Update status (e.g. In-Consultation, Completed, Cancelled)
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status, date, time } = req.body;

  let updatedApt = null;
  updateCollection('appointments', (list) => {
    return list.map(apt => {
      if (apt.id === id) {
        updatedApt = { ...apt, ...(status && { status }), ...(date && { date }), ...(time && { time }) };
        return updatedApt;
      }
      return apt;
    });
  });

  if (!updatedApt) {
    return res.status(404).json({ success: false, error: 'Appointment not found' });
  }

  res.json({
    success: true,
    message: 'Appointment updated',
    data: updatedApt
  });
});

// GET /api/appointments/queue - Live OPD Queue
router.get('/queue/live', (req, res) => {
  const queue = getCollection('doctorQueue');
  const activePatient = queue.find(q => q.active) || queue[0];
  const waitingCount = queue.filter(q => !q.active).length;

  res.json({
    success: true,
    currentServing: activePatient ? activePatient.token : '#A-14',
    waitingPatientsCount: waitingCount,
    estimatedWaitMinutes: waitingCount * 12,
    queue
  });
});

export default router;

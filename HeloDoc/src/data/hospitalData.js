export const initialHospitalsList = [
  {
    id: 'hosp-1',
    name: 'City Care Multi-Specialty Hospital',
    type: 'Multi-Specialty & Trauma Centre',
    address: '124, Healthcare Boulevard, Metro Health City',
    distanceKm: 1.2,
    phone: '+91 44 2834 9000',
    emergencyHelpline: '108 / +91 44 2834 9999',
    hasEmergencyER: true,
    ambulanceAvailable: true,
    erBedsAvailable: 8,
    totalBeds: 250,
    supportedSchemes: ['Ayushman Bharat PM-JAY', 'Senior Citizen OPD Subsidy', 'State Health Insurance'],
    departments: ['Orthopedics', 'Cardiology', 'General Medicine', 'Neurology', 'ICU & Trauma'],
    rating: 4.9,
    photos: ['/assets/hospital-1.jpg'],
    geoCoords: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 'hosp-2',
    name: 'Govt. District General Hospital',
    type: 'Government Public Hospital',
    address: '45, Anna Salai Civil Lines',
    distanceKm: 2.8,
    phone: '+91 44 2530 5000',
    emergencyHelpline: '112 / +91 44 2530 5100',
    hasEmergencyER: true,
    ambulanceAvailable: true,
    erBedsAvailable: 14,
    totalBeds: 500,
    supportedSchemes: ['100% Free Public Care', 'Ayushman Bharat PM-JAY', 'Senior Care Card'],
    departments: ['Emergency Trauma', 'General Medicine', 'Ophthalmology', 'Pediatrics', 'Jan Aushadhi'],
    rating: 4.6,
    photos: ['/assets/hospital-2.jpg'],
    geoCoords: { lat: 13.0878, lng: 80.2785 }
  },
  {
    id: 'hosp-3',
    name: 'Apollo Lifeline Cardiac & Neuro Institute',
    type: 'Super Specialty Hospital',
    address: '88, Greams Road Apex Tower',
    distanceKm: 4.1,
    phone: '+91 44 2829 0200',
    emergencyHelpline: '1066 / +91 44 2829 3333',
    hasEmergencyER: true,
    ambulanceAvailable: true,
    erBedsAvailable: 4,
    totalBeds: 320,
    supportedSchemes: ['Corporate Cashless', 'Senior Wellness Club', 'Ayushman Golden Card'],
    departments: ['Cardiology', 'Cardiac Surgery', 'Neurology', 'Stroke Unit', 'Orthopedics'],
    rating: 4.95,
    photos: ['/assets/hospital-3.jpg'],
    geoCoords: { lat: 13.0610, lng: 80.2500 }
  },
  {
    id: 'hosp-4',
    name: 'Sanjeevani Elder Care Clinic & Daycare',
    type: 'Specialized Geriatric Clinic',
    address: '12, Gandhi Nagar 2nd Main Road',
    distanceKm: 0.9,
    phone: '+91 44 2441 1234',
    emergencyHelpline: '+91 44 2441 1200',
    hasEmergencyER: false,
    ambulanceAvailable: true,
    erBedsAvailable: 0,
    totalBeds: 30,
    supportedSchemes: ['Senior Citizen 50% OPD Subsidy', 'Elderly Chronic Care Package'],
    departments: ['Geriatrics', 'Physiotherapy', 'Diabetes Management', 'Memory & Dementia Care'],
    rating: 4.8,
    photos: ['/assets/hospital-4.jpg'],
    geoCoords: { lat: 13.0067, lng: 80.2540 }
  }
];

export const initialDoctorsList = [
  {
    id: 'doc-101',
    name: 'Dr. Rajesh Kumar',
    title: 'MS (Ortho), Senior Joint Replacement Specialist',
    specialization: 'Orthopedics',
    specialtyKey: 'ortho',
    experienceYears: 18,
    registrationNumber: 'MCI-TN-48291',
    medicalCouncil: 'Tamil Nadu Medical Council',
    hospitalId: 'hosp-1',
    hospitalName: 'City Care Multi-Specialty Hospital',
    room: 'Room 104',
    floor: '1st Floor (OPD)',
    fee: 500,
    rating: 4.9,
    reviews: 142,
    verificationStatus: 'verified', // 'verified', 'pending', 'suspended'
    avatar: '👨‍⚕️',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['09:30 AM', '10:30 AM', '11:30 AM', '04:30 PM', '05:30 PM'],
    bio: 'Pioneer in minimally invasive knee joint preservation and geriatric arthritis management with over 18 years of clinical practice.'
  },
  {
    id: 'doc-102',
    name: 'Dr. S. Venkat',
    title: 'M.Ch (Ortho), Senior Spine & Joint Surgeon',
    specialization: 'Orthopedics',
    specialtyKey: 'ortho',
    experienceYears: 22,
    registrationNumber: 'MCI-TN-21948',
    medicalCouncil: 'Medical Council of India',
    hospitalId: 'hosp-1',
    hospitalName: 'City Care Multi-Specialty Hospital',
    room: 'Room 101',
    floor: '1st Floor (OPD)',
    fee: 600,
    rating: 4.85,
    reviews: 210,
    verificationStatus: 'verified',
    avatar: '👨‍⚕️',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM'],
    bio: 'Renowned spine and degenerative disc specialist with extensive experience in elderly mobility restoration.'
  },
  {
    id: 'doc-103',
    name: 'Dr. K. Srinivas',
    title: 'MD, DM (Cardiology), Chief Cardiologist',
    specialization: 'Cardiology',
    specialtyKey: 'cardio',
    experienceYears: 20,
    registrationNumber: 'MCI-TN-33109',
    medicalCouncil: 'Tamil Nadu Medical Council',
    hospitalId: 'hosp-1',
    hospitalName: 'City Care Multi-Specialty Hospital',
    room: 'Room 201',
    floor: '2nd Floor (Specialty Wing)',
    fee: 700,
    rating: 4.95,
    reviews: 320,
    verificationStatus: 'verified',
    avatar: '👨‍⚕️',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    bio: 'Specialist in preventive cardiology, hypertension, arrhythmia management, and heart failure care.'
  },
  {
    id: 'doc-104',
    name: 'Dr. Ananya Sharma',
    title: 'MD (Internal Medicine), Senior Consultant Physician',
    specialization: 'General Medicine',
    specialtyKey: 'general',
    experienceYears: 12,
    registrationNumber: 'MCI-DL-64219',
    medicalCouncil: 'Delhi Medical Council',
    hospitalId: 'hosp-1',
    hospitalName: 'City Care Multi-Specialty Hospital',
    room: 'Room 105',
    floor: '1st Floor (OPD)',
    fee: 400,
    rating: 4.88,
    reviews: 180,
    verificationStatus: 'verified',
    avatar: '👩‍⚕️',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['09:30 AM', '11:30 AM', '01:30 PM', '04:00 PM', '06:00 PM'],
    bio: 'Expert in diabetes mellitus, hypertension, thyroid disorders, and seasonal infectious fever management.'
  },
  {
    id: 'doc-105',
    name: 'Dr. Arvind Swamy',
    title: 'MS (Ophth), Senior Eye Surgeon',
    specialization: 'Ophthalmology',
    specialtyKey: 'eye',
    experienceYears: 15,
    registrationNumber: 'MCI-KA-55120',
    medicalCouncil: 'Karnataka Medical Council',
    hospitalId: 'hosp-1',
    hospitalName: 'City Care Multi-Specialty Hospital',
    room: 'Room 108',
    floor: '1st Floor (OPD)',
    fee: 450,
    rating: 4.78,
    reviews: 95,
    verificationStatus: 'verified',
    avatar: '👨‍⚕️',
    availableDays: ['Tue', 'Thu', 'Sat'],
    timeSlots: ['10:00 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
    bio: 'Cataract micro-incision surgery, glaucoma screening, and diabetic retinopathy care for seniors.'
  },
  {
    id: 'doc-106',
    name: 'Dr. Vikramaditya Reddy',
    title: 'DM (Neurology), Stroke & Brain Specialist',
    specialization: 'Neurology',
    specialtyKey: 'neuro',
    experienceYears: 16,
    registrationNumber: 'MCI-AP-41092',
    medicalCouncil: 'Andhra Pradesh Medical Council',
    hospitalId: 'hosp-3',
    hospitalName: 'Apollo Lifeline Cardiac & Neuro Institute',
    room: 'Room 205',
    floor: '2nd Floor (Specialty)',
    fee: 800,
    rating: 4.92,
    reviews: 160,
    verificationStatus: 'verified',
    avatar: '👨‍⚕️',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timeSlots: ['11:00 AM', '01:00 PM', '03:30 PM', '05:00 PM'],
    bio: 'Comprehensive stroke recovery, Parkinson’s tremors management, neuropathic pain, and dementia guidance.'
  },
  {
    id: 'doc-107',
    name: 'Dr. R. Meenakshi',
    title: 'MD (Geriatric Medicine)',
    specialization: 'Geriatrics & General Care',
    specialtyKey: 'general',
    experienceYears: 8,
    registrationNumber: 'MCI-TN-99201',
    medicalCouncil: 'Tamil Nadu Medical Council',
    hospitalId: 'hosp-4',
    hospitalName: 'Sanjeevani Elder Care Clinic & Daycare',
    room: 'Room 01',
    floor: 'Ground Floor',
    fee: 350,
    rating: 4.9,
    reviews: 64,
    verificationStatus: 'pending', // Pending verification for Admin review demo
    avatar: '👩‍⚕️',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM'],
    bio: 'Dedicated exclusively to elderly holistic care, polypharmacy management, and gentle lifestyle rehabilitation.'
  }
];

export const initialHospitalState = {
  isLoggedIn: true,
  currentLang: 'en',
  elderMode: false,
  audioGuideActive: true,
  currentRole: 'patient', // 'patient', 'doctor', 'admin'
  currentFloor: 'floor1', // 'ground', 'floor1', 'floor2'
  activeTab: 'home',
  hospitalName: 'City Care Multi-Specialty Hospital',
  
  // Patient Profile
  patient: {
    name: 'Mr. Ramachandran V.',
    age: 68,
    gender: 'Male',
    id: 'HD-2026-8941',
    phone: '+91 98765 43210',
    email: 'ramachandran.v@gmail.com',
    emailVerified: true,
    blood: 'O+',
    caregiver: 'Kavitha R (Daughter) - +91 98765 43210',
    chronicConditions: ['Grade 2 Knee Osteoarthritis', 'Hypertension (Mild)', 'Type 2 Diabetes'],
    allergies: ['Sulfa Drugs', 'Penicillin'],
    ayushmanLinked: true,
    schemeCardNo: 'AB-PMJAY-9841-2026'
  },

  // Active Live Appointment
  activeAppointment: {
    id: 'apt-1001',
    token: '#A-14',
    doctor: 'Dr. Rajesh Kumar',
    doctorId: 'doc-101',
    specialty: 'Orthopedics',
    treatment: 'Knee Joint Pain & Arthritis Followup',
    date: 'Today, Aug 22',
    time: '10:30 AM',
    room: 'Room 104',
    floor: '1st Floor (OPD)',
    floorKey: 'floor1',
    roomCoords: { x: 620, y: 160 },
    fee: 500,
    subsidyDiscount: 250,
    finalPrice: 250,
    status: 'Confirmed',
    patientProblem: {
      symptoms: 'Persistent swelling and stiffness in right knee, difficulty walking stairs in the morning.',
      duration: '3 Weeks',
      hasVoiceNote: true,
      attachedReports: ['Knee-XRay-AP-Lateral.pdf', 'Blood-Uric-Acid-Report.pdf']
    }
  },

  // Daily Medicines & Prescription
  medicines: [
    { id: 1, name: 'Glucosamine & Chondroitin (500mg)', timing: 'morning', timeStr: '08:30 AM', food: 'After Breakfast', days: '15 Days', taken: true, color: '#3b82f6' },
    { id: 2, name: 'Pantoprazole (40mg Antacid)', timing: 'morning', timeStr: '07:30 AM', food: 'Before Breakfast (Empty Stomach)', days: '10 Days', taken: true, color: '#10b981' },
    { id: 3, name: 'Calcium + Vitamin D3 (Calcimax)', timing: 'afternoon', timeStr: '01:30 PM', food: 'After Lunch', days: '30 Days', taken: false, color: '#f59e0b' },
    { id: 4, name: 'Paracetamol / Tramadol SOS (Pain Relief)', timing: 'afternoon', timeStr: '02:00 PM', food: 'After Lunch (Only if Severe Pain)', days: '5 Days', taken: false, color: '#ef4444' },
    { id: 5, name: 'Diacerein (50mg Joint Care)', timing: 'night', timeStr: '08:30 PM', food: 'After Dinner', days: '30 Days', taken: false, color: '#8b5cf6' }
  ],

  // Turn-by-Turn Navigation Steps
  navSteps: [
    { step: 1, text: 'From Main Entrance, walk straight 15m towards Elevator A in the Central Atrium.', audio: 'From Main Entrance, walk straight 15 meters towards Elevator A in the Central Atrium.' },
    { step: 2, text: 'Take Elevator A to the 1st Floor (OPD Wing).', audio: 'Take Elevator A to the first floor OPD Wing.' },
    { step: 3, text: 'Turn right after exiting elevator. Walk 10m to Room 104: Orthopedics (Dr. Rajesh Kumar).', audio: 'Turn right after exiting elevator. Walk 10 meters to Room 104 on your right.' }
  ],
  currentNavStepIndex: 0,

  // Doctor Console Live Queue
  doctorQueue: [
    { 
      id: 'apt-1001',
      token: '#A-14', 
      patient: 'Mr. Ramachandran V.', 
      age: 68, 
      problem: 'Severe Right Knee pain, morning joint stiffness and difficulty bending', 
      phone: '+91 98765 43210', 
      active: true,
      reports: ['Knee-XRay-AP-Lateral.pdf', 'Blood-Uric-Acid-Report.pdf']
    },
    { 
      id: 'apt-1002',
      token: '#A-15', 
      patient: 'Mrs. Meenakshi Sundaram', 
      age: 72, 
      problem: 'Lower back spine disc discomfort radiating to left hip', 
      phone: '+91 98401 23456', 
      active: false,
      reports: ['Lumbar-MRI-Scan.pdf']
    },
    { 
      id: 'apt-1003',
      token: '#A-16', 
      patient: 'Mr. Gopalakrishnan K.', 
      age: 65, 
      problem: 'Post-op right shoulder checkup & suture examination', 
      phone: '+91 94440 98765', 
      active: false,
      reports: []
    }
  ],

  diagnosis: "Grade 2 Osteoarthritis of Right Knee. Advised gentle quadriceps strengthening physiotherapy, warm water fermentation twice daily.",

  // Appointments History
  appointmentsHistory: [
    { id: 'apt-1001', token: '#A-14', doctor: 'Dr. Rajesh Kumar', specialty: 'Orthopedics', room: 'Room 104 (1st Floor)', date: 'Today, 10:30 AM', status: 'In Queue', fee: 250, prescriptionIssued: true },
    { id: 'apt-0942', token: '#B-08', doctor: 'Dr. Ananya Sharma', specialty: 'General Medicine', room: 'Room 105 (1st Floor)', date: 'Aug 10, 2026', status: 'Completed', fee: 200, prescriptionIssued: true },
    { id: 'apt-0881', token: '#C-03', doctor: 'Dr. Arvind Swamy', specialty: 'Ophthalmology', room: 'Room 108 (1st Floor)', date: 'Jul 28, 2026', status: 'Completed', fee: 225, prescriptionIssued: true }
  ],

  // Hospital-to-Home Medicine Deliveries
  deliveries: [
    {
      id: 'DEL-92041',
      orderId: 'ORD-MED-8492',
      date: 'Today, 10:45 AM',
      hospital: 'City Care Multi-Specialty Hospital',
      pharmacy: 'Jan Aushadhi Kendra (Room 004)',
      doctor: 'Dr. Rajesh Kumar',
      patient: 'Mr. Ramachandran V.',
      deliveryAddress: 'Flat 3B, Shanthi Nilayam, 14th Cross St, Indiranagar',
      phone: '+91 98765 43210',
      medicines: [
        { name: 'Glucosamine Sulfate 750mg', dosage: '1 Tab', timing: 'Morning (After Breakfast)', qty: 30 },
        { name: 'Pantoprazole 40mg', dosage: '1 Cap', timing: 'Morning (Before Breakfast)', qty: 15 },
        { name: 'Calcimax Vitamin D3', dosage: '1 Tab', timing: 'Afternoon (After Lunch)', qty: 15 },
        { name: 'Diacerein 50mg', dosage: '1 Cap', timing: 'Night (After Dinner)', qty: 20 }
      ],
      mrpTotal: 680,
      subsidyDiscount: 340, // 50% Jan Aushadhi generic discount
      finalAmount: 340,
      paymentStatus: 'Paid Online via UPI',
      status: 'out_for_delivery', // 'prescription_received' | 'pharmacy_packing' | 'out_for_delivery' | 'delivered'
      statusStep: 3,
      deliveryPartner: {
        name: 'Karthik Selvam',
        phone: '+91 98402 77112',
        vehicle: 'TVS iQube Electric (TN-07-CM-4921)',
        rating: 4.9,
        currentLocation: '2.1 km away (Approaching 14th Cross)',
        etaMinutes: 12
      },
      otp: '4829',
      timeline: [
        { step: 1, title: 'Prescription Verified', desc: 'Doctor signed digital Rx approved by Jan Aushadhi Pharmacy', time: '09:40 AM', completed: true },
        { step: 2, title: 'Packed at Pharmacy', desc: 'Verified batch and expiry at Room 004 Ground Floor', time: '10:15 AM', completed: true },
        { step: 3, title: 'Out for Delivery', desc: 'Partner Karthik Selvam dispatched parcel from hospital exit', time: '10:35 AM', completed: true },
        { step: 4, title: 'Delivered to Home', desc: 'Handover package and verify 4-digit OTP', time: 'Expected 11:00 AM', completed: false }
      ]
    }
  ],

  // Notifications
  notifications: [
    {
      id: 'notif-1',
      title: 'Appointment Confirmed (#A-14)',
      message: 'Your consultation with Dr. Rajesh Kumar is scheduled for Today at 10:30 AM in Room 104.',
      time: '10 Mins Ago',
      type: 'appointment_confirmed',
      unread: true
    },
    {
      id: 'notif-2',
      title: 'Medicine Reminder 💊',
      message: 'Time for afternoon medicines: Calcimax Vitamin D3 after lunch.',
      time: '1 Hour Ago',
      type: 'medicine_reminder',
      unread: true
    },
    {
      id: 'notif-3',
      title: 'Payment Receipt Verified (₹250)',
      message: 'Sandbox Transaction #TXN-88294 completed successfully via UPI.',
      time: '2 Hours Ago',
      type: 'payment_success',
      unread: false
    },
    {
      id: 'notif-4',
      title: 'Govt. Subsidy Applied (50%)',
      message: 'Ayushman Bharat Senior Discount applied to your OPD token.',
      time: 'Yesterday',
      type: 'scheme_applied',
      unread: false
    }
  ],

  // Payments Ledger
  payments: [
    {
      id: 'PAY-88294',
      appointmentId: 'apt-1001',
      token: '#A-14',
      patientName: 'Mr. Ramachandran V.',
      doctorName: 'Dr. Rajesh Kumar',
      amount: 250,
      originalFee: 500,
      discount: 250,
      method: 'UPI (GPay)',
      mode: 'Sandbox / Test Mode',
      status: 'Success',
      date: 'Aug 22, 2026, 09:15 AM',
      receiptNo: 'HD-RCP-2026-88294'
    },
    {
      id: 'PAY-77192',
      appointmentId: 'apt-0942',
      token: '#B-08',
      patientName: 'Mr. Ramachandran V.',
      doctorName: 'Dr. Ananya Sharma',
      amount: 200,
      originalFee: 400,
      discount: 200,
      method: 'Debit Card (Visa)',
      mode: 'Sandbox / Test Mode',
      status: 'Success',
      date: 'Aug 10, 2026, 11:20 AM',
      receiptNo: 'HD-RCP-2026-77192'
    }
  ],

  // Admin Patients Directory
  adminPatientsList: [
    { id: 'pat-1', name: 'Mr. Ramachandran V.', age: 68, gender: 'Male', phone: '+91 98765 43210', email: 'ramachandran.v@gmail.com', status: 'Active', appointmentsCount: 5, scheme: 'Ayushman Bharat' },
    { id: 'pat-2', name: 'Mrs. Meenakshi Sundaram', age: 72, gender: 'Female', phone: '+91 98401 23456', email: 'meenakshi.s@outlook.com', status: 'Active', appointmentsCount: 3, scheme: 'Senior Concession' },
    { id: 'pat-3', name: 'Mr. Gopalakrishnan K.', age: 65, gender: 'Male', phone: '+91 94440 98765', email: 'gopala.k@gmail.com', status: 'Active', appointmentsCount: 2, scheme: 'Ayushman Bharat' },
    { id: 'pat-4', name: 'Mrs. Savitri Devi', age: 70, gender: 'Female', phone: '+91 98111 22334', email: 'savitri.devi@gmail.com', status: 'Active', appointmentsCount: 1, scheme: 'Senior Concession' }
  ]
};

export const hospitalRoomsData = {
  ground: [
    { room: 'Room 001', name: 'Emergency Trauma & Triage', shortName: 'EMERGENCY ER', badgeLabel: 'EMERGENCY / ER', icon: '🚨', type: 'Emergency / 24x7', floor: 'Ground Floor', x: 220, y: 160, color: '#ef4444', image: '/assets/rooms/room_icu.jpg', doctor: 'Dr. Emergency Response Team', equipment: 'Resuscitation Kit, Oxygen Supply' },
    { room: 'Room 002', name: 'Main Reception & Help Desk', shortName: 'RECEPTION', badgeLabel: 'HELP & TOKENS', icon: '🏥', type: 'Registration & Tokens', floor: 'Ground Floor', x: 420, y: 440, color: '#0284c7', image: '/assets/hospital-bg.jpg', doctor: 'Front Desk Officers', equipment: 'Token Dispensers, Information Kiosk' },
    { room: 'Room 004', name: 'Hospital Pharmacy & Jan Aushadhi', shortName: 'PHARMACY', badgeLabel: 'JAN AUSHADHI', icon: '💊', type: 'Medicines & Dispensing', floor: 'Ground Floor', x: 620, y: 440, color: '#10b981', image: '/assets/rooms/room_normal_ward.jpg', doctor: 'Pharmacist Desk', equipment: 'Digital Rx Dispenser, Medicine Inventory' },
    { room: 'Room 007', name: 'Diagnostic Pathology Lab', shortName: 'PATH LAB', badgeLabel: 'BLOOD & TESTS', icon: '🔬', type: 'Blood, Urine & Test Scans', floor: 'Ground Floor', x: 220, y: 320, color: '#8b5cf6', image: '/assets/rooms/room_dermatology.jpg', doctor: 'Dr. Meera Nambiar', equipment: 'Automated Blood Analyzer, Centrifuge' },
    { room: 'Room 009', name: 'Radiology & X-Ray Wing', shortName: 'X-RAY & CT', badgeLabel: 'RADIOLOGY', icon: '🩻', type: 'CT Scan, MRI, X-Ray', floor: 'Ground Floor', x: 620, y: 160, color: '#f59e0b', image: '/assets/rooms/room_orthopedic.jpg', doctor: 'Dr. Arvind Swamy', equipment: 'Digital X-Ray Scanner, CT Scanner' }
  ],
  floor1: [
    { room: 'Room 101', name: 'Dr. S. Venkat (Senior Orthopedic)', shortName: 'ORTHO SPINE', badgeLabel: 'SPINE & JOINT', icon: '🦴', type: 'Joint Replacement & Spine', floor: '1st Floor (OPD)', x: 220, y: 160, color: '#1d4ed8', image: '/assets/rooms/room_orthopedic.jpg', doctor: 'Dr. S. Venkat', equipment: 'Joint Anatomy Models, Splints' },
    { room: 'Room 104', name: 'Dr. Rajesh Kumar (Orthopedics)', shortName: 'ORTHOPEDIC', badgeLabel: 'BONE & JOINT', icon: '🦴', type: 'Knee Joint Pain & Arthritis', floor: '1st Floor (OPD)', x: 620, y: 160, color: '#1d4ed8', activeTarget: true, image: '/assets/rooms/room_orthopedic.jpg', doctor: 'Dr. Rajesh Kumar', equipment: 'Digital X-Ray Panel, Knee Models' },
    { room: 'Room 105', name: 'Dr. Ananya Sharma (General Medicine)', shortName: 'GENERAL MED', badgeLabel: 'PHYSICIAN', icon: '🩺', type: 'Fever, Diabetes, BP Check', floor: '1st Floor (OPD)', x: 220, y: 320, color: '#0d9488', image: '/assets/rooms/room_normal_ward.jpg', doctor: 'Dr. Ananya Sharma', equipment: 'Stethoscope, ECG Monitor' },
    { room: 'Room 108', name: 'Dr. Arvind Swamy (Ophthalmology)', shortName: 'EYE CLINIC', badgeLabel: 'EYE & CATARACT', icon: '👁️', type: 'Cataract & Eye Care', floor: '1st Floor (OPD)', x: 620, y: 320, color: '#8b5cf6', image: '/assets/rooms/room_dermatology.jpg', doctor: 'Dr. Arvind Swamy', equipment: 'Slit Lamp, Vision Chart' },
    { room: 'Room 109', name: 'Dr. Meera Nambiar (Dental Clinic)', shortName: 'DENTAL CARE', badgeLabel: 'DENTAL', icon: '🦷', type: 'Dental Surgery & Implants', floor: '1st Floor (OPD)', x: 420, y: 460, color: '#ec4899', image: '/assets/rooms/room_dermatology.jpg', doctor: 'Dr. Meera Nambiar', equipment: 'Dental Chair, Dental X-Ray' }
  ],
  floor2: [
    { room: 'Room 201', name: 'Dr. K. Srinivas (Cardiology)', shortName: 'CARDIOLOGY', badgeLabel: 'HEART CLINIC', icon: '❤️', type: 'Heart Checkup, ECG, Echo', floor: '2nd Floor (Specialty)', x: 220, y: 160, color: '#ef4444', image: '/assets/rooms/room_cardiology.jpg', doctor: 'Dr. K. Srinivas', equipment: 'Echocardiogram, 12-Lead ECG Machine' },
    { room: 'Room 204', name: 'Dr. Preeti Deshmukh (Cardiology)', shortName: 'HEART CARE', badgeLabel: 'PREVENTIVE CARDIOLOGY', icon: '❤️', type: 'Hypertension & Heart Failure', floor: '2nd Floor (Specialty)', x: 620, y: 160, color: '#dc2626', image: '/assets/rooms/room_cardiology.jpg', doctor: 'Dr. Preeti Deshmukh', equipment: 'Holter Monitor, Defibrillator' },
    { room: 'Room 205', name: 'Dr. Vikramaditya (Neurology)', shortName: 'NEUROLOGY', badgeLabel: 'BRAIN & STROKE', icon: '🧠', type: 'Stroke, Memory & Brain Care', floor: '2nd Floor (Specialty)', x: 220, y: 320, color: '#6366f1', image: '/assets/rooms/room_icu.jpg', doctor: 'Dr. Vikramaditya', equipment: 'EEG Machine, Neuro Reflex Tester' },
    { room: 'Room 404', name: 'Intensive Care Unit (ICU)', shortName: 'ICU UNIT', badgeLabel: 'CRITICAL CARE', icon: '🚨', type: 'Critical Care & Life Support', floor: '2nd Floor (Specialty)', x: 420, y: 160, color: '#dc2626', image: '/assets/rooms/room_icu.jpg', doctor: 'Dr. Critical Care Specialist Team', equipment: 'Multipara Vital Monitors, Ventilators, Syringe Infusion Pumps' },
    { room: 'Room 208', name: 'Senior Inpatient Ward & Deluxe Rooms', shortName: 'PATIENT WARD', badgeLabel: 'GENERAL WARD', icon: '🛏️', type: 'Post-Op Recovery & Nursing', floor: '2nd Floor (Specialty)', x: 620, y: 320, color: '#10b981', image: '/assets/rooms/room_normal_ward.jpg', doctor: 'Resident Physician & Nurse', equipment: 'Adjustable Patient Bed, IV Drip Stand' }
  ],
  floor3: [
    { room: 'Room 406', name: 'Postnatal Ward 406', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 140, y: 160, color: '#f43f5e', image: '/assets/rooms/room_postnatal.jpg', doctor: 'Dr. Obstetric Specialist', equipment: 'Baby Bassinet, Mother Recovery Bed, Lactation Support' },
    { room: 'Room 407', name: 'Postnatal Ward 407', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 280, y: 160, color: '#f43f5e', image: '/assets/rooms/room_postnatal.jpg', doctor: 'Postnatal Nursing Team', equipment: 'Baby Bassinet, Electric Mother Bed' },
    { room: 'Room 408', name: 'Postnatal Ward 408', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 420, y: 160, color: '#f43f5e', image: '/assets/rooms/room_postnatal.jpg', doctor: 'Pediatric & Postnatal Nurse', equipment: 'Baby Bassinet, Vital Monitor' },
    { room: 'Room 409', name: 'Postnatal Ward 409', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 560, y: 160, color: '#f43f5e', image: '/assets/rooms/room_postnatal.jpg', doctor: 'Obstetric Care Specialist', equipment: 'Baby Bassinet, Private Deluxe Ward' },
    { room: 'Room 410', name: 'Postnatal Ward 410', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 700, y: 160, color: '#f43f5e', image: '/assets/rooms/room_postnatal.jpg', doctor: 'Maternity Care Team', equipment: 'Baby Bassinet, Mother Comfort Suite' }
  ]
};

export const healthSchemes = [
  {
    id: 'pmjay',
    name: 'Ayushman Bharat PM-JAY',
    coverage: '₹5,00,000 / Year Free Hospitalization',
    discount: '100% Cashless for Listed Procedures',
    criteria: 'SECC 2011 / Senior Citizen Golden Card Holders',
    popular: true,
    tag: 'National Health Scheme'
  },
  {
    id: 'senior-opd',
    name: 'Senior Citizen 50% OPD Subsidy',
    coverage: '50% Concession on OPD Consultation & Medicines',
    discount: 'Flat 50% OFF All Specialist Fees',
    criteria: 'Age 60 Years and Above (Valid ID Proof)',
    popular: true,
    tag: 'HeloDoc Senior Care'
  },
  {
    id: 'jan-aushadhi',
    name: 'Pradhan Mantri Jan Aushadhi Pariyojana',
    coverage: 'Generic Medicines at 50% to 90% Lower Cost',
    discount: 'Available at Hospital Ground Floor Jan Aushadhi Kendra',
    criteria: 'Open to All Patients with Valid Prescription',
    popular: false,
    tag: 'Generic Pharmacy'
  },
  {
    id: 'state-insurance',
    name: 'Chief Minister Comprehensive Health Insurance',
    coverage: 'Up to ₹5,00,000 for Critical Surgeries',
    discount: 'Full Cashless Pre & Post-Op Coverage',
    criteria: 'State Domicile & Income below ₹1,20,000/yr',
    popular: false,
    tag: 'State Govt Scheme'
  }
];

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const getSeedData = () => ({
  hospitals: [
    {
      id: 'hosp-1',
      name: 'Government Multi Super Specialty Hospital',
      type: 'Govt • Multi-Specialty Tertiary Care',
      distanceKm: 0.8,
      address: 'Omandurar Estate, Anna Salai, Chennai',
      phone: '044-25305000',
      rating: 4.8,
      reviewsCount: 1420,
      supportedSchemes: ['Ayushman Bharat PM-JAY', 'Chief Minister Insurance', 'Senior Citizen 50% OPD Subsidy'],
      hasEmergencyER: true,
      ambulanceAvailable: true,
      erBedsAvailable: 14,
      image: '/assets/hospital-bg.jpg',
      departments: ['Emergency Trauma & Triage', 'Cardiology', 'Orthopedics', 'Pathology & Diagnostics', 'Jan Aushadhi Generic Pharmacy']
    },
    {
      id: 'hosp-2',
      name: 'Apollo Specialty Hospital',
      type: 'Private • Tertiary Care & Organ Transplant',
      distanceKm: 2.3,
      address: 'Greams Lane, Thousand Lights, Chennai',
      phone: '044-28290200',
      rating: 4.9,
      reviewsCount: 3820,
      supportedSchemes: ['PM-JAY Golden Card (Empanelled)', 'Corporate Cashless TPA'],
      hasEmergencyER: true,
      ambulanceAvailable: true,
      erBedsAvailable: 8,
      image: '/assets/hospital-bg.jpg',
      departments: ['Interventional Cardiology', 'Oncology', 'Spine & Joint Replacement', '24x7 Trauma Care']
    },
    {
      id: 'hosp-3',
      name: 'MIOT International Hospital',
      type: 'Private • Joint Replacement & Trauma Care',
      distanceKm: 4.1,
      address: 'Manapakkam, Mount Poonamallee Rd, Chennai',
      phone: '044-42002288',
      rating: 4.7,
      reviewsCount: 2150,
      supportedSchemes: ['Senior Citizen OPD Subsidy', 'Govt Pensioner Scheme'],
      hasEmergencyER: true,
      ambulanceAvailable: true,
      erBedsAvailable: 6,
      image: '/assets/hospital-bg.jpg',
      departments: ['Orthopedic Surgery', 'Neuro Trauma', 'Emergency ICU']
    }
  ],
  rooms: {
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
      { room: 'Room 404', name: 'Intensive Care Unit (ICU)', shortName: 'ICU UNIT', badgeLabel: 'CRITICAL CARE', icon: '🚨', type: 'Critical Care & Life Support', floor: '2nd Floor (Specialty)', x: 420, y: 160, color: '#dc2626', isICU: true, image: '/assets/rooms/room_icu.jpg', doctor: 'Dr. Critical Care Specialist Team', equipment: 'Multipara Vital Monitors, Ventilators, Syringe Infusion Pumps' },
      { room: 'Room 208', name: 'Senior Inpatient Ward & Deluxe Rooms', shortName: 'PATIENT WARD', badgeLabel: 'GENERAL WARD', icon: '🛏️', type: 'Post-Op Recovery & Nursing', floor: '2nd Floor (Specialty)', x: 620, y: 320, color: '#10b981', image: '/assets/rooms/room_normal_ward.jpg', doctor: 'Resident Physician & Nurse', equipment: 'Adjustable Patient Bed, IV Drip Stand' }
    ],
    floor3: [
      { room: 'Room 406', name: 'Postnatal Ward 406', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 140, y: 160, color: '#f43f5e', image: '/assets/rooms/room_postnatal.jpg', doctor: 'Dr. Obstetric Specialist', equipment: 'Baby Bassinet, Mother Recovery Bed, Lactation Support' },
      { room: 'Room 407', name: 'Postnatal Ward 407', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 280, y: 160, color: '#f43f5e', image: '/assets/rooms/room_postnatal.jpg', doctor: 'Postnatal Nursing Team', equipment: 'Baby Bassinet, Electric Mother Bed' },
      { room: 'Room 408', name: 'Postnatal Ward 408', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 420, y: 160, color: '#f43f5e', image: '/assets/rooms/room_postnatal.jpg', doctor: 'Pediatric & Postnatal Nurse', equipment: 'Baby Bassinet, Vital Monitor' },
      { room: 'Room 409', name: 'Postnatal Ward 409', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 560, y: 160, color: '#f43f5e', image: '/assets/rooms/room_postnatal.jpg', doctor: 'Obstetric Care Specialist', equipment: 'Baby Bassinet, Private Deluxe Ward' },
      { room: 'Room 410', name: 'Postnatal Ward 410', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 700, y: 160, color: '#f43f5e', image: '/assets/rooms/room_postnatal.jpg', doctor: 'Maternity Care Team', equipment: 'Baby Bassinet, Mother Comfort Suite' }
    ]
  },
  doctors: [
    {
      id: 'doc-101',
      name: 'Dr. Rajesh Kumar',
      degrees: 'MBBS, MS (Ortho), Fellowship in Joint Replacement',
      specialty: 'Orthopedic Surgeon',
      experienceYears: 18,
      room: 'Room 104',
      floor: '1st Floor (OPD)',
      rating: 4.9,
      reviewsCount: 512,
      fee: 600,
      subsidyAvailable: true,
      subsidizedFee: 300,
      availableSlots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM'],
      languages: ['English', 'Tamil', 'Hindi'],
      nmcNumber: 'NMC-TN-84920'
    },
    {
      id: 'doc-102',
      name: 'Dr. K. Srinivas',
      degrees: 'MBBS, MD, DM (Cardiology), FACC',
      specialty: 'Senior Interventional Cardiologist',
      experienceYears: 24,
      room: 'Room 201',
      floor: '2nd Floor (Specialty)',
      rating: 5.0,
      reviewsCount: 840,
      fee: 800,
      subsidyAvailable: true,
      subsidizedFee: 400,
      availableSlots: ['10:00 AM', '10:30 AM', '11:15 AM', '12:00 PM', '05:00 PM'],
      languages: ['English', 'Tamil', 'Telugu'],
      nmcNumber: 'NMC-TN-62114'
    },
    {
      id: 'doc-103',
      name: 'Dr. Ananya Sharma',
      degrees: 'MBBS, MD (General Medicine)',
      specialty: 'Consultant Physician & Geriatrician',
      experienceYears: 14,
      room: 'Room 105',
      floor: '1st Floor (OPD)',
      rating: 4.8,
      reviewsCount: 390,
      fee: 500,
      subsidyAvailable: true,
      subsidizedFee: 250,
      availableSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '02:00 PM'],
      languages: ['English', 'Hindi', 'Tamil'],
      nmcNumber: 'NMC-TN-91044'
    }
  ],
  appointments: [
    {
      id: 'apt-default-1',
      token: '#A-14',
      doctor: 'Dr. Rajesh Kumar',
      doctorId: 'doc-101',
      specialty: 'Orthopedics',
      treatment: 'Knee Joint Pain & Arthritis Follow-up',
      date: 'Today, Aug 22',
      time: '10:30 AM',
      room: 'Room 104',
      floor: '1st Floor (OPD)',
      fee: 600,
      subsidyDiscount: 300,
      finalPrice: 300,
      status: 'Confirmed',
      patientProblem: {
        symptoms: 'Bilateral knee joint pain while climbing stairs, mild morning stiffness.',
        duration: '2 Months',
        hasVoiceNote: true,
        attachedReports: ['Digital_XRay_Knee_AP_LAT.pdf', 'Serum_Uric_Acid_Test.pdf']
      }
    }
  ],
  doctorQueue: [
    { id: 'q-1', token: '#A-12', patient: 'Mr. Sundaram R.', age: 66, problem: 'Post-op knee checkup', phone: '+91 98401 22334', active: false, reports: [] },
    { id: 'q-2', token: '#A-13', patient: 'Mrs. Parvathi K.', age: 71, problem: 'Osteoarthritis stiffness', phone: '+91 94440 55667', active: false, reports: ['Blood_Report.pdf'] },
    { id: 'q-3', token: '#A-14', patient: 'Mr. Ramachandran V.', age: 68, problem: 'Knee pain & stair climbing difficulty', phone: '+91 98765 43210', active: true, reports: ['XRay_Knee.pdf'] }
  ],
  medicines: [
    {
      id: 'med-1',
      name: 'Glucosamine + Diacerein (Joint Care)',
      genericName: 'Glucosamine Sulphate 750mg + Diacerein 50mg',
      category: 'Orthopedics & Joint Cartilage',
      janAushadhiPrice: 42,
      brandedMarketPrice: 280,
      savingsPercent: 85,
      dosage: '1 Tablet twice daily after meals',
      inStock: 140,
      composition: 'Glucosamine Sulphate USP 750mg + Diacerein IP 50mg',
      prescriptionRequired: true
    },
    {
      id: 'med-2',
      name: 'Paracetamol 650mg Generic IP',
      genericName: 'Paracetamol IP 650mg Fast-Action',
      category: 'Pain & Fever Relief',
      janAushadhiPrice: 12,
      brandedMarketPrice: 45,
      savingsPercent: 73,
      dosage: '1 Tablet SOS every 6 to 8 hours after food',
      inStock: 350,
      composition: 'Pure Paracetamol IP 650mg',
      prescriptionRequired: false
    },
    {
      id: 'med-3',
      name: 'Calcium Carbonate + Vitamin D3 500mg',
      genericName: 'Calcium Carbonate 1250mg eq. to 500mg + Cholecalciferol 250 IU',
      category: 'Bone Mineral & Senior Care',
      janAushadhiPrice: 28,
      brandedMarketPrice: 165,
      savingsPercent: 83,
      dosage: '1 Tablet daily after breakfast',
      inStock: 210,
      composition: 'Elemental Calcium 500mg + Vit D3 250 IU',
      prescriptionRequired: false
    },
    {
      id: 'med-4',
      name: 'Telmisartan 40mg (BP Regular)',
      genericName: 'Telmisartan IP 40mg Blood Pressure Tabs',
      category: 'Cardiovascular & Hypertension',
      janAushadhiPrice: 18,
      brandedMarketPrice: 135,
      savingsPercent: 86,
      dosage: '1 Tablet in morning before food',
      inStock: 180,
      composition: 'Telmisartan IP 40mg',
      prescriptionRequired: true
    },
    {
      id: 'med-5',
      name: 'Metformin 500mg SR (Diabetes Care)',
      genericName: 'Metformin Hydrochloride Prolonged Release 500mg',
      category: 'Endocrinology & Diabetes',
      janAushadhiPrice: 14,
      brandedMarketPrice: 78,
      savingsPercent: 82,
      dosage: '1 Tablet twice daily with meals',
      inStock: 260,
      composition: 'Metformin HCl IP 500mg SR',
      prescriptionRequired: true
    }
  ],
  orders: [
    {
      id: 'ord-101',
      orderNumber: 'HD-JAN-8942',
      items: [
        { name: 'Glucosamine + Diacerein (Joint Care)', qty: 2, unitPrice: 42 },
        { name: 'Calcium Carbonate + Vitamin D3 500mg', qty: 1, unitPrice: 28 }
      ],
      totalAmount: 112,
      savingsVsMarket: 613,
      status: 'Out for Delivery',
      deliveryOtp: '4829',
      placedDate: 'Today, 09:15 AM',
      deliveryAddress: 'Flat 3B, Sri Krishna Apts, Gandhi Road, Chennai - 600028',
      riderName: 'Murugan S.',
      riderPhone: '+91 94451 90812'
    }
  ],
  schemes: [
    {
      id: 'pmjay',
      name: 'Ayushman Bharat PM-JAY',
      coverage: '₹5,00,000 / Year Free Hospitalization',
      discount: '100% Cashless for Listed Procedures',
      criteria: 'SECC 2011 / Senior Citizen Golden Card Holders',
      tag: 'National Health Scheme'
    },
    {
      id: 'senior-opd',
      name: 'Senior Citizen 50% OPD Subsidy',
      coverage: '50% Concession on OPD Consultation & Medicines',
      discount: 'Flat 50% OFF All Specialist Fees',
      criteria: 'Age 60 Years and Above (Valid ID Proof)',
      tag: 'HeloDoc Senior Care'
    },
    {
      id: 'jan-aushadhi',
      name: 'Pradhan Mantri Jan Aushadhi Pariyojana',
      coverage: 'Generic Medicines at 50% to 90% Lower Cost',
      discount: 'Available at Hospital Ground Floor Jan Aushadhi Kendra',
      criteria: 'Open to All Patients with Valid Prescription',
      tag: 'Generic Pharmacy'
    }
  ],
  emergencyAlerts: [],
  payments: [
    {
      id: 'TXN-908123',
      appointmentId: 'apt-default-1',
      token: '#A-14',
      patientName: 'Mr. Ramachandran V.',
      doctorName: 'Dr. Rajesh Kumar',
      amount: 300,
      originalFee: 600,
      discount: 300,
      method: 'UPI AutoPay (GPay)',
      status: 'Success',
      date: 'Aug 22, 2026, 10:15 AM',
      receiptNo: 'REC-2026-0814'
    }
  ]
});

// In-memory cache synced with disk
let dbCache = null;

export const readDb = () => {
  if (dbCache) return dbCache;
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
      return dbCache;
    }
  } catch (err) {
    console.error('Error reading db.json, reinitializing seed data:', err.message);
  }

  // Seed file
  dbCache = getSeedData();
  writeDb(dbCache);
  return dbCache;
};

export const writeDb = (data) => {
  try {
    dbCache = data;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to db.json:', err.message);
    return false;
  }
};

// Collection Helper Accessors
export const getCollection = (collectionName) => {
  const db = readDb();
  return db[collectionName] || [];
};

export const updateCollection = (collectionName, updaterFn) => {
  const db = readDb();
  const current = db[collectionName] || [];
  const updated = updaterFn(current);
  db[collectionName] = updated;
  writeDb(db);
  return updated;
};

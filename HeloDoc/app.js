/**
 * HeloDoc - Smart Medical & Hospital Navigation Assistant
 * Core Application Logic, Multilingual Engine, Hospital Indoor Map Routing,
 * Doctor & Patient Synchronized Portals, and Govt Health Schemes.
 */

// ==================== STATE MANAGEMENT ====================
const state = {
  isLoggedIn: true,
  currentLang: 'en',
  elderMode: false,
  audioGuideActive: true,
  currentRole: 'patient', // 'patient' or 'doctor'
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
    blood: 'O+',
    caregiver: 'Kavitha R (Daughter) - +91 98765 43210',
    ayushmanLinked: true
  },

  // Active Live Appointment
  activeAppointment: {
    token: '#A-14',
    doctor: 'Dr. Rajesh Kumar',
    specialty: 'Orthopedics',
    treatment: 'Knee Joint Pain & Arthritis Followup',
    date: 'Today, Aug 22',
    time: '10:30 AM',
    room: 'Room 104',
    floor: '1st Floor (OPD)',
    floorKey: 'floor1',
    roomCoords: { x: 620, y: 180 },
    fee: 500,
    subsidyDiscount: 250,
    finalPrice: 250,
    status: 'Confirmed'
  },

  // Daily Medicines & Prescription
  medicines: [
    { id: 1, name: 'Glucosamine & Chondroitin (500mg)', timing: 'morning', timeStr: '08:30 AM', food: 'After Breakfast', days: '15 Days', taken: true },
    { id: 2, name: 'Pantoprazole (40mg Antacid)', timing: 'morning', timeStr: '07:30 AM', food: 'Before Breakfast', days: '10 Days', taken: true },
    { id: 3, name: 'Calcium + Vitamin D3 (Calcimax)', timing: 'afternoon', timeStr: '01:30 PM', food: 'After Lunch', days: '30 Days', taken: false },
    { id: 4, name: 'Paracetamol / Tramadol SOS (Pain Relief)', timing: 'afternoon', timeStr: '02:00 PM', food: 'After Lunch (As Needed)', days: '5 Days', taken: false },
    { id: 5, name: 'Diacerein (50mg Joint Care)', timing: 'night', timeStr: '08:30 PM', food: 'After Dinner', days: '30 Days', taken: false }
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
    { token: '#A-14', patient: 'Mr. Ramachandran V.', age: 68, problem: 'Severe Right Knee pain, morning joint stiffness', phone: '+91 98765 43210', active: true },
    { token: '#A-15', patient: 'Mrs. Meenakshi Sundaram', age: 72, problem: 'Lower back spine disc discomfort', phone: '+91 98401 23456', active: false },
    { token: '#A-16', patient: 'Mr. Gopalakrishnan K.', age: 65, problem: 'Post-op shoulder checkup', phone: '+91 94440 98765', active: false }
  ],

  // Selected Booking State
  selectedSpecialty: 'ortho',
  selectedDoctor: 'Dr. Rajesh Kumar',
  selectedApptDate: 'Today',
  selectedApptTime: '10:30 AM',
  subsidyApplied: true,
  mapZoom: 1
};

// ==================== MULTILINGUAL DICTIONARY ====================
const translations = {
  en: {
    tagline: 'Smart Medical & Hospital Care Guide',
    elderMode: 'Senior Care Mode',
    voiceGuide: 'Voice Guide',
    patientRole: 'Patient',
    doctorRole: 'Doctor',
    welcomeBack: 'Welcome,',
    askAi: 'AI Guide',
    listenPage: 'Tap to hear instructions in your language',
    liveAppointment: "Today's Appointment",
    tokenNo: 'TOKEN',
    kneeCheckup: 'Knee Joint Pain & Arthritis Followup',
    roomLabel: 'Room',
    guideMeBtn: '👉 Guide Me',
    openMapNav: 'Show Hospital Room Path',
    viewPrescription: 'Doctor Notes',
    quickServices: 'What do you need help with?',
    tapAnyService: 'Large touch buttons for easy use',
    findRoomTitle: 'Find My Room',
    findRoomDesc: "Walk step-by-step to your doctor's room",
    bookApptTitle: 'Book Appointment',
    bookApptDesc: 'Pick treatment, doctor & date to save time',
    govtSchemesTitle: 'Govt Schemes & Subsidies',
    govtSchemesDesc: 'Reduce high medical costs & claim discounts',
    myMedicinesTitle: 'My Medicines & Timings',
    myMedicinesDesc: 'Morning, Afternoon & Night pill reminder',
    aiVoiceAssistantTitle: 'Talk to AI Medical Guide',
    aiVoiceAssistantDesc: 'Speak or ask questions in your language',
    payBillTitle: 'Pay Bill & View Receipts',
    payBillDesc: 'Online UPI, card payment & scheme waiver',
    todayMeds: "Today's Medicine Schedule",
    viewFullPrescription: "View All Prescriptions & Doctors' Notes ➜",
    emergencyCaregiver: 'Primary Caregiver / Family',
    callCaregiver: 'Call',
    roomsOnFloor: 'Rooms & Services on this Floor',
    bookAppointmentHeader: 'Book Doctor & Treatment Appointment',
    saveTimeQueue: 'Select your health problem to get the right room and token',
    selectProblem: '1. What treatment or health problem do you have?',
    specOrtho: 'Bone & Joint / Ortho',
    specCardio: 'Heart / Cardiology',
    specGeneral: 'General Medicine / Fever',
    specEye: 'Eye / Ophthalmology',
    specNeuro: 'Brain / Neurology',
    specDental: 'Dental Care',
    chooseDoctor: '2. Select Available Doctor',
    chooseDateTime: '3. Select Date & Convenient Time Slot',
    applyGovtSubsidy: 'Apply Govt Scheme / Senior Concession?',
    schemeSubText: 'Ayushman Bharat or Senior Citizen 50% discount',
    confirmApptBtn: 'Confirm Appointment & Generate Token',
    myBookings: 'Your Appointments & Tokens',
    medicineReminderHeader: 'Prescriptions & Medicine Reminders',
    medicineSubHeader: 'Organized by Morning, Afternoon and Night with Food Instructions',
    listenRx: 'Listen',
    diagnosisLabel: "Doctor's Diagnosis & Care Notes:",
    morningMeds: 'Morning Medicines',
    afternoonMeds: 'Afternoon Medicines',
    nightMeds: 'Night Medicines',
    getMedicineHospital: 'Obtain Medicines from Hospital Pharmacy',
    schemesHeader: 'Government & Hospital Health Schemes',
    schemesSubHeader: 'Financial aid and subsidies to make treatments affordable for seniors',
    checkEligibilityTitle: 'Check Your Scheme Eligibility',
    checkEligibilitySub: 'Answer 2 quick questions to find maximum subsidies',
    patientAge: 'Patient Age:',
    annualIncome: 'Annual Household Income:',
    accountSecurity: 'Account Security & Verification',
    shareRecordBtn: 'Share Health Card & Records',
    paymentHistory: 'Billing & Payment Invoices',
    signOutBtn: 'Sign Out / Switch Patient',
    navHome: 'Home',
    navMap: 'Map',
    navAppt: 'Book',
    navMeds: 'Meds',
    navSchemes: 'Schemes',
    navProfile: 'Profile',
    authHeroSub: 'Your Trusted Medical & Hospital Guide',
    hospitalBranchLabel: '📍 Select Hospital Location / Branch:',
    phoneLogin: 'Phone Number',
    enterMobileNo: 'Enter 10-Digit Mobile Number:',
    sendOtpCode: 'Send Verification OTP Code',
    enterOtpPrompt: 'Enter 6-Digit Code sent via SMS:',
    verifyAndEnter: 'Verify OTP & Enter Hospital',
    googleHelper: 'Fast and verified sign-in with your official Gmail account.',
    quickSeniorLogin: '1-Tap Instant Senior Access (No Typing)'
  },
  hi: {
    tagline: 'स्मार्ट मेडिकल और अस्पताल देखभाल गाइड',
    elderMode: 'वरिष्ठ नागरिक मोड',
    voiceGuide: 'आवाज़ गाइड',
    patientRole: 'मरीज़',
    doctorRole: 'डॉक्टर',
    welcomeBack: 'स्वागत है,',
    askAi: 'एआई गाइड',
    listenPage: 'अपनी भाषा में सुनने के लिए यहाँ दबाएँ',
    liveAppointment: 'आज का अपॉइंटमेंट',
    tokenNo: 'टोकन',
    kneeCheckup: 'घुटने के दर्द और गठिया की जाँच',
    roomLabel: 'कमरा',
    guideMeBtn: '👉 रास्ता दिखाएँ',
    openMapNav: 'कमरे का रास्ता देखें',
    viewPrescription: 'डॉक्टर पर्ची',
    quickServices: 'आपको क्या सहायता चाहिए?',
    tapAnyService: 'आसान उपयोग के लिए बड़े टच बटन',
    findRoomTitle: 'अपना कमरा खोजें',
    findRoomDesc: 'डॉक्टर के कमरे तक कदम-दर-कदम मार्गदर्शन',
    bookApptTitle: 'अपॉइंटमेंट बुक करें',
    bookApptDesc: 'समय बचाने के लिए डॉक्टर और समय चुनें',
    govtSchemesTitle: 'सरकारी योजनाएं और छूट',
    govtSchemesDesc: 'महंगे इलाज पर छूट और सब्सिडी पाएं',
    myMedicinesTitle: 'मेरी दवाइयां और समय',
    myMedicinesDesc: 'सुबह, दोपहर और रात की दवा याद दिलाना',
    aiVoiceAssistantTitle: 'एआई मेडिकल गाइड से बात करें',
    aiVoiceAssistantDesc: 'अपनी भाषा में बोलें या प्रश्न पूछें',
    payBillTitle: 'बिल भुगतान और रसीद',
    payBillDesc: 'ऑनलाइन यूपीआई, कार्ड भुगतान और सरकारी छूट',
    todayMeds: 'आज की दवाओं का समय',
    viewFullPrescription: 'सभी पर्चियां और डॉक्टर सलाह देखें ➜',
    emergencyCaregiver: 'परिवार / देखभालकर्ता',
    callCaregiver: 'कॉल करें',
    roomsOnFloor: 'इस मंजिल के कमरे और सेवाएं',
    bookAppointmentHeader: 'डॉक्टर अपॉइंटमेंट बुक करें',
    saveTimeQueue: 'सही कमरा और टोकन पाने के लिए अपनी समस्या चुनें',
    selectProblem: '1. आपकी स्वास्थ्य समस्या क्या है?',
    specOrtho: 'हड्डी और जोड़ / ऑर्थो',
    specCardio: 'दिल / कार्डियोलॉजी',
    specGeneral: 'सामान्य चिकित्सा / बुखार',
    specEye: 'आँख / नेत्र रोग',
    specNeuro: 'दिमाग / न्यूरोलॉजी',
    specDental: 'दांतों की देखभाल',
    chooseDoctor: '2. डॉक्टर का चयन करें',
    chooseDateTime: '3. तिथि और समय चुनें',
    applyGovtSubsidy: 'सरकारी योजना / वरिष्ठ छूट लागू करें?',
    schemeSubText: 'आयुष्मान भारत या वरिष्ठ नागरिक 50% छूट',
    confirmApptBtn: 'अपॉइंटमेंट पक्का करें और टोकन पाएं',
    myBookings: 'आपके अपॉइंटमेंट और टोकन',
    medicineReminderHeader: 'दवाइयां और समय सारणी',
    medicineSubHeader: 'सुबह, दोपहर और रात के अनुसार व्यवस्थित',
    listenRx: 'सुनें',
    diagnosisLabel: 'डॉक्टर की सलाह और निदान:',
    morningMeds: 'सुबह की दवाएं',
    afternoonMeds: 'दोपहर की दवाएं',
    nightMeds: 'रात की दवाएं',
    getMedicineHospital: 'अस्पताल फार्मेसी से दवाएं प्राप्त करें',
    schemesHeader: 'सरकारी और अस्पताल स्वास्थ्य योजनाएं',
    schemesSubHeader: 'इलाज को किफायती बनाने के लिए वित्तीय सहायता',
    checkEligibilityTitle: 'योजना पात्रता जाँचें',
    checkEligibilitySub: 'अधिकतम छूट पाने के लिए 2 आसान प्रश्नों के उत्तर दें',
    patientAge: 'मरीज़ की उम्र:',
    annualIncome: 'वार्षिक पारिवारिक आय:',
    accountSecurity: 'खाता सुरक्षा और सत्यापन',
    shareRecordBtn: 'हेल्थ कार्ड और रिकॉर्ड साझा करें',
    paymentHistory: 'भुगतान और रसीदें',
    signOutBtn: 'लॉग आउट / मरीज़ बदलें',
    navHome: 'होम',
    navMap: 'नक्शा',
    navAppt: 'बुकिंग',
    navMeds: 'दवा',
    navSchemes: 'योजनाएं',
    navProfile: 'प्रोफाइल',
    authHeroSub: 'आपका भरोसेमंद अस्पताल गाइड',
    hospitalBranchLabel: '📍 अस्पताल का चयन करें:',
    phoneLogin: 'फ़ोन नंबर',
    enterMobileNo: '10 अंकों का मोबाइल नंबर दर्ज करें:',
    sendOtpCode: 'सत्यापन ओटीपी भेजें',
    enterOtpPrompt: 'एसएमएस से प्राप्त 6 अंकों का कोड दर्ज करें:',
    verifyAndEnter: 'ओटीपी सत्यापित करें और प्रवेश करें',
    googleHelper: 'अपने जीमेल खाते से त्वरित सत्यापन।',
    quickSeniorLogin: '1-टैप त्वरित वरिष्ठ प्रवेश (टाइपिंग की ज़रूरत नहीं)'
  },
  ta: {
    tagline: 'மருத்துவமனை மற்றும் வழிகாட்டி செயலி',
    elderMode: 'முதியோர் பராமரிப்பு முறை',
    voiceGuide: 'குரல் வழிகாட்டி',
    patientRole: 'நோயாளி',
    doctorRole: 'மருத்துவர்',
    welcomeBack: 'வணக்கம்,',
    askAi: 'ஏஐ வழிகாட்டி',
    listenPage: 'உங்கள் மொழியில் கேட்க இங்கே தொடவும்',
    liveAppointment: 'இன்றைய முன்பதிவு',
    tokenNo: 'டோக்கன்',
    kneeCheckup: 'முழங்கால் மூட்டு வலி சிகிச்சை',
    roomLabel: 'அறை',
    guideMeBtn: '👉 வழி காட்டு',
    openMapNav: 'அறைக்கு செல்லும் பாதை',
    viewPrescription: 'மருந்து சீட்டு',
    quickServices: 'உங்களுக்கு என்ன உதவி வேண்டும்?',
    tapAnyService: 'எளிதாக பயன்படுத்த பெரிய பொத்தான்கள்',
    findRoomTitle: 'என் அறையைக் கண்டுபிடி',
    findRoomDesc: 'மருத்துவர் அறைக்கு படிப்படியான வழி',
    bookApptTitle: 'முன்பதிவு செய்ய',
    bookApptDesc: 'நேரத்தை மிச்சப்படுத்த மருத்துவரை தேர்வு செய்யவும்',
    govtSchemesTitle: 'அரசு திட்டங்கள் & சலுகை',
    govtSchemesDesc: 'மருத்துவ செலவை குறைக்க 50% சலுகை',
    myMedicinesTitle: 'என் மருந்துகள் & நேரம்',
    myMedicinesDesc: 'காலை, மதியம், இரவு மாத்திரை நினைவூட்டல்',
    aiVoiceAssistantTitle: 'ஏஐ மருத்துவ வழிகாட்டியுடன் பேசுங்கள்',
    aiVoiceAssistantDesc: 'தமிழில் பேசி உங்கள் சந்தேகங்களை கேளுங்கள்',
    payBillTitle: 'கட்டணம் & ரசீது',
    payBillDesc: 'யுபிஐ, அட்டை மற்றும் அரசு திட்ட தள்ளுபடி',
    todayMeds: 'இன்றைய மாத்திரை நேரம்',
    viewFullPrescription: 'அனைத்து மருந்து விவரங்களையும் பார்க்க ➜',
    emergencyCaregiver: 'குடும்பத்தினர் / மகள்',
    callCaregiver: 'அழை',
    roomsOnFloor: 'இந்த தளத்தில் உள்ள அறைகள்',
    bookAppointmentHeader: 'மருத்துவர் முன்பதிவு',
    saveTimeQueue: 'சரியான அறை மற்றும் டோக்கன் பெற சிக்கலைத் தேர்ந்தெடுக்கவும்',
    selectProblem: '1. உங்கள் உடல்நலப் பிரச்சனை என்ன?',
    specOrtho: 'எலும்பு மற்றும் மூட்டு / ஆர்த்தோ',
    specCardio: 'இதயம் / கார்டியாலஜி',
    specGeneral: 'பொது மருத்துவம் / காய்ச்சல்',
    specEye: 'கண் மருத்துவம்',
    specNeuro: 'மூளை / நரம்பியல்',
    specDental: 'பல் மருத்துவம்',
    chooseDoctor: '2. மருத்துவரைத் தேர்ந்தெடுக்கவும்',
    chooseDateTime: '3. தேதி & நேரத்தைத் தேர்ந்தெடுக்கவும்',
    applyGovtSubsidy: 'அரசு திட்டம் / முதியோர் தள்ளுபடி பெறவா?',
    schemeSubText: 'ஆயுஷ்மான் பாரத் அல்லது முதியோர் 50% தள்ளுபடி',
    confirmApptBtn: 'முன்பதிவு செய்து டோக்கன் பெறுக',
    myBookings: 'உங்கள் முன்பதிவுகள்',
    medicineReminderHeader: 'மருந்துகள் & நினைவூட்டல்',
    medicineSubHeader: 'காலை, மதியம் மற்றும் இரவு உணவிற்கு முன்/பின்',
    listenRx: 'கேட்க',
    diagnosisLabel: 'மருத்துவர் குறிப்பு & ஆலோசனை:',
    morningMeds: 'காலை மருந்துகள்',
    afternoonMeds: 'மதிய மருந்துகள்',
    nightMeds: 'இரவு மருந்துகள்',
    getMedicineHospital: 'மருத்துவமனை மருந்தகத்தில் மாத்திரைகள் பெறவும்',
    schemesHeader: 'அரசு மற்றும் மருத்துவமனை திட்டங்கள்',
    schemesSubHeader: 'முதியோர்களுக்கான இலவச சிகிச்சை மற்றும் சலுகைகள்',
    checkEligibilityTitle: 'திட்ட தகுதியை சரிபார்க்கவும்',
    checkEligibilitySub: 'அதிகபட்ச சலுகை பெற 2 கேள்விகளுக்கு பதிலளிக்கவும்',
    patientAge: 'நோயாளி வயது:',
    annualIncome: 'ஆண்டு வருமானம்:',
    accountSecurity: 'கணக்கு பாதுகாப்பு',
    shareRecordBtn: 'மருத்துவ அட்டையை பகிரவும்',
    paymentHistory: 'கட்டண ரசீதுகள்',
    signOutBtn: 'வெளியேறு / கணக்கை மாற்று',
    navHome: 'முகப்பு',
    navMap: 'வரைபடம்',
    navAppt: 'பதிவு',
    navMeds: 'மருந்து',
    navSchemes: 'திட்டம்',
    navProfile: 'சுயவிவரம்',
    authHeroSub: 'உங்கள் நம்பகமான மருத்துவமனை வழிகாட்டி',
    hospitalBranchLabel: '📍 மருத்துவமனையை தேர்வு செய்யவும்:',
    phoneLogin: 'தொலைபேசி எண்',
    enterMobileNo: '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்:',
    sendOtpCode: 'சரிபார்ப்பு குறியீடு (OTP) அனுப்புக',
    enterOtpPrompt: 'எஸ்எம்எஸ் குறியீட்டை உள்ளிடவும்:',
    verifyAndEnter: 'சரிபார்த்து நுழையவும்',
    googleHelper: 'உங்கள் ஜிமெயில் மூலம் எளிதாக நுழையுங்கள்.',
    quickSeniorLogin: '1-தட்டு உடனடி முதியோர் நுழைவு (எழுத தேவையில்லை)'
  },
  te: {
    tagline: 'స్మార్ట్ మెడికల్ & హాస్పిటల్ గైడ్',
    elderMode: 'సీనియర్ సిటిజన్ మోడ్',
    voiceGuide: 'వాయిస్ గైడ్',
    patientRole: 'రోగి',
    doctorRole: 'వైద్యుడు',
    welcomeBack: 'స్వాగతం,',
    askAi: 'ఏఐ గైడ్',
    listenPage: 'మీ భాషలో వినడానికి ఇక్కడ నొక్కండి',
    liveAppointment: 'నేటి అపాయింట్‌మెంట్',
    tokenNo: 'టోకెన్',
    kneeCheckup: 'మోకాలి నొప్పులు & కీళ్ళ వాతం పరీక్ష',
    roomLabel: 'గది',
    guideMeBtn: '👉 దారి చూపించు',
    openMapNav: 'గదికి వెళ్లే మార్గం',
    viewPrescription: 'వైద్యుల ప్రిస్క్రిప్షన్',
    quickServices: 'మీకు ఎలాంటి సహాయం కావాలి?',
    tapAnyService: 'సులువుగా వాడటానికి పెద్ద బటన్లు',
    findRoomTitle: 'నా గదిని కనుగొనండి',
    findRoomDesc: 'వైద్యుల గదికి అడుగుల మార్గదర్శకత్వం',
    bookApptTitle: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    bookApptDesc: 'సమయం ఆదా చేయడానికి వైద్యుడిని ఎంచుకోండి',
    govtSchemesTitle: 'ప్రభుత్వ పథకాలు & రాయితీలు',
    govtSchemesDesc: 'వైద్య ఖర్చులను తగ్గించడానికి 50% రాయితీ',
    myMedicinesTitle: 'నా మందులు & సమయాలు',
    myMedicinesDesc: 'ఉదయం, మధ్యాహ్నం, రాత్రి మాత్రల రిమైండర్',
    aiVoiceAssistantTitle: 'ఏఐ మెడికల్ గైడ్‌తో మాట్లాడండి',
    aiVoiceAssistantDesc: 'మీ భాషలో మాట్లాడి ప్రశ్నలు అడగండి',
    payBillTitle: 'బిల్లు చెల్లింపు & రసీదు',
    payBillDesc: 'ఆన్‌లైన్ యూపీఐ మరియు పథకాల రాయితీ',
    todayMeds: 'నేటి మందుల సమయ పట్టిక',
    viewFullPrescription: 'అన్ని ప్రిస్క్రిప్షన్లను చూడండి ➜',
    emergencyCaregiver: 'కుటుంబ సభ్యులు / కుమార్తె',
    callCaregiver: 'కాల్',
    roomsOnFloor: 'ఈ అంతస్తులోని గదులు',
    bookAppointmentHeader: 'అపాయింట్‌మెంట్ బుకింగ్',
    saveTimeQueue: 'సరైన గది మరియు టోకెన్ కోసం సమస్యను ఎంచుకోండి',
    selectProblem: '1. మీ ఆరోగ్య సమస్య ఏమిటి?',
    specOrtho: 'ఎముకలు & కీళ్ళు / ఆర్థో',
    specCardio: 'గుండె / కార్డియాలజీ',
    specGeneral: 'జనరల్ మెడిసిన్ / జ్వరం',
    specEye: 'కంటి వైద్యం',
    specNeuro: 'మెదడు / న్యూరాలజీ',
    specDental: 'దంత సంరక్షణ',
    chooseDoctor: '2. వైద్యుడిని ఎంచుకోండి',
    chooseDateTime: '3. తేదీ & సమయం ఎంచుకోండి',
    applyGovtSubsidy: 'ప్రభుత్వ పథకం / సీనియర్ రాయితీ వర్తింపజేయాలా?',
    schemeSubText: 'ఆయుష్మాన్ భారత్ లేదా సీనియర్ సిటిజన్ 50% తగ్గింపు',
    confirmApptBtn: 'నిర్ధారించి టోకెన్ పొందండి',
    myBookings: 'మీ బుకింగ్స్ & టోకెన్లు',
    medicineReminderHeader: 'మందులు & రిమైండర్లు',
    medicineSubHeader: 'ఉదయం, మధ్యాహ్నం మరియు రాత్రి భోజనానికి ముందు/తర్వాత',
    listenRx: 'వినండి',
    diagnosisLabel: 'వైద్యుల సలహా & రోగ నిర్ధారణ:',
    morningMeds: 'ఉదయం మందులు',
    afternoonMeds: 'మధ్యాహ్నం మందులు',
    nightMeds: 'రాత్రి మందులు',
    getMedicineHospital: 'హాస్పిటల్ ఫార్మసీ నుండి మందులు పొందండి',
    schemesHeader: 'ప్రభుత్వ & హాస్పిటల్ పథకాలు',
    schemesSubHeader: 'ఖర్చు తగ్గించడానికి ఆర్థిక సహాయం',
    checkEligibilityTitle: 'పథకం అర్హతను తనిఖీ చేయండి',
    checkEligibilitySub: 'రాయితీ కోసం 2 ప్రశ్నలకు సమాధానం ఇవ్వండి',
    patientAge: 'రోగి వయస్సు:',
    annualIncome: 'వార్షిక ఆదాయం:',
    accountSecurity: 'ఖాతా భద్రత',
    shareRecordBtn: 'హెల్త్ కార్డును పంచుకోండి',
    paymentHistory: 'చెల్లింపు రసీదులు',
    signOutBtn: 'లాగ్ అవుట్ / మార్చండి',
    navHome: 'హోమ్',
    navMap: 'మ్యాప్',
    navAppt: 'బుక్',
    navMeds: 'మందులు',
    navSchemes: 'పథకాలు',
    navProfile: 'ప్రొఫైల్',
    authHeroSub: 'మీ నమ్మకమైన హాస్పిటల్ గైడ్',
    hospitalBranchLabel: '📍 హాస్పిటల్‌ను ఎంచుకోండి:',
    phoneLogin: 'ఫోన్ నంబర్',
    enterMobileNo: '10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి:',
    sendOtpCode: 'ఓటీపీని పంపండి',
    enterOtpPrompt: 'ఎస్ఎంఎస్ కోడ్ నమోదు చేయండి:',
    verifyAndEnter: 'ధృవీకరించి ప్రవేశించండి',
    googleHelper: 'మీ జీమెయిల్‌తో త్వరగా లాగిన్ అవ్వండి.',
    quickSeniorLogin: '1-ట్యాప్ తక్షణ సీనియర్ ప్రవేశం'
  },
  ml: {
    tagline: 'സ്മാർട്ട് മെഡിക്കൽ & ഹോസ്പിറ്റൽ ഗൈഡ്',
    elderMode: 'മുതിർന്ന പൗരന്മാർക്കുള്ള മോഡ്',
    voiceGuide: 'വോയ്‌സ് ഗൈഡ്',
    patientRole: 'രോഗി',
    doctorRole: 'ഡോക്ടർ',
    welcomeBack: 'സ്വാഗതം,',
    askAi: 'എഐ ഗൈഡ്',
    listenPage: 'നിങ്ങളുടെ ഭാഷയിൽ കേൾക്കാൻ ഇവിടെ അമർത്തുക',
    liveAppointment: 'ഇന്നത്തെ അപ്പോയിന്റ്മെന്റ്',
    tokenNo: 'ടോക്കൺ',
    kneeCheckup: 'മുട്ടുവേദന പരിശോധന',
    roomLabel: 'മുറി',
    guideMeBtn: '👉 വഴി കാണിക്കുക',
    openMapNav: 'മുറിയിലേക്കുള്ള വഴി',
    viewPrescription: 'ഡോക്ടർ കുറിപ്പടി',
    quickServices: 'നിങ്ങൾക്ക് എന്താണ് സഹായം വേണ്ടത്?',
    tapAnyService: 'ഉപയോഗിക്കാൻ എളുപ്പമുള്ള വലിയ ബട്ടണുകൾ',
    findRoomTitle: 'മുറി കണ്ടെത്തുക',
    findRoomDesc: 'ഡോക്ടറുടെ മുറിയിലേക്കുള്ള വഴി',
    bookApptTitle: 'അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക',
    bookApptDesc: 'ഡോക്ടറെയും സമയത്തെയും തിരഞ്ഞെടുക്കുക',
    govtSchemesTitle: 'സർക്കാർ പദ്ധതികൾ & ആനുകൂല്യങ്ങൾ',
    govtSchemesDesc: 'ചികിത്സാ ചിലവ് കുറയ്ക്കാൻ 50% ഇളവ്',
    myMedicinesTitle: 'എന്റെ മരുന്നുകളും സമയവും',
    myMedicinesDesc: 'രാവിലെ, ഉച്ചയ്ക്ക്, രാത്രി മരുന്ന് ഓർമ്മപ്പെടുത്തൽ',
    aiVoiceAssistantTitle: 'എഐ മെഡിക്കൽ ഗൈഡുമായി സംസാരിക്കുക',
    aiVoiceAssistantDesc: 'നിങ്ങളുടെ ഭാഷയിൽ ചോദിക്കുക',
    payBillTitle: 'ബിൽ അടയ്ക്കൽ & രസീത്',
    payBillDesc: 'ഓൺലൈൻ യുപിഐ, കാർഡ് പേയ്‌മെന്റ്',
    todayMeds: 'ഇന്നത്തെ മരുന്ന് സമയം',
    viewFullPrescription: 'മുഴുവൻ കുറിപ്പടിയും കാണുക ➜',
    emergencyCaregiver: 'കുടുംബം / മകൾ',
    callCaregiver: 'വിളിക്കുക',
    roomsOnFloor: 'ഈ നിലയിലെ മുറികൾ',
    bookAppointmentHeader: 'ഡോക്ടർ ബുക്കിംഗ്',
    saveTimeQueue: 'ശരിയായ മുറിയും ടോക്കണും ലഭിക്കാൻ ബുക്ക് ചെയ്യുക',
    selectProblem: '1. നിങ്ങളുടെ പ്രശ്നം എന്താണ്?',
    specOrtho: 'എല്ല് & സന്ധി / ഓർത്തോ',
    specCardio: 'ഹൃദയം / കാർഡിയോളജി',
    specGeneral: 'ജനറൽ മെഡിസിൻ / പനി',
    specEye: 'കണ്ണ് പരിശോധന',
    specNeuro: 'തലച്ചോറ് / ന്യൂറോളജി',
    specDental: 'ദന്തചികിത്സ',
    chooseDoctor: '2. ഡോക്ടറെ തിരഞ്ഞെടുക്കുക',
    chooseDateTime: '3. തീയതിയും സമയവും തിരഞ്ഞെടുക്കുക',
    applyGovtSubsidy: 'സർക്കാർ പദ്ധതി ഇളവ് വേണമെന്നുണ്ടോ?',
    schemeSubText: 'ആയുഷ്മാൻ ഭാരത് 50% ഇളവ്',
    confirmApptBtn: 'ടോക്കൺ നേടുക',
    myBookings: 'നിങ്ങളുടെ ബുക്കിംഗുകൾ',
    medicineReminderHeader: 'മരുന്നുകൾ & ഓർമ്മപ്പെടുത്തൽ',
    medicineSubHeader: 'ഭക്ഷണത്തിന് മുൻപും ശേഷവും',
    listenRx: 'കേൾക്കുക',
    diagnosisLabel: 'ഡോക്ടറുടെ നിർദ്ദേശം:',
    morningMeds: 'രാവിലത്തെ മരുന്നുകൾ',
    afternoonMeds: 'ഉച്ചയ്ക്കത്തെ മരുന്നുകൾ',
    nightMeds: 'രാത്രിയിലെ മരുന്നുകൾ',
    getMedicineHospital: 'ഫാർമസിയിൽ നിന്ന് മരുന്നുകൾ വാങ്ങുക',
    schemesHeader: 'സർക്കാർ ആരോഗ്യ പദ്ധതികൾ',
    schemesSubHeader: 'ചികിത്സ ചിലവ് കുറയ്ക്കാനുള്ള സഹായം',
    checkEligibilityTitle: 'പദ്ധതി യോഗ്യത പരിശോധിക്കുക',
    checkEligibilitySub: '2 ലളിതമായ ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുക',
    patientAge: 'രോഗിയുടെ പ്രായം:',
    annualIncome: 'വാർഷിക വരുമാനം:',
    accountSecurity: 'സുരക്ഷ',
    shareRecordBtn: 'ഹെൽത്ത് കാർഡ് പങ്കിടുക',
    paymentHistory: 'രസീതുകൾ',
    signOutBtn: 'ലോഗ് ഔട്ട്',
    navHome: 'ഹോം',
    navMap: 'മാപ്പ്',
    navAppt: 'ബുക്കിംഗ്',
    navMeds: 'മരുന്ന്',
    navSchemes: 'പദ്ധതികൾ',
    navProfile: 'പ്രൊഫൈൽ',
    authHeroSub: 'നിങ്ങളുടെ വിശ്വസ്ത ആശുപത്രി ഗൈഡ്',
    hospitalBranchLabel: '📍 ആശുപത്രി തിരഞ്ഞെടുക്കുക:',
    phoneLogin: 'ഫോൺ നമ്പർ',
    enterMobileNo: 'മൊബൈൽ നമ്പർ നൽകുക:',
    sendOtpCode: 'ഒടിപി അയക്കുക',
    enterOtpPrompt: 'എസ്എംഎസ് കോഡ് നൽകുക:',
    verifyAndEnter: 'സ്ഥിരീകരിക്കുക',
    googleHelper: 'ജിമെയിൽ ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക.',
    quickSeniorLogin: '1-ടാപ്പ് ദ്രുത പ്രവേശനം'
  },
  es: {
    tagline: 'Guía Inteligente de Atención Médica y Hospitalaria',
    elderMode: 'Modo Adulto Mayor',
    voiceGuide: 'Guía de Voz',
    patientRole: 'Paciente',
    doctorRole: 'Médico',
    welcomeBack: 'Bienvenido,',
    askAi: 'Guía IA',
    listenPage: 'Toque para escuchar en su idioma',
    liveAppointment: 'Cita de Hoy',
    tokenNo: 'FICHA',
    kneeCheckup: 'Control de Dolor de Rodilla y Artritis',
    roomLabel: 'Sala',
    guideMeBtn: '👉 Guiarme',
    openMapNav: 'Mostrar Ruta a la Sala',
    viewPrescription: 'Notas Médicas',
    quickServices: '¿En qué necesita ayuda?',
    tapAnyService: 'Botones grandes para fácil uso',
    findRoomTitle: 'Buscar Mi Sala',
    findRoomDesc: 'Camine paso a paso hasta su médico',
    bookApptTitle: 'Reservar Cita',
    bookApptDesc: 'Elija tratamiento, médico y hora',
    govtSchemesTitle: 'Subsidios y Convenios',
    govtSchemesDesc: 'Reduzca costos médicos con descuentos',
    myMedicinesTitle: 'Mis Medicinas y Horarios',
    myMedicinesDesc: 'Recordatorio mañana, tarde y noche',
    aiVoiceAssistantTitle: 'Hablar con Guía Médico IA',
    aiVoiceAssistantDesc: 'Hable o pregunte en su idioma',
    payBillTitle: 'Pagar Cuenta y Recibos',
    payBillDesc: 'Pago en línea y subsidios de salud',
    todayMeds: 'Horario de Medicinas de Hoy',
    viewFullPrescription: 'Ver Todas las Recetas ➜',
    emergencyCaregiver: 'Contacto Familiar / Hija',
    callCaregiver: 'Llamar',
    roomsOnFloor: 'Salas y Servicios en este Piso',
    bookAppointmentHeader: 'Reservar Cita Médica',
    saveTimeQueue: 'Seleccione su problema para obtener sala y ficha',
    selectProblem: '1. ¿Cuál es su problema de salud?',
    specOrtho: 'Huesos y Articulaciones / Ortopedia',
    specCardio: 'Corazón / Cardiología',
    specGeneral: 'Medicina General / Fiebre',
    specEye: 'Ojos / Oftalmología',
    specNeuro: 'Cerebro / Neurología',
    specDental: 'Cuidado Dental',
    chooseDoctor: '2. Seleccionar Médico Disponible',
    chooseDateTime: '3. Seleccionar Fecha y Hora',
    applyGovtSubsidy: '¿Aplicar Subsidio de Adulto Mayor?',
    schemeSubText: 'Descuento del 50% para adultos mayores',
    confirmApptBtn: 'Confirmar Cita y Generar Ficha',
    myBookings: 'Sus Citas y Fichas',
    medicineReminderHeader: 'Recetas y Recordatorios',
    medicineSubHeader: 'Organizado por Mañana, Tarde y Noche con Alimentos',
    listenRx: 'Escuchar',
    diagnosisLabel: 'Diagnóstico y Cuidados del Médico:',
    morningMeds: 'Medicinas de la Mañana',
    afternoonMeds: 'Medicinas de la Tarde',
    nightMeds: 'Medicinas de la Noche',
    getMedicineHospital: 'Obtener Medicinas en Farmacia',
    schemesHeader: 'Planes de Salud y Subsidios',
    schemesSubHeader: 'Ayuda financiera para tratamientos asequibles',
    checkEligibilityTitle: 'Verificar Elegibilidad',
    checkEligibilitySub: 'Responda 2 preguntas para ver subsidios',
    patientAge: 'Edad del Paciente:',
    annualIncome: 'Ingreso Anual:',
    accountSecurity: 'Seguridad de la Cuenta',
    shareRecordBtn: 'Compartir Ficha Médica',
    paymentHistory: 'Facturas y Pagos',
    signOutBtn: 'Cerrar Sesión / Cambiar',
    navHome: 'Inicio',
    navMap: 'Mapa',
    navAppt: 'Citas',
    navMeds: 'Medicinas',
    navSchemes: 'Planes',
    navProfile: 'Perfil',
    authHeroSub: 'Su Guía Hospitalaria de Confianza',
    hospitalBranchLabel: '📍 Seleccionar Hospital / Sucursal:',
    phoneLogin: 'Número Telefónico',
    enterMobileNo: 'Ingrese número móvil:',
    sendOtpCode: 'Enviar Código de Verificación',
    enterOtpPrompt: 'Ingrese código SMS de 6 dígitos:',
    verifyAndEnter: 'Verificar e Ingresar al Hospital',
    googleHelper: 'Inicio de sesión rápido con Gmail.',
    quickSeniorLogin: 'Acceso Directo para Adultos Mayores (Sin Escribir)'
  }
};

// ==================== HOSPITAL ROOMS & BLUEPRINT DATABASE ====================
const hospitalRoomsData = {
  ground: [
    { room: 'Room 001', name: 'Emergency Trauma & Triage', shortName: 'EMERGENCY ER', badgeLabel: 'EMERGENCY / ER', icon: '🚨', type: 'Emergency / 24x7', floor: 'Ground Floor', x: 220, y: 160, color: '#ef4444', image: 'assets/rooms/room_icu.jpg', doctor: 'Dr. Emergency Response Team', equipment: 'Resuscitation Kit, Oxygen Supply' },
    { room: 'Room 002', name: 'Main Reception & Help Desk', shortName: 'RECEPTION', badgeLabel: 'HELP & TOKENS', icon: '🏥', type: 'Registration & Tokens', floor: 'Ground Floor', x: 420, y: 440, color: '#0284c7', image: 'assets/hospital-bg.jpg', doctor: 'Front Desk Officers', equipment: 'Token Dispensers, Information Kiosk' },
    { room: 'Room 004', name: 'Hospital Pharmacy & Jan Aushadhi', shortName: 'PHARMACY', badgeLabel: 'JAN AUSHADHI', icon: '💊', type: 'Medicines & Dispensing', floor: 'Ground Floor', x: 620, y: 440, color: '#10b981', image: 'assets/rooms/room_normal_ward.jpg', doctor: 'Pharmacist Desk', equipment: 'Digital Rx Dispenser, Medicine Inventory' },
    { room: 'Room 007', name: 'Diagnostic Pathology Lab', shortName: 'PATH LAB', badgeLabel: 'BLOOD & TESTS', icon: '🔬', type: 'Blood & Sample Tests', floor: 'Ground Floor', x: 220, y: 320, color: '#8b5cf6', image: 'assets/rooms/room_dermatology.jpg', doctor: 'Pathology Specialists', equipment: 'Automated Blood Analyzer, Centrifuge' },
    { room: 'Room 009', name: 'Radiology & X-Ray Wing', shortName: 'X-RAY & CT', badgeLabel: 'RADIOLOGY', icon: '🩻', type: 'CT Scan & X-Ray', floor: 'Ground Floor', x: 620, y: 160, color: '#f59e0b', image: 'assets/rooms/room_orthopedic.jpg', doctor: 'Dr. Radiology Team', equipment: 'Digital X-Ray Scanner, CT Scanner' }
  ],
  floor1: [
    { room: 'Room 401', name: 'Dermatologist Clinic', shortName: 'DERMATOLOGY', badgeLabel: 'SKIN CLINIC', icon: '🧴', type: 'Skin, Hair & Cosmetic Dermatology', floor: '1st Floor (OPD)', x: 200, y: 160, color: '#ec4899', image: 'assets/rooms/room_dermatology.jpg', doctor: 'Dr. Priya Ramesh (Dermatologist)', equipment: 'Dermatoscope, Laser Skin Scanner, Examination Couch' },
    { room: 'Room 402', name: 'Cardiologist Clinic', shortName: 'CARDIOLOGY', badgeLabel: 'HEART & ECG', icon: '❤️', type: 'Heart Checkup, ECG & Echo', floor: '1st Floor (OPD)', x: 440, y: 160, color: '#ef4444', image: 'assets/rooms/room_cardiology.jpg', doctor: 'Dr. K. Srinivas (Cardiologist)', equipment: 'Echocardiogram, 12-Lead ECG Machine, BP Monitor' },
    { room: 'Room 403', name: 'Orthopedic Clinic', shortName: 'ORTHOPEDIC', badgeLabel: 'BONE & JOINT', icon: '🦴', type: 'Bone, Joint & Spine Care', floor: '1st Floor (OPD)', x: 660, y: 160, color: '#1d4ed8', image: 'assets/rooms/room_orthopedic.jpg', doctor: 'Dr. Rajesh Kumar (Orthopedic Surgeon)', equipment: 'Digital X-Ray Panel, Joint Anatomy Models, Splints', activeTarget: true }
  ],
  floor2: [
    { room: 'Room 404', name: 'Intensive Care Unit (ICU)', shortName: 'ICU UNIT', badgeLabel: 'CRITICAL CARE', icon: '🚨', type: 'Critical Care & Life Support', floor: '2nd Floor (Specialty & ICU)', x: 260, y: 160, color: '#dc2626', image: 'assets/rooms/room_icu.jpg', doctor: 'Dr. Critical Care Specialist Team', equipment: 'Multipara Vital Monitors, Ventilators, Syringe Infusion Pumps' },
    { room: 'Room 405', name: 'Normal Patient Ward', shortName: 'PATIENT WARD', badgeLabel: 'GENERAL WARD', icon: '🛏️', type: 'General Inpatient & Recovery Ward', floor: '2nd Floor (Specialty & ICU)', x: 560, y: 160, color: '#10b981', image: 'assets/rooms/room_normal_ward.jpg', doctor: 'Duty Physician & Resident Nurse', equipment: 'Adjustable Patient Bed, IV Drip Stand, Visitor Seating' }
  ],
  floor3: [
    { room: 'Room 406', name: 'Postnatal Ward 406', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 140, y: 160, color: '#f43f5e', image: 'assets/rooms/room_postnatal.jpg', doctor: 'Dr. Obstetric & Postnatal Specialist', equipment: 'Baby Bassinet, Mother Recovery Bed, Lactation Support' },
    { room: 'Room 407', name: 'Postnatal Ward 407', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 280, y: 160, color: '#f43f5e', image: 'assets/rooms/room_postnatal.jpg', doctor: 'Postnatal Nursing Team', equipment: 'Baby Bassinet, Electric Mother Bed' },
    { room: 'Room 408', name: 'Postnatal Ward 408', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 420, y: 160, color: '#f43f5e', image: 'assets/rooms/room_postnatal.jpg', doctor: 'Pediatric & Postnatal Nurse', equipment: 'Baby Bassinet, Vital Monitor' },
    { room: 'Room 409', name: 'Postnatal Ward 409', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 560, y: 160, color: '#f43f5e', image: 'assets/rooms/room_postnatal.jpg', doctor: 'Obstetric Care Specialist', equipment: 'Baby Bassinet, Private Deluxe Ward' },
    { room: 'Room 410', name: 'Postnatal Ward 410', shortName: 'MATERNITY', badgeLabel: 'POSTNATAL CARE', icon: '👶', type: 'Postnatal Maternity Care', floor: '3rd Floor (Postnatal Ward)', x: 700, y: 160, color: '#f43f5e', image: 'assets/rooms/room_postnatal.jpg', doctor: 'Maternity Care Team', equipment: 'Baby Bassinet, Mother Comfort Suite' }
  ]
};

// Doctors Database
const doctorsBySpecialty = {
  derm: [
    { id: 9, name: 'Dr. Priya Ramesh', title: 'MD Dermatology, Skin & Hair Specialist', room: 'Room 401 (1st Floor)', fee: 500, avatar: '👩‍⚕️' }
  ],
  cardio: [
    { id: 3, name: 'Dr. K. Srinivas', title: 'DM Cardiology, Senior Heart Specialist', room: 'Room 402 (1st Floor)', fee: 700, avatar: '👨‍⚕️' },
    { id: 4, name: 'Dr. Preeti Deshmukh', title: 'MD, Interventional Cardiologist', room: 'Room 402 (1st Floor)', fee: 650, avatar: '👩‍⚕️' }
  ],
  ortho: [
    { id: 1, name: 'Dr. Rajesh Kumar', title: 'MS Ortho, Senior Joint Specialist', room: 'Room 403 (1st Floor)', fee: 500, avatar: '👨‍⚕️' },
    { id: 2, name: 'Dr. S. Venkat', title: 'Senior Spine & Knee Surgeon', room: 'Room 403 (1st Floor)', fee: 600, avatar: '👨‍⚕️' }
  ],
  general: [
    { id: 5, name: 'Dr. Ananya Sharma', title: 'MD Physician (General Medicine & Ward)', room: 'Room 405 (2nd Floor)', fee: 400, avatar: '👩‍⚕️' }
  ],
  eye: [
    { id: 6, name: 'Dr. Arvind Swamy', title: 'Senior Eye Surgeon (Cataract & Lasik)', room: 'Room 009 (Ground Floor)', fee: 450, avatar: '👨‍⚕️' }
  ],
  neuro: [
    { id: 7, name: 'Dr. Vikramaditya', title: 'DM Neurology (ICU & Brain Care)', room: 'Room 404 (2nd Floor)', fee: 750, avatar: '👨‍⚕️' }
  ],
  dental: [
    { id: 8, name: 'Dr. Meera Nambiar', title: 'BDS, MDS Oral & Dental Care', room: 'Room 007 (Ground Floor)', fee: 350, avatar: '👩‍⚕️' }
  ]
};

// Schemes Catalog
const healthSchemes = [
  {
    id: 'pmjay',
    name: 'Ayushman Bharat (PM-JAY)',
    type: 'Central Govt Scheme',
    coverage: '₹5,00,000 / Year Cashless',
    badge: '100% Cashless Treatment',
    desc: 'Provides full financial protection and free hospitalization across 1,949 treatments for seniors and families.',
    discount: '100% Hospitalization & 50% OPD'
  },
  {
    id: 'senior-welfare',
    name: 'National Senior Citizen Health Concession',
    type: 'Ministry of Health & Hospital Trust',
    coverage: '50% Flat Discount on OPD & Scans',
    badge: 'Senior 60+ Special',
    desc: 'Instant 50% discount on doctor consultation fees, X-Ray, MRI, Blood tests and physiotherapy sessions.',
    discount: '50% Off All Consultations'
  },
  {
    id: 'cmchis',
    name: 'Chief Minister Comprehensive Health Scheme (CMCHIS)',
    type: 'State Govt Scheme',
    coverage: '₹5,00,000 Family Cover',
    badge: 'State Approved',
    desc: 'Covers specialized knee joint replacements, cardiac surgeries, and post-operative medications.',
    discount: 'Full Cashless Surgery'
  },
  {
    id: 'janaushadhi',
    name: 'Pradhan Mantri Jan Aushadhi Generic Medicine Scheme',
    type: 'Pharmacy Counter (Room 004)',
    coverage: '50% to 90% Cheaper Medicines',
    badge: 'Low Cost Pharmacy',
    desc: 'High-grade WHO-GMP certified generic medicines for blood pressure, diabetes, arthritis, and heart conditions at low prices.',
    discount: 'Up to 90% Medicine Savings'
  }
];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  renderFloorMap(state.currentFloor);
  renderMedicineLists();
  renderDoctorSelectOptions('ortho');
  renderSchemesCatalog();
  renderDoctorQueue();
  renderDoctorPrescriptionRows();
  updateAuthUI();
  updateDynamicIsland('HeloDoc Active');

  // Trigger welcome greeting on first load
  setTimeout(() => {
    speakText('Welcome to HeloDoc. Smart hospital guide and room navigation ready.');
  }, 1000);
});

// ==================== LIVE CLOCK & DYNAMIC ISLAND ====================
function initLiveClock() {
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const clockEl = document.getElementById('status-clock');
    if (clockEl) clockEl.textContent = `${hours}:${minutes}`;
  }
  updateTime();
  setInterval(updateTime, 10000);
}

function updateDynamicIsland(text) {
  const islandText = document.getElementById('island-text');
  const island = document.getElementById('dynamic-island');
  if (islandText) islandText.textContent = text;
  if (island) {
    island.classList.add('expanded');
    setTimeout(() => island.classList.remove('expanded'), 3000);
  }
}

// ==================== NAVIGATION & TABS ====================
function navigateToTab(tabId) {
  state.activeTab = tabId;
  const pages = document.querySelectorAll('.tab-page');
  pages.forEach(p => p.classList.remove('active'));

  const targetPage = document.getElementById(`tab-${tabId}`);
  if (targetPage) targetPage.classList.add('active');

  const navBtns = document.querySelectorAll('.nav-tab-btn');
  navBtns.forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`tab-btn-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Scroll to top of tab container
  const container = document.getElementById('tab-container');
  if (container) container.scrollTop = 0;

  // Speak page title if audio guide is active
  if (state.audioGuideActive && tabId !== 'auth') {
    const titleText = getTranslatedText(`nav${capitalize(tabId)}`) || tabId;
    speakText(`${titleText} page active.`);
  }

  // If opening map, redraw geometry and initialize 3D map
  if (tabId === 'map') {
    renderFloorMap(state.currentFloor);
    setTimeout(() => {
      if (typeof initHospital3DMap === 'function') initHospital3DMap();
    }, 60);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==================== DEVICE VIEW SWITCHER ====================
function setDeviceView(mode) {
  const frame = document.getElementById('device-frame');
  const btns = document.querySelectorAll('.device-btn');
  btns.forEach(b => b.classList.remove('active'));

  const targetBtn = document.getElementById(`btn-view-${mode}`);
  if (targetBtn) targetBtn.classList.add('active');

  frame.className = 'mobile-device-frame';
  if (mode === 'iphone') {
    frame.classList.add('frame-iphone');
  } else if (mode === 'android') {
    frame.classList.add('frame-android');
  } else if (mode === 'fullscreen') {
    frame.classList.add('frame-fullscreen');
  }
}

// ==================== SENIOR CARE MODE & AUDIO ENGINE ====================
function toggleElderMode() {
  state.elderMode = !state.elderMode;
  document.body.classList.toggle('senior-mode', state.elderMode);
  const btn = document.getElementById('btn-elder-mode');
  if (btn) btn.classList.toggle('active', state.elderMode);

  if (state.elderMode) {
    updateDynamicIsland('Senior Mode ON 👵');
    speakText('Senior Care Mode is now active with extra large fonts and high contrast voice assistance.');
  } else {
    updateDynamicIsland('Standard Mode');
    speakText('Standard view restored.');
  }
}

function toggleAudioGuide() {
  state.audioGuideActive = !state.audioGuideActive;
  const btn = document.getElementById('btn-audio-guide');
  const icon = document.getElementById('audio-icon');
  if (btn) btn.classList.toggle('active', state.audioGuideActive);
  if (icon) icon.textContent = state.audioGuideActive ? '🔊' : '🔇';

  if (state.audioGuideActive) {
    speakText('Voice Guide is enabled.');
  } else {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

// Multilingual Speech Synthesis Dictionary
const voiceTranslations = {
  // Voice Greetings & Status
  hello_guide: {
    en: "Hello, I am your HeloDoc Hospital Guide. How can I assist you today?",
    hi: "नमस्ते, मैं आपका हेलोडॉक अस्पताल गाइड हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?",
    ta: "வணக்கம், நான் உங்கள் HeloDoc மருத்துவமனை வழிகாட்டி. இன்று உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?",
    te: "నమస్కారం, నేను మీ HeloDoc హాస్పిటల్ గైడ్‌ని. నేడు నేను మీకు ఎలా సహాయపడగలను?",
    ml: "നമസ്കാരം, ഞാൻ നിങ്ങളുടെ HeloDoc ഹോസ്പിറ്റൽ ഗൈഡ് ആണ്. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?",
    es: "Hola, soy su Guía Hospitalario de HeloDoc. ¿En qué puedo orientarle hoy?"
  },
  listening_prompt: {
    en: "Listening... Please speak your question clearly.",
    hi: "सुन रहा हूँ... कृपया अपना प्रश्न स्पष्ट रूप से बोलें।",
    ta: "கேட்கிறது... உங்கள் கேள்வியை தெளிவாக பேசவும்.",
    te: "వింటున్నాను... దయచేసి మీ ప్రశ్నను స్పష్టంగా మాట్లాడండి.",
    ml: "ശ്രദ്ധിക്കുന്നു... ദയവായി നിങ്ങളുടെ ചോദ്യം വ്യക്തമായി പറയുക.",
    es: "Escuchando... Por favor hable con claridad."
  },
  voice_guide_enabled: {
    en: "Voice Guide is enabled.",
    hi: "आवाज़ गाइड चालू कर दी गई है।",
    ta: "குரல் வழிகாட்டி இயக்கப்பட்டது.",
    te: "వాయిస్ గైడ్ ప్రారంభించబడింది.",
    ml: "വോയ്‌സ് ഗൈഡ് പ്രവർത്തനക്ഷമമാക്കി.",
    es: "Guía de voz activada."
  },
  senior_mode_enabled: {
    en: "Senior Care Mode is now active with extra large fonts and voice assistance.",
    hi: "वरिष्ठ नागरिक मोड सक्रिय हो गया है, बड़े अक्षरों और आवाज़ सहायता के साथ।",
    ta: "பெரிய எழுத்துக்கள் மற்றும் குரல் வழிகாட்டலுடன் முதியோர் பராமரிப்பு முறை இயக்கப்பட்டது.",
    te: "పెద్ద అక్షరాలు మరియు వాయిస్ సహాయంతో సీనియర్ కేర్ మోడ్ ప్రారంభమైంది.",
    ml: "വലിയ അಕ್ಷരങ്ങളും വോയ്‌സ് സഹായവുമുള്ള സീനിയർ കെയർ മോഡ് സജീവമായി.",
    es: "Modo de atención para adultos mayores activado con fuentes grandes y asistencia por voz."
  },
  standard_mode_restored: {
    en: "Standard view restored.",
    hi: "सामान्य दृश्य बहाल कर दिया गया है।",
    ta: "வழக்கமான திரை மீட்டமைக்கப்பட்டது.",
    te: "సాధారణ వీక్షణ పునరుద్ధరించబడింది.",
    ml: "സാധാരണ കാഴ്‌ച പുనഃസ്ഥാപിച്ചു.",
    es: "Vista estándar restaurada."
  },
  switched_to_patient: {
    en: "Switched to Patient Mode.",
    hi: "मरीज़ मोड में बदला गया।",
    ta: "நோயாளி முறைக்கு மாற்றப்பட்டது.",
    te: "రోగి పోర్టల్‌కు మార్చబడింది.",
    ml: "പേഷ്യന്റ് മോഡിലേക്ക് മാറ്റി.",
    es: "Cambiado a Modo Paciente."
  },
  switched_to_doctor: {
    en: "Switched to Doctor Mode. Room 104 console active.",
    hi: "डॉक्टर मोड में बदला गया। कमरा 104 कंसोल सक्रिय।",
    ta: "மருத்துவர் முறைக்கு மாற்றப்பட்டது. அறை 104 பணியகம் தயார்.",
    te: "డాక్టర్ మోడ్‌కు మార్చబడింది. రూమ్ 104 కన్సోల్ సిద్ధంగా ఉంది.",
    ml: "ഡോക്ടർ മോഡിലേക്ക് മാറ്റി. റൂം 104 കൺസോൾ സജീവം.",
    es: "Cambiado a Modo Médico. Consola de consultorio 104 activa."
  },

  // Floors
  viewing_ground: {
    en: "Viewing Ground Floor: Emergency Trauma & Jan Aushadhi Generic Pharmacy",
    hi: "भूतल: आपातकालीन ट्रॉमा और जन औषधि जेनेरिक फार्मेसी।",
    ta: "தரைத்தளம்: அவசர சிகிச்சை பிரிவு மற்றும் ஜன் ஔஷதி மருந்தகம்.",
    te: "గ్రౌండ్ ఫ్లోర్: అత్యవసర విభాగం మరియు జన్ ఔషధి ఫార్మసీ.",
    ml: "ഗ്രൗണ്ട് ഫ്ലോർ: എമർജൻസി ട്രോമ, ജൻ ഔഷധി ഫാർമസി.",
    es: "Planta Baja: Urgencias y Farmacia Genérica Jan Aushadhi."
  },
  viewing_floor1: {
    en: "Viewing 1st Floor: Dermatology Room 401, Cardiology Room 402, Orthopedic Room 403",
    hi: "प्रथम तल: त्वचा रोग कमरा 401, कार्डियोलॉजी कमरा 402 और ऑर्थोपेडिक कमरा 403।",
    ta: "1-வது மாடி: தோல் மருத்துவ அறை 401, இதய பிரிவு அறை 402 மற்றும் எலும்பு பிரிவு அறை 403.",
    te: "1వ అంతస్తు: డెర్మటాలజీ రూమ్ 401, కార్డియాలజీ రూమ్ 402 మరియు ఆర్థోపెడిక్ రూమ్ 403.",
    ml: "ഒന്നാം നില: ഡെർമറ്റോളജി റൂം 401, കാർഡിയോളജി റൂം 402, ഓർത്തോപെഡിക്സ് റൂം 403.",
    es: "1.er Piso: Dermatología Habitación 401, Cardiología Habitación 402 y Ortopedia Habitación 403."
  },
  viewing_floor2: {
    en: "Viewing 2nd Floor: ICU Room 404, Normal Ward Room 405",
    hi: "दूसरा तल: गहन चिकित्सा इकाई आईसीयू कमरा 404 और सामान्य मरीज वार्ड कमरा 405।",
    ta: "2-வது மாடி: தீவிர சிகிச்சை பிரிவு ICU அறை 404 மற்றும் சாதாரண வார்டு அறை 405.",
    te: "2వ అంతస్తు: ఇంటెన్సివ్ కేర్ యూనిట్ ICU రూమ్ 404 మరియు సాధారణ వార్డు రూమ్ 405.",
    ml: "രണ്ടാം നില: തീവ്രപരിചരണ വിഭാഗം ICU റൂം 404, പേഷ്യന്റ് വാർഡ് റൂം 405.",
    es: "2.º Piso: Unidad de Cuidados Intensivos UCI Habitación 404 y Sala de Pacientes Habitación 405."
  },
  viewing_floor3: {
    en: "Viewing 3rd Floor: Postnatal Maternity Wards Room 406 to 410",
    hi: "तीसरा तल: प्रसूति एवं नवजात शिशु वार्ड कमरा 406 से कमरा 410 तक।",
    ta: "3-வது மாடி: பிரசவத்திற்கு பிந்தைய தாய்-சேய் வார்டுகள் அறை 406 முதல் 410 வரை.",
    te: "3వ అంతస్తు: పోస్ట్ నాటల్ ప్రసూతి వార్డులు రూమ్ 406 నుండి రూమ్ 410 వరకు.",
    ml: "മൂന്നാം നില: പ്രസവാനന്തര വാർഡുകൾ റൂം 406 മുതൽ 410 വരെ.",
    es: "3.er Piso: Salas de Maternidad y Posparto desde la Habitación 406 a la 410."
  },

  // Payment, Delivery & Emergency
  delivery_placed: {
    en: "Medicine home delivery order placed. Delivery OTP is 4 8 2 9.",
    hi: "दवा होम डिलीवरी ऑर्डर स्वीकार कर लिया गया है। आपका डिलीवरी ओटीपी 4 8 2 9 है।",
    ta: "மருந்து வீட்டு டெலிவரி பதிவு செய்யப்பட்டது. டெலிவரி OTP 4 8 2 9.",
    te: "మందుల హోమ్ డెలివరీ ఆర్డర్ నమోదైంది. మీ డెలివరీ OTP 4 8 2 9.",
    ml: "മരുന്ന് ഹോം ഡെലിവറി ഓർഡർ ലഭിച്ചു. ഡെലിവറി OTP 4 8 2 9 ആണ്.",
    es: "Pedido de medicamentos a domicilio realizado. Su código OTP es 4 8 2 9."
  },
  payment_received: {
    en: "Payment of Rupees 300 received via UPI. Official receipt generated.",
    hi: "यूपीआई के माध्यम से 300 रुपये का भुगतान प्राप्त हुआ। आधिकारिक रसीद तैयार हो गई है।",
    ta: "UPI மூலம் 300 ரூபாய் கட்டணம் பெறப்பட்டது. ரசீது உருவாக்கப்பட்டது.",
    te: "UPI ద్వారా 300 రూపాయల చెల్లింపు పూర్తయింది. రసీదు జారీ చేయబడింది.",
    ml: "UPI വഴി 300 രൂപ അടച്ചു. രസീത് തയ്യാറായി.",
    es: "Pago de 300 rupias recibido por UPI. Recibo oficial generado."
  },
  sos_alert: {
    en: "Emergency SOS activated! Hospital trauma team and family caregiver have been alerted.",
    hi: "आपातकालीन एसओएस सक्रिय! अस्पताल ट्रॉमा टीम और परिवार को सूचित कर दिया गया है।",
    ta: "அவசர SOS இயக்கப்பட்டது! மருத்துவமனை மற்றும் குடும்பத்தினருக்கு தகவல் அனுப்பப்பட்டது.",
    te: "అత్యవసర SOS ప్రారంభమైంది! ఆసుపత్రి మరియు కుటుంబ సభ్యులకు సమాచారం చేరింది.",
    ml: "അടിയന്തര SOS സജീവമാക്കി! ആശുപത്രിയിലേക്കും കുടുംബത്തിലേക്കും വിവരം നൽകി.",
    es: "¡SOS de emergencia activado! El equipo del hospital y su familia han sido alertados."
  }
};

// Web Audio API Hospital Guidance Chime (Soft 2-tone melodic notification before voice)
function playHospitalGuidanceChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // Tone 1: 523.25 Hz (C5) - gentle hospital notification bell
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2: 659.25 Hz (E5) - harmonic comforting chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.12);
    gain2.gain.setValueAtTime(0.0001, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.14, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.48);
  } catch (e) {
    // AudioContext permission / autoplay policy handling
  }
}
window.playHospitalGuidanceChime = playHospitalGuidanceChime;

// Human-Like Multilingual Voice Picker (ranks neural, natural, online, and native human talent voices)
function getBestHumanVoice(targetLangCode, langPrefix) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const prefix = (langPrefix || 'en').toLowerCase();
  const targetTag = (targetLangCode || 'en-US').toLowerCase();

  // Find candidate voices for this language
  const candidates = voices.filter(v => {
    const l = (v.lang || '').toLowerCase();
    return l === targetTag || l.startsWith(prefix) || l.includes(prefix);
  });

  if (candidates.length === 0) return null;

  // Score candidate voices
  const scored = candidates.map(v => {
    let score = 0;
    const name = (v.name || '').toLowerCase();
    
    // Top Priority: Natural / Neural voices
    if (name.includes('natural')) score += 100;
    if (name.includes('neural')) score += 95;
    if (name.includes('online')) score += 80;
    if (name.includes('google')) score += 70;

    // High quality human talent voices
    const humanTalents = [
      'christopher', 'jenny', 'guy', 'aria', 'ava', // English
      'pallavi', 'valluvar', 'iniya', // Tamil
      'swara', 'kalpana', 'hemant', 'madhur', // Hindi
      'mohan', 'chitra', // Telugu
      'sobhana', 'midhun', // Malayalam
      'sapna', 'gagan', // Kannada
      'jorge', 'elvira', 'alvaro', 'monica' // Spanish
    ];
    if (humanTalents.some(t => name.includes(t))) score += 40;

    // Strong penalty for legacy robotic desktop/SAPI voices
    if (name.includes('desktop') || name.includes('sapi')) score -= 40;

    return { voice: v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].voice;
}
window.getBestHumanVoice = getBestHumanVoice;

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const lang = state.currentLang || 'en';
  let translatedText = text;

  // Check if text is a known key or matches an English phrase in voiceTranslations
  if (voiceTranslations[text]) {
    translatedText = voiceTranslations[text][lang] || voiceTranslations[text].en || text;
  } else if (lang !== 'en' && typeof text === 'string') {
    const trimmed = text.trim();
    for (const phraseObj of Object.values(voiceTranslations)) {
      if (phraseObj.en && phraseObj.en.toLowerCase() === trimmed.toLowerCase()) {
        translatedText = phraseObj[lang] || text;
        break;
      }
    }
  }

  // Clean emojis and markdown characters
  let cleanSpoken = (translatedText || '')
    .replace(/[*#_~`]/g, '')
    .replace(/[👉📍🛵💊🎉⚠️🚨🔍📅🗺️🚚🏛️🩺🦴❤️🛏️👶🔬🩻🧴]/g, '')
    .trim();

  if (!cleanSpoken) return;

  // Add natural clause spacing for human cadence
  cleanSpoken = cleanSpoken
    .replace(/\s*([,;:])\s*/g, '$1 ')
    .replace(/\s*([.!?])\s*/g, '$1 ');

  // Soft hospital guidance chime before voice
  playHospitalGuidanceChime();

  setTimeout(() => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanSpoken);
      // Human conversational rate: warm, articulate cadence (slower for seniors)
      utterance.rate = state.elderMode ? 0.84 : 0.90;
      utterance.pitch = 1.02; // Warm, friendly human inflection

      // Language voice tag mapping
      const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        ml: 'ml-IN',
        kn: 'kn-IN',
        es: 'es-ES'
      };
      const targetLangCode = langMap[lang] || 'en-US';
      utterance.lang = targetLangCode;

      const bestVoice = getBestHumanVoice(targetLangCode, lang);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }, 180);
}

function speakCurrentScreenText() {
  const currentTab = state.activeTab;
  const lang = state.currentLang || 'en';
  let textToSpeak = "";

  if (currentTab === 'home') {
    if (lang === 'hi') {
      textToSpeak = `नमस्ते रामचंद्रन जी। आज आपका अपॉइंटमेंट डॉ. राजेश कुमार के साथ 10:30 बजे कमरा 403 प्रथम तल पर है। टोकन नंबर ए-14 है। कमरे का रास्ता देखने के लिए गाइड मी दबाएं।`;
    } else if (lang === 'ta') {
      textToSpeak = `வணக்கம் ராமச்சந்திரன். இன்று டாக்டர் ராஜேஷ் குமார் உடன் 10:30 மணிக்கு அறை 403 முதல் மாடியில் சந்திப்பு உள்ளது. டோக்கன் எண் A-14. அறை வழி பார்க்க கைடு மீ தொடவும்.`;
    } else if (lang === 'te') {
      textToSpeak = `నమస్కారం రామచంద్రన్ గారు. నేడు డాక్టర్ రాజేష్ కుమార్ తో 10:30 గంటలకు రూమ్ 403 మొదటి అంతస్తులో అపాయింట్‌మెంట్ ఉంది. టోకెన్ A-14. గైడ్ మీ బటన్ నొక్కండి.`;
    } else if (lang === 'ml') {
      textToSpeak = `സ്വാഗതം രാമചന്ദ്രൻ. ഇന്ന് ഡോ. രാജേഷ് കുമാറുമായി 10:30 ന് റൂം 403 ഒന്നാം നിലയിൽ അപ്പോയിന്റ്മെന്റ് ഉണ്ട്. ടോക്കൺ A-14. വഴി കാണാൻ ഗൈഡ് മീ അമർത്തുക.`;
    } else if (lang === 'es') {
      textToSpeak = `Bienvenido Sr. Ramachandran. Tiene una cita con el Dr. Rajesh Kumar a las 10:30 en la Habitación 403 del 1.er piso. Ficha A-14. Presione Guiarme para ver la ruta.`;
    } else {
      textToSpeak = `Welcome Mr. Ramachandran. You have an active appointment with Dr. Rajesh Kumar at 10:30 AM in Room 403 on the 1st Floor. Your Token number is A-14. Tap the guide me button for step-by-step walking directions.`;
    }
  } else if (currentTab === 'map') {
    const step = state.navSteps[state.currentNavStepIndex] || state.navSteps[0];
    if (lang === 'hi') {
      textToSpeak = `अस्पताल इनडोर नेविगेशन। ${step.audio || ''}। गंतव्य: कमरा 403 ऑर्थोपेडिक्स क्लिनिक।`;
    } else if (lang === 'ta') {
      textToSpeak = `மருத்துவமனை உள் வரைபடம். அறை 403 எலும்பு சிகிச்சை கிளினிக் நோக்கி வழிகாட்டுகிறது.`;
    } else if (lang === 'te') {
      textToSpeak = `హాస్పిటల్ నావిగేషన్. రూమ్ 403 ఆర్థోపెడిక్ క్లినిక్ వైపు మార్గం.`;
    } else if (lang === 'ml') {
      textToSpeak = `ഹോസ്പിറ്റൽ ഇൻഡോർ നാവിഗേഷൻ. റൂം 403 ഓർത്തോപെഡിക് ക്ലിനിക്കിലേക്ക് നയിക്കുന്നു.`;
    } else if (lang === 'es') {
      textToSpeak = `Navegación hospitalaria. Mostrando ruta hacia la Habitación 403 de Ortopedia.`;
    } else {
      textToSpeak = `Hospital indoor navigation. ${step.audio}. Target room: Room 403 Orthopedics.`;
    }
  } else if (currentTab === 'medicines') {
    if (lang === 'hi') {
      textToSpeak = `दवाइयां और समय। आज की स्थिति: घुटने का ऑस्टियोआर्थराइटिस। सुबह नाश्ते के बाद ग्लूकोसामाइन, नाश्ते से पहले पेंटोप्राजोल, दोपहर में कैल्शियम और रात को डायसेरिन लें।`;
    } else if (lang === 'ta') {
      textToSpeak = `மருந்து நினைவூட்டல். முழங்கால் மூட்டு வலிக்கு காலை குளுக்கோசமைன், உணவுக்கு முன் பான்டோபிரசோல், மதியம் கால்சியம் மற்றும் இரவில் டயாசெரின் உட்கொள்ளவும்.`;
    } else if (lang === 'te') {
      textToSpeak = `మందుల రిమైండర్. ఉదయం గ్లూకోసమైన్, ఆహారానికి ముందు పాంటోప్రజోల్, మధ్యాహ్నం కాల్షియం, రాత్రి డయాసిరిన్ తీసుకోండి.`;
    } else if (lang === 'ml') {
      textToSpeak = `മരുന്ന് ക്രമം. രാവിലെ ഗ്ലൂക്കോസാമൈൻ, ഭക്ഷണത്തിന് മുമ്പ് പാന്റോപ്രാസോൾ, ഉച്ചയ്ക്ക് കാൽസ്യം, രാത്രി ഡയസെറിൻ കഴിക്കുക.`;
    } else if (lang === 'es') {
      textToSpeak = `Recordatorio de medicamentos. Diagnóstico de artrosis de rodilla. Tome Glucosamina y Pantoprazol por la mañana, Calcio al almuerzo y Diacereína por la noche.`;
    } else {
      textToSpeak = `Medicine reminders. Today's diagnosis is Grade 2 Osteoarthritis of the Right Knee. Take Glucosamine and Pantoprazole in the morning after breakfast, Calcium at lunch, and Diacerein at bedtime.`;
    }
  } else if (currentTab === 'schemes') {
    if (lang === 'hi') {
      textToSpeak = `सरकारी स्वास्थ्य योजनाएं। आप आयुष्मान भारत 5 लाख रुपये मुफ्त इलाज और वरिष्ठ नागरिक 50 प्रतिशत छूट के लिए पात्र हैं।`;
    } else if (lang === 'ta') {
      textToSpeak = `அரசு நலத்திட்டங்கள். ஆயுஷ்மான் பாரத் 5 லட்சம் இலவச சிகிச்சை மற்றும் முதியோர் 50% சலுகைக்கு நீங்கள் தகுதியுடையவர்.`;
    } else if (lang === 'te') {
      textToSpeak = `ప్రభుత్వ పథకాలు. మీరు ఆయుష్మాన్ భారత్ 5 లక్షల ఉచిత చికిత్స మరియు సీనియర్ 50 శాతం రాయితీకి అర్హులు.`;
    } else if (lang === 'ml') {
      textToSpeak = `സർക്കാർ ആരോഗ്യ പദ്ധതികൾ. ആയുഷ്മാൻ ഭാരത് 5 ലക്ഷം രൂപ സൗജന്യ ചികിത്സയ്ക്കും 50% ഇളവിനും അർഹതയുണ്ട്.`;
    } else if (lang === 'es') {
      textToSpeak = `Planes de salud gubernamentales. Usted califica para cobertura médica y 50% de descuento para adultos mayores.`;
    } else {
      textToSpeak = `Government health schemes. You are eligible for Ayushman Bharat PM-JAY with 5 lakhs free cover and Senior Citizen 50 percent OPD discount.`;
    }
  } else {
    if (lang === 'hi') {
      textToSpeak = `हेलोडॉक स्वास्थ्य सहायक। किसी भी सेवा कार्ड को दबाएं या एआई गाइड से पूछें।`;
    } else if (lang === 'ta') {
      textToSpeak = `HeloDoc மருத்துவ வழிகாட்டி. எந்த சேவையையும் தேர்ந்தெடுக்கவும் அல்லது AI வழிகாட்டியிடம் பேசவும்.`;
    } else if (lang === 'te') {
      textToSpeak = `HeloDoc ఆరోగ్య సహాయకుడు. ఏదైనా కార్డ్ నొక్కండి లేదా AI గైడ్‌ని అడగండి.`;
    } else if (lang === 'ml') {
      textToSpeak = `HeloDoc ഹെൽത്ത് അസിസ്റ്റന്റ്. സേവനങ്ങൾക്കായി കാർഡിൽ തൊടുകയോ AI യോട് ചോദിക്കുകയോ ചെയ്യാം.`;
    } else if (lang === 'es') {
      textToSpeak = `Asistente médico HeloDoc. Toque cualquier servicio o consulte a la Guía IA.`;
    } else {
      textToSpeak = `HeloDoc medical assistant. Tap any service card or ask the AI Guide for help.`;
    }
  }

  speakText(textToSpeak);
}

// ==================== MULTILINGUAL TRANSLATION ====================
function changeLanguage(langCode) {
  state.currentLang = langCode;
  const dict = translations[langCode] || translations.en;

  // Translate all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Update AI guide language label
  const aiLangLabel = document.getElementById('ai-active-lang-label');
  const langNames = { en: 'English', hi: 'हिन्दी (Hindi)', ta: 'தமிழ் (Tamil)', te: 'తెలుగు (Telugu)', ml: 'മലയാളം (Malayalam)', es: 'Español' };
  if (aiLangLabel) aiLangLabel.textContent = langNames[langCode] || 'English';

  updateDynamicIsland(`Language: ${langCode.toUpperCase()}`);
  speakText(dict.listenPage || 'Language changed successfully.');
}

function getTranslatedText(key) {
  const dict = translations[state.currentLang] || translations.en;
  return dict[key] || translations.en[key] || key;
}

// ==================== ROLE SWITCHING (PATIENT / DOCTOR) ====================
function switchRole(role) {
  state.currentRole = role;
  const patientBtn = document.getElementById('role-patient');
  const doctorBtn = document.getElementById('role-doctor');

  if (role === 'patient') {
    patientBtn.classList.add('active');
    doctorBtn.classList.remove('active');
    navigateToTab('home');
    updateDynamicIsland('Patient Portal 👤');
    speakText('Switched to Patient Mode.');
  } else {
    doctorBtn.classList.add('active');
    patientBtn.classList.remove('active');
    navigateToTab('doctor');
    updateDynamicIsland('Doctor Portal 👨‍⚕️');
    speakText('Switched to Doctor Mode. Room 104 console active.');
  }
}

// ==================== AUTHENTICATION & LOGIN FLOW ====================
function switchAuthMethod(method) {
  const phoneBtn = document.getElementById('auth-tab-btn-phone');
  const googleBtn = document.getElementById('auth-tab-btn-google');
  const phonePanel = document.getElementById('auth-panel-phone');
  const googlePanel = document.getElementById('auth-panel-google');

  if (method === 'phone') {
    phoneBtn.classList.add('active');
    googleBtn.classList.remove('active');
    phonePanel.style.display = 'block';
    googlePanel.style.display = 'none';
  } else {
    googleBtn.classList.add('active');
    phoneBtn.classList.remove('active');
    phonePanel.style.display = 'none';
    googlePanel.style.display = 'block';
  }
}

function handleSendOTP() {
  const phone = document.getElementById('auth-phone-field').value;
  if (!phone || phone.length < 8) {
    alert('Please enter a valid mobile number.');
    return;
  }

  const otpSection = document.getElementById('auth-otp-section');
  const sendBtn = document.getElementById('btn-send-otp');
  otpSection.style.display = 'block';
  sendBtn.textContent = '🔄 Resend OTP Code in 30s';
  sendBtn.disabled = true;

  updateDynamicIsland('SMS OTP Sent 📩');
  speakText(`Verification OTP code 7 2 9 4 1 8 sent to ${phone}.`);
}

function handleVerifyOTP() {
  state.isLoggedIn = true;
  updateAuthUI();
  navigateToTab('home');
  updateDynamicIsland('Login Verified ✅');
  speakText(`Welcome Mr. Ramachandran. Logged in securely with phone verification.`);
}

function handleGoogleSignIn() {
  const modal = document.getElementById('modal-google-auth');
  if (modal) modal.classList.add('open');
}

function openGoogleAuthModal() {
  handleGoogleSignIn();
}
window.openGoogleAuthModal = openGoogleAuthModal;

function confirmGoogleLoginSuccess() {
  closeModal('modal-google-auth');
  state.isLoggedIn = true;
  updateAuthUI();
  navigateToTab('home');
  updateDynamicIsland('Google Verified 🛡️');
  speakText(`Welcome Mr. Ramachandran. Logged in with your official Google account.`);
}

function handleQuickSeniorAccess() {
  state.isLoggedIn = true;
  state.elderMode = true;
  document.body.classList.add('senior-mode');
  const elderBtn = document.getElementById('btn-elder-mode');
  if (elderBtn) elderBtn.classList.add('active');

  updateAuthUI();
  navigateToTab('home');
  updateDynamicIsland('Senior 1-Tap Active 👵');
  speakText('Welcome! One-tap senior entry activated with large fonts and audio guide.');
}

function handleSignOut() {
  state.isLoggedIn = false;
  updateAuthUI();
  navigateToTab('auth');
  updateDynamicIsland('Signed Out');
  speakText('Signed out of HeloDoc.');
}

function updateAuthUI() {
  const topAuthLabel = document.getElementById('top-auth-label');
  const topAuthIcon = document.getElementById('top-auth-icon');
  if (topAuthLabel && topAuthIcon) {
    if (state.isLoggedIn) {
      topAuthLabel.textContent = 'Account';
      topAuthIcon.textContent = '👤';
    } else {
      topAuthLabel.textContent = 'Sign In';
      topAuthIcon.textContent = '🔑';
    }
  }

  const homeAccountTitle = document.getElementById('home-account-title');
  const homeAccountSub = document.getElementById('home-account-sub');
  if (homeAccountTitle && homeAccountSub) {
    if (state.isLoggedIn) {
      homeAccountTitle.textContent = state.patient.name;
      homeAccountSub.textContent = `ID: ${state.patient.id} • ${state.patient.gender}, ${state.patient.age} yrs • ${state.patient.blood} Blood`;
    } else {
      homeAccountTitle.textContent = 'Guest / Sign In Required';
      homeAccountSub.textContent = 'Tap Sign In or 1-Tap Senior Login to access appointments & tokens';
    }
  }
}

function updateHospitalLocation(locName) {
  if (locName === 'auto') {
    locName = 'City Care Multi-Specialty Hospital, Central Atrium (GPS Detected)';
  }
  state.hospitalName = locName.split(',')[0];
  const hospitalTag = document.getElementById('current-hospital-name');
  if (hospitalTag) hospitalTag.textContent = state.hospitalName;
  updateDynamicIsland('Hospital Synced 🏥');
  speakText(`Hospital location set to ${state.hospitalName}.`);
}

function promptHospitalChange() {
  navigateToTab('auth');
  speakText('Select your hospital branch from the list.');
}

// ==================== HOSPITAL INDOOR MAP ENGINE ====================
function switchFloor(floorKey) {
  state.currentFloor = floorKey;
  
  const pills = document.querySelectorAll('.floor-pill');
  pills.forEach(p => p.classList.remove('active'));
  const activePill = document.getElementById(`floor-btn-${floorKey}`);
  if (activePill) activePill.classList.add('active');

  renderFloorMap(floorKey);
  if (typeof update3DFloorFocus === 'function') {
    update3DFloorFocus(floorKey);
  }

  const floorNames = { 
    ground: 'Ground Floor (Reception, Pharmacy & Lab)', 
    floor1: '1st Floor (Dermatology 401, Cardiology 402, Orthopedic 403)', 
    floor2: '2nd Floor (404 ICU & 405 Normal Ward)',
    floor3: '3rd Floor (Postnatal Ward 406 to 410)'
  };
  speakText(`Viewing ${floorNames[floorKey] || floorKey}.`);
}

function renderFloorMap(floorKey) {
  const svgGroup = document.getElementById('svg-floor-geometry');
  const roomCardsList = document.getElementById('room-cards-list');
  if (!svgGroup || !roomCardsList) return;

  const rooms = hospitalRoomsData[floorKey] || [];
  let svgHTML = '';
  let cardsHTML = '';

  // SVG Defs with dark readability scrim and room clip-paths
  let defsHTML = `
    <defs>
      <linearGradient id="room-scrim-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0f172a" stop-opacity="0.65"/>
        <stop offset="50%" stop-color="#0f172a" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.94"/>
      </linearGradient>
  `;
  rooms.forEach(r => {
    const safeId = r.room.replace(/\s+/g, '');
    defsHTML += `
      <clipPath id="clip-${safeId}">
        <rect width="144" height="102" rx="12" />
      </clipPath>
    `;
  });
  defsHTML += '</defs>';
  svgHTML += defsHTML;

  // Central corridor geometry
  svgHTML += `<rect x="50" y="240" width="700" height="120" rx="12" class="svg-corridor" />`;
  svgHTML += `<text x="400" y="305" text-anchor="middle" font-size="13" font-weight="800" fill="#64748b" letter-spacing="1">CENTRAL CORRIDOR / MAIN HALLWAY</text>`;

  // Draw elevator & stairs icon
  svgHTML += `
    <g transform="translate(70, 255)">
      <rect width="66" height="88" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
      <text x="33" y="42" text-anchor="middle" font-size="20">🛗</text>
      <text x="33" y="66" text-anchor="middle" font-size="10.5" font-weight="800" fill="#ffffff">Elevator A</text>
      <text x="33" y="78" text-anchor="middle" font-size="8" font-weight="700" fill="#38bdf8">All Floors</text>
    </g>
  `;

  rooms.forEach(r => {
    const isTarget = r.activeTarget || (r.room === state.activeAppointment.room && floorKey === state.activeAppointment.floorKey);
    const safeId = r.room.replace(/\s+/g, '');

    svgHTML += `
      <g transform="translate(${r.x - 72}, ${r.y - 51})" class="svg-room-group" onclick="openRoomPhotoModal('${r.room}')">
        <!-- Room Photographic Background (ICU photo for ICU, Pharmacy for Pharmacy, etc.) -->
        <g clip-path="url(#clip-${safeId})">
          <image href="${r.image}" x="0" y="0" width="144" height="102" preserveAspectRatio="xMidYMid slice" />
          <rect width="144" height="102" fill="url(#room-scrim-grad)" />
        </g>

        <!-- Room Outline / Glowing Border for Senior Accessibility -->
        ${isTarget 
          ? `<rect width="144" height="102" rx="12" fill="none" stroke="#38bdf8" stroke-width="3.5" class="pulse-target-rect" />`
          : `<rect width="144" height="102" rx="12" fill="none" stroke="${r.color}" stroke-width="1.8" />`
        }

        <!-- High-Contrast Senior Room Badge Pill (Room Number + Category) -->
        <rect x="6" y="6" width="132" height="24" rx="6" fill="${r.color}" stroke="#ffffff" stroke-width="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
        <text x="72" y="22" text-anchor="middle" font-size="11.5" font-weight="900" fill="#ffffff">${r.icon || '📍'} ${r.room} • ${r.shortName || r.room}</text>

        <!-- Large Legible Room Title with Shadow -->
        <text x="72" y="52" text-anchor="middle" font-size="10.8" font-weight="800" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">${r.name.length > 20 ? r.name.substring(0, 18) + '...' : r.name}</text>
        <text x="72" y="67" text-anchor="middle" font-size="8.5" font-weight="700" fill="#7dd3fc" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.95))">${r.equipment ? (r.equipment.length > 22 ? r.equipment.substring(0, 20) + '...' : r.equipment) : r.type}</text>

        <!-- Touch Prompt -->
        <rect x="18" y="75" width="108" height="18" rx="9" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
        <text x="72" y="87.5" text-anchor="middle" font-size="8" font-weight="800" fill="#38bdf8">📷 Real Room Photo 🔍</text>
      </g>
    `;

    cardsHTML += `
      <div class="room-dir-card ${isTarget ? 'active-target-card' : ''}">
        <div class="room-card-thumb" onclick="openRoomPhotoModal('${r.room}')" title="Click to view room photo">
          <img src="${r.image}" alt="${r.name}">
          <span class="thumb-badge">${r.icon || '📷'} Photo</span>
        </div>
        <div class="room-dir-info">
          <div class="room-card-head">
            <span class="room-num-pill" style="background:${r.color}">${r.icon || '📍'} ${r.room}</span>
            <span class="room-floor-tag">${r.floor}</span>
          </div>
          <strong class="room-title-text">${r.name}</strong>
          <span class="room-type-sub">${r.type}</span>
          <small class="room-doc-sub">👨‍⚕️ ${r.doctor || 'Hospital Staff'}</small>
        </div>
        <div class="room-card-actions">
          <button class="btn btn-sm btn-photo-preview" onclick="openRoomPhotoModal('${r.room}')">
            📷 Room Photo
          </button>
          <button class="btn btn-outline btn-sm btn-guide-route" onclick="quickGuideToRoom('${r.room}', '${r.floor}')">
            👉 Guide Me
          </button>
        </div>
      </div>
    `;
  });

  svgGroup.innerHTML = svgHTML;
  roomCardsList.innerHTML = cardsHTML;

  // Draw Animated Vector Route if target room is on this floor
  generateRouteToRoom(state.activeAppointment.room, floorKey);
}

function generateRouteToRoom(roomName, floorKey) {
  const pathEl = document.getElementById('svg-nav-path');
  const targetPin = document.getElementById('svg-target-pin');
  const userPin = document.getElementById('svg-user-pin');
  if (!pathEl || !targetPin || !userPin) return;

  const rooms = hospitalRoomsData[floorKey] || [];
  const targetRoom = rooms.find(r => r.room === roomName || r.activeTarget);

  if (targetRoom) {
    // Construct path from elevator/entrance (110, 300) through hallway to target coords
    const startX = 110;
    const startY = 300;
    const endX = targetRoom.x;
    const endY = targetRoom.y;

    const pathD = `M ${startX} ${startY} L ${endX} 300 L ${endX} ${endY}`;
    pathEl.setAttribute('d', pathD);
    pathEl.style.display = 'block';

    targetPin.setAttribute('transform', `translate(${endX}, ${endY})`);
    targetPin.style.display = 'block';

    userPin.setAttribute('transform', `translate(${startX}, ${startY})`);
  } else {
    pathEl.style.display = 'none';
    targetPin.style.display = 'none';
  }
}

function quickGuideToRoom(roomName, floorName) {
  navigateToTab('map');

  let targetFloor = 'floor1';
  if (floorName.includes('Ground') || roomName.includes('00')) targetFloor = 'ground';
  else if (floorName.includes('1st') || roomName.includes('401') || roomName.includes('402') || roomName.includes('403')) targetFloor = 'floor1';
  else if (floorName.includes('2nd') || roomName.includes('404') || roomName.includes('405')) targetFloor = 'floor2';
  else if (floorName.includes('3rd') || roomName.includes('406') || roomName.includes('407') || roomName.includes('408') || roomName.includes('409') || roomName.includes('410')) targetFloor = 'floor3';

  state.currentFloor = targetFloor;

  // Set target room active
  for (const key in hospitalRoomsData) {
    hospitalRoomsData[key].forEach(r => {
      r.activeTarget = (r.room === roomName);
    });
  }

  switchFloor(targetFloor);

  // Update navigation banner text
  const navBanner = document.getElementById('nav-instruction-text');
  const navMeta = document.getElementById('nav-target-meta');
  if (navBanner) navBanner.textContent = `Walk straight from Elevator A on ${floorName}, follow the glowing path to ${roomName}.`;
  if (navMeta) navMeta.innerHTML = `Target: <strong>${roomName} (${floorName})</strong>`;

  updateDynamicIsland(`Path: ${roomName} 🗺️`);

  const lang = state.currentLang || 'en';
  let routeSpoken = `Step-by-step route to ${roomName} on ${floorName}. From Elevator A, follow the blue glowing path.`;
  if (lang === 'hi') routeSpoken = `${floorName} पर कमरा ${roomName} का रास्ता। लिफ्ट ए से निकलकर नीली चमकती लाइन का अनुसरण करें।`;
  else if (lang === 'ta') routeSpoken = `${floorName}-ல் உள்ள அறை ${roomName}-க்கு செல்லும் வழி. லிஃப்ட் A வழியாக சென்று ஒளிரும் நீல பாதையை பின்பற்றவும்.`;
  else if (lang === 'te') routeSpoken = `${floorName} లోని రూమ్ ${roomName} కు మార్గం. లిఫ్ట్ A నుండి బ్లూ లైన్ అనుసరించండి.`;
  else if (lang === 'ml') routeSpoken = `${floorName}-ലെ റൂം ${roomName}-ലേക്കുള്ള വഴി. ലിഫ്റ്റ് A വഴി നീല ലൈൻ പിന്തുടരുക.`;
  else if (lang === 'es') routeSpoken = `Ruta paso a paso hacia ${roomName} en ${floorName}. Desde el Ascensor A, siga la línea azul brillante.`;
  speakText(routeSpoken);
}

function openRoomPhotoModal(roomNo) {
  let foundRoom = null;
  for (const key in hospitalRoomsData) {
    const match = hospitalRoomsData[key].find(r => r.room === roomNo || r.room.includes(roomNo));
    if (match) {
      foundRoom = match;
      break;
    }
  }

  if (!foundRoom) return;

  const modal = document.getElementById('modal-room-photo');
  if (!modal) return;

  const badge = document.getElementById('modal-room-badge');
  if (badge) {
    badge.textContent = foundRoom.room;
    badge.style.background = foundRoom.color || '#1d4ed8';
  }
  const title = document.getElementById('modal-room-title');
  if (title) title.textContent = `${foundRoom.room} - ${foundRoom.name}`;
  const dept = document.getElementById('modal-room-dept');
  if (dept) dept.textContent = `${foundRoom.floor} • ${foundRoom.type}`;
  const img = document.getElementById('modal-room-img');
  if (img) img.src = foundRoom.image;
  const doc = document.getElementById('modal-room-doc');
  if (doc) doc.textContent = foundRoom.doctor || 'Specialist Doctor & Duty Nursing Staff';
  const equip = document.getElementById('modal-room-equip');
  if (equip) equip.textContent = foundRoom.equipment || 'Standard Clinical Equipment & Patient Amenities';

  state.modalActiveRoom = foundRoom;

  modal.classList.add('active');
  modal.style.display = 'flex';
  speakText(`Viewing room photo and details for ${foundRoom.room}, ${foundRoom.name}.`);
}

function closeRoomPhotoModal() {
  const modal = document.getElementById('modal-room-photo');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function quickGuideFromModal() {
  if (state.modalActiveRoom) {
    closeRoomPhotoModal();
    quickGuideToRoom(state.modalActiveRoom.room, state.modalActiveRoom.floor);
  }
}

function getLocalizedNavAudio(stepIndex) {
  const lang = state.currentLang || 'en';
  if (stepIndex === 0) {
    if (lang === 'hi') return "मुख्य प्रवेश द्वार से, सेंट्रल एट्रियम में लिफ्ट ए की ओर 15 मीटर सीधा चलें।";
    if (lang === 'ta') return "முக்கிய நுழைவாயிலிலிருந்து, மத்திய ஏட்ரியத்தில் உள்ள லிஃப்ட் A நோக்கி 15 மீட்டர் நேராக நடக்கவும்.";
    if (lang === 'te') return "ప్రధాన ద్వారం నుండి, సెంట్రల్ అట్రియంలోని లిఫ్ట్ A వైపు 15 మీటర్లు నేరుగా నడవండి.";
    if (lang === 'ml') return "പ്രധാന കവാടത്തിൽ നിന്ന് ലിഫ്റ്റ് A ലക്ഷ്യമാക്കി 15 മീറ്റർ നേരെ നടക്കുക.";
    if (lang === 'es') return "Desde la entrada principal, camine 15 metros hacia el Ascensor A en el Atrio Central.";
  } else if (stepIndex === 1) {
    if (lang === 'hi') return "लिफ्ट ए से पहली मंजिल ओपीडी विंग पर जाएं।";
    if (lang === 'ta') return "லிஃப்ட் A மூலம் முதல் மாடி OPD பிரிவு செல்லவும்.";
    if (lang === 'te') return "లిఫ్ట్ A ద్వారా 1వ అంతస్తుకు వెళ్ళండి.";
    if (lang === 'ml') return "ലിഫ്റ്റ് A വഴി ഒന്നാം നിലയിലേക്ക് പോകുക.";
    if (lang === 'es') return "Tome el Ascensor A hacia el primer piso.";
  } else if (stepIndex === 2) {
    if (lang === 'hi') return "लिफ्ट से बाहर निकलकर दाएं मुड़ें। 10 मीटर आगे आपके दाईं ओर कमरा 403 ऑर्थोपेडिक्स है।";
    if (lang === 'ta') return "லிஃப்டிலிருந்து வெளியேறி வலதுபுறம் திரும்பவும். 10 மீட்டர் தூரத்தில் உங்கள் வலதுபுறம் அறை 403 உள்ளது.";
    if (lang === 'te') return "లిఫ్ట్ నుండి దిగి కుడివైపు తిరగండి. 10 మీటర్ల దూరంలో కుడివైపు రూమ్ 403 ఉంది.";
    if (lang === 'ml') return "ലിഫ്റ്റിൽ നിന്നിറങ്ങി വലത്തോട്ട് തിരിയുക. 10 മീറ്റർ മുന്നിൽ വലതുവശത്ത് റൂം 403.";
    if (lang === 'es') return "Al salir del ascensor gire a la derecha. Camine 10 metros hasta la Habitación 403.";
  }
  const defaultStep = state.navSteps[stepIndex] || state.navSteps[0];
  return defaultStep.audio;
}

function speakNavigationStep() {
  const audioText = getLocalizedNavAudio(state.currentNavStepIndex);
  speakText(audioText);
}

function nextNavigationStep() {
  state.currentNavStepIndex = (state.currentNavStepIndex + 1) % state.navSteps.length;
  const currentStep = state.navSteps[state.currentNavStepIndex];

  const stepNumEl = document.getElementById('nav-step-num');
  const stepTextEl = document.getElementById('nav-instruction-text');
  if (stepNumEl) stepNumEl.textContent = `Step ${currentStep.step} of ${state.navSteps.length}`;
  if (stepTextEl) stepTextEl.textContent = currentStep.text;

  const audioText = getLocalizedNavAudio(state.currentNavStepIndex);
  speakText(audioText);
}

function filterHospitalRooms(query) {
  query = query.toLowerCase().trim();
  if (!query) {
    renderFloorMap(state.currentFloor);
    return;
  }

  // Check all floors to find matching rooms
  ['ground', 'floor1', 'floor2', 'floor3'].forEach(fKey => {
    const match = hospitalRoomsData[fKey] ? hospitalRoomsData[fKey].find(r => 
      r.room.toLowerCase().includes(query) ||
      r.name.toLowerCase().includes(query) ||
      r.type.toLowerCase().includes(query) ||
      (r.doctor && r.doctor.toLowerCase().includes(query))
    ) : null;

    if (match) {
      state.currentFloor = fKey;
      switchFloor(fKey);
    }
  });
}

function startVoiceMapSearch() {
  speakText('Listening for room number or doctor name...');
  simulateVoiceInput((spokenText) => {
    const input = document.getElementById('map-room-search');
    if (input) {
      input.value = spokenText;
      filterHospitalRooms(spokenText);
      speakText(`Searching hospital for ${spokenText}`);
    }
  });
}

function zoomMap(scaleFactor) {
  state.mapZoom = Math.max(0.6, Math.min(2.0, state.mapZoom * scaleFactor));
  const svgMap = document.getElementById('hospital-svg-map');
  if (svgMap) svgMap.style.transform = `scale(${state.mapZoom})`;
}

function resetMap() {
  state.mapZoom = 1;
  const svgMap = document.getElementById('hospital-svg-map');
  if (svgMap) svgMap.style.transform = 'scale(1)';
}

// ==================== APPOINTMENTS & DOCTOR BOOKING ====================
function selectSpecialty(specKey, btnEl) {
  state.selectedSpecialty = specKey;
  const specBtns = document.querySelectorAll('.specialty-btn');
  specBtns.forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  renderDoctorSelectOptions(specKey);
}

function renderDoctorSelectOptions(specKey) {
  const container = document.getElementById('doctor-select-list');
  if (!container) return;

  const docs = doctorsBySpecialty[specKey] || doctorsBySpecialty.ortho;
  let html = '';

  docs.forEach((doc, idx) => {
    const isAct = idx === 0 ? 'active' : '';
    html += `
      <div class="doctor-choice-card ${isAct}" onclick="selectDoctor('${doc.name}', ${doc.fee}, '${doc.room}', this)">
        <span class="doc-choice-avatar">${doc.avatar}</span>
        <div class="doc-choice-info" style="flex:1;">
          <strong>${doc.name}</strong>
          <span>${doc.title} | ${doc.room}</span>
        </div>
        <div style="text-align:right;">
          <strong style="color:var(--primary); font-size:0.9rem;">₹${doc.fee}</strong>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function selectDoctor(docName, fee, room, el) {
  state.selectedDoctor = docName;
  document.querySelectorAll('.doctor-choice-card').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');

  updateBookingCost(fee);
}

function selectApptDate(dateStr, btnEl) {
  state.selectedApptDate = dateStr;
  document.querySelectorAll('.date-pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
}

function selectTimeSlot(slotStr, btnEl) {
  state.selectedApptTime = slotStr;
  document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
}

function updateBookingCost(baseFee = 500) {
  const checkbox = document.getElementById('booking-scheme-checkbox');
  const isScheme = checkbox ? checkbox.checked : true;
  state.subsidyApplied = isScheme;

  const breakdown = document.getElementById('booking-cost-breakdown');
  if (breakdown) {
    if (isScheme) {
      breakdown.innerHTML = `<span>Standard Consultation: <del>₹${baseFee}</del></span><span class="discounted-cost">Scheme Price: <strong>₹${baseFee / 2} (50% Off)</strong></span>`;
    } else {
      breakdown.innerHTML = `<span>Standard Consultation: <strong>₹${baseFee}</strong></span><span style="color:var(--text-muted);">No subsidy applied</span>`;
    }
  }
}

function confirmAppointmentBooking() {
  const tokenNum = `#A-${Math.floor(Math.random() * 30) + 10}`;
  state.activeAppointment.token = tokenNum;
  state.activeAppointment.doctor = state.selectedDoctor;
  state.activeAppointment.time = state.selectedApptTime;
  state.activeAppointment.date = state.selectedApptDate;

  // Update Home Card
  const tokenEl = document.getElementById('active-token-no');
  const docEl = document.getElementById('active-doctor-name');
  const timeEl = document.getElementById('active-appt-time');
  if (tokenEl) tokenEl.textContent = tokenNum;
  if (docEl) docEl.textContent = state.selectedDoctor;
  if (timeEl) timeEl.textContent = state.selectedApptTime;

  updateDynamicIsland(`Token ${tokenNum} Booked! 🎟️`);
  speakText(`Appointment confirmed with ${state.selectedDoctor} at ${state.selectedApptTime}. Your Token is ${tokenNum}.`);

  // Sync to Backend
  if (typeof syncAppointmentToBackend === 'function') {
    syncAppointmentToBackend({
      patient: state.patient.name,
      doctor: state.selectedDoctor,
      time: state.selectedApptTime,
      date: state.selectedApptDate,
      subsidyApplied: state.subsidyApplied,
      token: tokenNum
    });
  }

  navigateToTab('home');
}

// ==================== MEDICINES & REMINDERS ====================
function renderMedicineLists() {
  const homePillList = document.getElementById('home-pill-list');
  const morningList = document.getElementById('morning-med-list');
  const afternoonList = document.getElementById('afternoon-med-list');
  const nightList = document.getElementById('night-med-list');

  let homeHTML = '';
  let morningHTML = '';
  let afternoonHTML = '';
  let nightHTML = '';

  state.medicines.forEach(m => {
    const checkedClass = m.taken ? 'checked' : '';
    const checkIcon = m.taken ? '✓' : '';

    const itemHTML = `
      <div class="med-pill-item">
        <div class="med-info">
          <strong>💊 ${m.name}</strong>
          <div class="med-meta">
            <span>⏰ ${m.timeStr}</span>
            <span>🍽️ ${m.food}</span>
            <span>📅 ${m.days}</span>
          </div>
        </div>
        <button class="pill-check-btn ${checkedClass}" onclick="togglePillTaken(${m.id})" title="Mark as taken">
          ${checkIcon}
        </button>
      </div>
    `;

    if (m.timing === 'morning') morningHTML += itemHTML;
    else if (m.timing === 'afternoon') afternoonHTML += itemHTML;
    else if (m.timing === 'night') nightHTML += itemHTML;

    // Home widget shows first 3 items
    if (homePillList && state.medicines.indexOf(m) < 3) {
      homeHTML += itemHTML;
    }
  });

  if (homePillList) homePillList.innerHTML = homeHTML;
  if (morningList) morningList.innerHTML = morningHTML;
  if (afternoonList) afternoonList.innerHTML = afternoonHTML;
  if (nightList) nightList.innerHTML = nightHTML;
}

function togglePillTaken(pillId) {
  const med = state.medicines.find(m => m.id === pillId);
  if (med) {
    med.taken = !med.taken;
    renderMedicineLists();
    if (med.taken) {
      updateDynamicIsland(`Taken: ${med.name.substring(0, 15)}... 💊`);
      speakText(`${med.name} marked as taken.`);
    }
  }
}

function speakPrescription() {
  const diagnosis = document.getElementById('rx-diagnosis-text').textContent;
  let text = `Doctor's Advice: ${diagnosis}. Your medicine schedule: `;
  state.medicines.forEach(m => {
    text += `${m.name} at ${m.timeStr}, ${m.food}. `;
  });
  speakText(text);
}

function openDoctorPrescriptionView() {
  navigateToTab('medicines');
}

// ==================== DOCTOR CONSOLE ====================
function renderDoctorQueue() {
  const container = document.getElementById('doctor-queue-tokens');
  if (!container) return;

  let html = '';
  state.doctorQueue.forEach(q => {
    const isAct = q.active ? 'active' : '';
    html += `
      <button class="queue-token-pill ${isAct}" onclick="selectDoctorQueuePatient('${q.token}')">
        ${q.token} - ${q.patient.split(' ')[1] || q.patient}
      </button>
    `;
  });
  container.innerHTML = html;
}

function selectDoctorQueuePatient(token) {
  state.doctorQueue.forEach(q => q.active = (q.token === token));
  renderDoctorQueue();

  const currentPatient = state.doctorQueue.find(q => q.token === token);
  if (currentPatient) {
    const nameEl = document.getElementById('doc-patient-name');
    const tokenEl = document.getElementById('doc-patient-token');
    const problemEl = document.getElementById('doc-input-problem');
    if (nameEl) nameEl.textContent = `Patient: ${currentPatient.patient} (${currentPatient.age}y)`;
    if (tokenEl) tokenEl.textContent = currentPatient.token;
    if (problemEl) problemEl.value = currentPatient.problem;

    speakText(`Loaded clinical file for patient ${currentPatient.patient}.`);
  }
}

function renderDoctorPrescriptionRows() {
  const container = document.getElementById('doctor-rx-container');
  if (!container) return;

  let html = '';
  state.medicines.forEach((m, idx) => {
    html += `
      <div class="doc-rx-item-row" id="rx-row-${m.id}">
        <div class="rx-inputs-flex">
          <input type="text" class="form-input" style="flex:2;" value="${m.name}" placeholder="Medicine name & dosage">
          <input type="text" class="form-input" style="flex:1;" value="${m.days}" placeholder="Duration (e.g. 15 Days)">
          <button class="btn btn-outline btn-sm" onclick="removeDoctorMedicineRow(this)">✕</button>
        </div>
        <div class="rx-time-checkboxes">
          <label><input type="checkbox" ${m.timing === 'morning' ? 'checked' : ''}> Morning</label>
          <label><input type="checkbox" ${m.timing === 'afternoon' ? 'checked' : ''}> Afternoon</label>
          <label><input type="checkbox" ${m.timing === 'night' ? 'checked' : ''}> Night</label>
          <label><input type="checkbox" ${m.food.includes('After') ? 'checked' : ''}> After Food</label>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function addDoctorMedicineRow() {
  const container = document.getElementById('doctor-rx-container');
  if (!container) return;

  const newId = Date.now();
  const newRow = document.createElement('div');
  newRow.className = 'doc-rx-item-row';
  newRow.innerHTML = `
    <div class="rx-inputs-flex">
      <input type="text" class="form-input" style="flex:2;" value="" placeholder="e.g. Paracetamol 650mg">
      <input type="text" class="form-input" style="flex:1;" value="5 Days" placeholder="Duration">
      <button class="btn btn-outline btn-sm" onclick="removeDoctorMedicineRow(this)">✕</button>
    </div>
    <div class="rx-time-checkboxes">
      <label><input type="checkbox" checked> Morning</label>
      <label><input type="checkbox"> Afternoon</label>
      <label><input type="checkbox" checked> Night</label>
      <label><input type="checkbox" checked> After Food</label>
    </div>
  `;
  container.appendChild(newRow);
}

function removeDoctorMedicineRow(btn) {
  const row = btn.closest('.doc-rx-item-row');
  if (row) row.remove();
}

function saveDoctorPrescription() {
  const diagnosis = document.getElementById('doc-input-diagnosis').value;
  const rxDiagnosisText = document.getElementById('rx-diagnosis-text');
  if (rxDiagnosisText) rxDiagnosisText.textContent = diagnosis;

  updateDynamicIsland('Notes Saved & Synced 💾');
  speakText('Clinical notes and digital prescription synchronized to patient application.');
  alert('Prescription successfully saved and sent to patient phone via HeloDoc sync!');
}

// ==================== SCHEMES & SUBSIDIES ====================
function calculateSchemeEligibility() {
  const age = parseInt(document.getElementById('calc-age').value);
  const income = document.getElementById('calc-income').value;
  const resultBox = document.getElementById('eligibility-result-box');

  if (!resultBox) return;

  if (age >= 60) {
    resultBox.innerHTML = `
      <div class="res-badge">🎉 100% Eligible for Senior Concessions & PM-JAY!</div>
      <p>As a senior citizen (${age}y), you qualify for <strong>50% discount on all OPD visits and scans</strong> plus <strong>₹5,00,000 cashless cover</strong> under Ayushman Bharat.</p>
    `;
  } else if (income === 'low') {
    resultBox.innerHTML = `
      <div class="res-badge">🎉 Eligible for Ayushman Bharat (PM-JAY)!</div>
      <p>You qualify for <strong>₹5,00,000 full cashless hospitalization</strong> across all major surgeries and treatments.</p>
    `;
  } else {
    resultBox.innerHTML = `
      <div class="res-badge">✅ Eligible for Jan Aushadhi Low Cost Pharmacy</div>
      <p>Save up to <strong>90% on generic medications</strong> at hospital counter Room 004.</p>
    `;
  }
}

function renderSchemesCatalog() {
  const container = document.getElementById('schemes-list');
  if (!container) return;

  let html = '';
  healthSchemes.forEach(s => {
    html += `
      <div class="scheme-card">
        <div class="scheme-header-row">
          <div>
            <span class="scheme-badge">${s.badge}</span>
            <h3 class="mt-2">${s.name}</h3>
            <span style="font-size:0.74rem; color:var(--text-muted);">${s.type}</span>
          </div>
        </div>
        <p class="mt-2">${s.desc}</p>
        <div class="scheme-benefit-box">
          💰 Benefit: <strong>${s.coverage}</strong> (${s.discount})
        </div>
        <button class="btn btn-primary btn-full btn-sm" onclick="applySchemeSubsidyDirect('${s.name}')">
          ✅ Apply ${s.name.split(' ')[0]} Subsidy
        </button>
      </div>
    `;
  });
  container.innerHTML = html;
}

function applySchemeSubsidyDirect(schemeName) {
  updateDynamicIsland('Subsidy Applied 🏛️');
  speakText(`${schemeName} subsidy applied to your hospital billing account.`);
  alert(`${schemeName} applied! 50% discount will be reflected on your checkout invoice.`);
}

// ==================== HOME MEDICINE DELIVERY ====================
function openMedicineDeliveryModal() {
  const modal = document.getElementById('modal-medicine-delivery');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
  speakText('Select delivery address and speed for home medicine delivery from hospital pharmacy.');
}

function confirmHomeMedicineDeliveryOrder() {
  closeModal('modal-medicine-delivery');
  
  const statusBanner = document.getElementById('med-delivery-status-banner');
  if (statusBanner) {
    statusBanner.style.display = 'block';
  }

  updateDynamicIsland('Medicine Order Out 🚚');
  speakText('Home delivery order placed successfully! Express delivery estimated in 35 minutes to your home address.');

  if (typeof syncOrderToBackend === 'function') {
    syncOrderToBackend({
      medicines: state.medicines.map(m => m.name),
      patientName: state.patient.name,
      deliveryAddress: '42, 3rd Cross Street, Gandhinagar, Chennai - 600020',
      totalAmount: 210
    });
  }

  alert('🚚 Order Confirmed! Your prescribed medicines (Glucosamine, Pantoprazole, Calcimax & Diacerein) have been packed at Room 004 Hospital Pharmacy and are out for doorstep delivery.');
}

// ==================== ONLINE PAYMENTS & RECEIPT ====================
function openPaymentModal(itemType, amount) {
  const modal = document.getElementById('modal-payment');
  if (!modal) return;

  const totalAmountEl = document.getElementById('pay-total-amount');
  if (totalAmountEl && amount) {
    totalAmountEl.textContent = `₹${amount}.00`;
  }

  modal.classList.add('active');
  modal.style.display = 'flex';
  speakText(`Opening checkout window for hospital billing payment.`);
}

function selectPayMethod(method, el) {
  document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');

  const upiBox = document.getElementById('upi-input-box');
  if (upiBox) {
    upiBox.style.display = method === 'upi' ? 'block' : 'none';
  }
}

function processPaymentAndDownload() {
  closeModal('modal-payment');
  updateDynamicIsland('Payment Successful 💳');
  speakText('Payment received successfully. Official digital hospital receipt generated.');

  if (typeof syncPaymentToBackend === 'function') {
    syncPaymentToBackend({
      appointmentId: state.activeAppointment ? state.activeAppointment.token : '#A-14',
      amount: (state.activeAppointment && state.activeAppointment.finalPrice) || 250,
      paymentMethod: 'UPI / Card'
    });
  }

  const receiptModal = document.getElementById('modal-receipt');
  if (receiptModal) {
    receiptModal.classList.add('active');
    receiptModal.style.display = 'flex';
  }
}

function printReceipt() {
  window.print();
}

function downloadReceipt(invId) {
  const receiptModal = document.getElementById('modal-receipt');
  if (receiptModal) receiptModal.classList.add('open');
  speakText('Showing official digital receipt.');
}

// ==================== AI MULTILINGUAL VOICE GUIDE ====================
function openAIGuideModal() {
  const modal = document.getElementById('modal-ai-guide');
  if (modal) modal.classList.add('open');
  speakText('Hello, I am your HeloDoc Hospital Guide. How can I assist you today?');
}

function handleAiKeyPress(e) {
  if (e.key === 'Enter') sendAiUserMessage();
}

function sendAiUserMessage() {
  const input = document.getElementById('ai-text-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;

  appendAiMessage(text, 'user');
  input.value = '';

  // Query Backend AI endpoint or fallback to client NLP
  if (typeof callBackendAiChat === 'function') {
    callBackendAiChat(text, state.currentLang).then(aiResponse => {
      appendAiMessage(aiResponse, 'bot');
      speakText(aiResponse);
    });
  } else {
    setTimeout(() => {
      const aiResponse = generateAiGuideResponse(text);
      appendAiMessage(aiResponse, 'bot');
      speakText(aiResponse);
    }, 400);
  }
}

function sendAiQuickPrompt(prompt) {
  appendAiMessage(prompt, 'user');
  if (typeof callBackendAiChat === 'function') {
    callBackendAiChat(prompt, state.currentLang).then(response => {
      appendAiMessage(response, 'bot');
      speakText(response);
    });
  } else {
    setTimeout(() => {
      const response = generateAiGuideResponse(prompt);
      appendAiMessage(response, 'bot');
      speakText(response);
    }, 400);
  }
}

function appendAiMessage(text, sender) {
  const box = document.getElementById('ai-chat-box');
  if (!box) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'bot-bubble'}`;
  bubble.innerHTML = `<p>${text}</p>`;
  box.appendChild(bubble);
  box.scrollTop = box.scrollHeight;
}

function generateAiGuideResponse(query) {
  query = query.toLowerCase().trim();
  const lang = state.currentLang;

  // Room 401 / Dermatology
  if (query.includes('401') || query.includes('skin') || query.includes('derm') || query.includes('त्वचा') || query.includes('தோல்') || query.includes('చర్మం') || query.includes('ചർമ്മം') || query.includes('dermatol')) {
    if (lang === 'hi') return "डॉ. प्रिया रमेश का त्वचा रोग क्लिनिक (Dermatology Clinic) पहली मंजिल पर कमरा 401 में है। लिफ्ट ए से पहली मंजिल पर जाएं और दाएं मुड़ें।";
    if (lang === 'ta') return "டாக்டர் பிரியா ரமேஷ் அவர்களின் தோல் மருத்துவ கிளினிக் 1-வது மாடியில் அறை 401-ல் உள்ளது. லிஃப்ட் A வழியாக சென்று வலதுபுறம் செல்லவும்.";
    if (lang === 'te') return "డాక్టర్ ప్రియా రమేష్ గారి స్కిన్ క్లినిక్ 1వ అంతస్తులో రూమ్ 401లో ఉంది. లిఫ్ట్ A ద్వారా వెళ్ళండి.";
    if (lang === 'ml') return "ഡോ. പ്രിയ രമേഷിന്റെ ഡെർമറ്റോളജി ക്ലിനിക്ക് ഒന്നാം നിലയിൽ റൂം 401-ലാണ്. ലിഫ്റ്റ് A വഴി പോകുക.";
    if (lang === 'es') return "La clínica dermatológica de la Dra. Priya Ramesh se encuentra en la Habitación 401 del 1.er piso. Tome el Ascensor A.";
    return "Dr. Priya Ramesh's Dermatology Clinic is located in Room 401 on the 1st Floor. Take Elevator A to the 1st floor and walk straight.";
  }

  // Room 402 / Cardiology
  if (query.includes('402') || query.includes('cardio') || query.includes('heart') || query.includes('दिल') || query.includes('இதயம்') || query.includes('గుండె') || query.includes('ഹൃദയം') || query.includes('corazon')) {
    if (lang === 'hi') return "कार्डियोलॉजी (हृदय रोग) क्लिनिक पहली मंजिल पर कमरा 402 में है। डॉ. के. श्रीनिवास हृदय जांच के लिए उपलब्ध हैं।";
    if (lang === 'ta') return "கார்டியாலஜி (இதய நோய்) கிளினிக் 1-வது மாடியில் அறை 402-ல் உள்ளது. டாக்டர் கே. சீனிவாஸ் தயாராக உள்ளார்.";
    if (lang === 'te') return "కార్డియాలజీ క్లినిక్ 1వ అంతస్తులో రూమ్ 402లో ఉంది. డాక్టర్ కె. శ్రీనివాస్ లభ్యతలో ఉన్నారు.";
    if (lang === 'ml') return "കാർഡിയോളജി ക്ലിനിക്ക് ഒന്നാം നിലയിൽ റൂം 402-ലാണ്. ഡോ. കെ. ശ്രീനിവാസ് ലഭ്യമാണ്.";
    if (lang === 'es') return "La clínica de cardiología está en la Habitación 402 del 1.er piso (Dra. K. Srinivas).";
    return "Cardiology Clinic is located in Room 402 on the 1st Floor (Dr. K. Srinivas & Dr. Preeti Deshmukh).";
  }

  // Room 403 / Orthopedics
  if (query.includes('403') || query.includes('ortho') || query.includes('knee') || query.includes('joint') || query.includes('bone') || query.includes('हड्डी') || query.includes('எலும்பு') || query.includes('ఎముక') || query.includes('അസ്ഥി')) {
    if (lang === 'hi') return "डॉ. राजेश कुमार का हड्डी और जोड़ रोग (Orthopedic Clinic) पहली मंजिल पर कमरा 403 में है। घुटने के दर्द और ऑर्थो उपचार उपलब्ध है।";
    if (lang === 'ta') return "டாக்டர் ராஜேஷ் குமார் அவர்களின் எலும்பு மற்றும் மூட்டு கிளினிக் 1-வது மாடியில் அறை 403-ல் உள்ளது.";
    if (lang === 'te') return "డాక్టర్ రాజేష్ కుమార్ గారి ఆర్థోపెడిక్ క్లినిక్ 1వ అంతస్తులో రూమ్ 403లో ఉంది.";
    if (lang === 'ml') return "ഡോ. രാജേഷ് കുമാറിന്റെ ഓർത്തോപെഡിക് ക്ലിനിക്ക് ഒന്നാം നിലയിൽ റൂം 403-ലാണ്.";
    if (lang === 'es') return "La clínica ortopédica del Dr. Rajesh Kumar se encuentra en la Habitación 403 del 1.er piso.";
    return "Dr. Rajesh Kumar's Orthopedic Clinic is located in Room 403 on the 1st Floor (Bone, Joint & Spine Care).";
  }

  // Room 404 / ICU
  if (query.includes('404') || query.includes('icu') || query.includes('critical') || query.includes('गंभीर') || query.includes('തീവ്ര')) {
    if (lang === 'hi') return "इंटेन्सिव केयर यूनिट (ICU) दूसरी मंजिल पर कमरा 404 में स्थित है।";
    if (lang === 'ta') return "தீவிர சிகிச்சை பிரிவு (ICU) 2-வது மாடியில் அறை 404-ல் உள்ளது.";
    if (lang === 'te') return "ఇంటెన్సివ్ కేర్ యూనిట్ (ICU) 2వ అంతస్తులో రూమ్ 404లో ఉంది.";
    if (lang === 'ml') return "ഐസിയു (ICU) രണ്ടാം നിലയിൽ റൂം 404-ലാണ്.";
    if (lang === 'es') return "La Unidad de Cuidados Intensivos (ICU) está en la Habitación 404 del 2.º piso.";
    return "Intensive Care Unit (ICU) is located in Room 404 on the 2nd Floor.";
  }

  // Room 405 / Ward
  if (query.includes('405') || query.includes('ward') || query.includes('patient') || query.includes('वर्ड') || query.includes('வார்டு')) {
    if (lang === 'hi') return "सामान्य मरीज वार्ड (Normal Patient Ward) दूसरी मंजिल पर कमरा 405 में है।";
    if (lang === 'ta') return "சாதாரண நோயாளி வார்டு 2-வது மாடியில் அறை 405-ல் உள்ளது.";
    if (lang === 'te') return "సాధారణ పేషెంట్ వార్డు 2వ అంతస్తులో రూమ్ 405లో ఉంది.";
    if (lang === 'ml') return "സാധാരണ പേഷ്യന്റ് വാർഡ് രണ്ടാം നിലയിൽ റൂം 405-ലാണ്.";
    if (lang === 'es') return "La Sala Normal de Pacientes se encuentra en la Habitación 405 del 2.º piso.";
    return "Normal Patient Ward is located in Room 405 on the 2nd Floor.";
  }

  // Room 406-410 / Postnatal Ward
  if (query.includes('406') || query.includes('407') || query.includes('408') || query.includes('409') || query.includes('410') || query.includes('postnatal') || query.includes('maternity') || query.includes('baby') || query.includes('प्रसूति') || query.includes('மகப்பேறு')) {
    if (lang === 'hi') return "पोस्टनेटल प्रसूति वार्ड (Postnatal Ward) तीसरी मंजिल पर कमरा 406 से 410 में स्थित है।";
    if (lang === 'ta') return "பிரசவத்திற்கு பிந்தைய மகப்பேறு வார்டு 3-வது மாடியில் அறை 406 முதல் 410 வரை உள்ளது.";
    if (lang === 'te') return "పోస్ట్ నాటల్ ప్రసూతి వార్డు 3వ అంతస్తులో రూమ్ 406 నుండి 410 వరకు ఉంది.";
    if (lang === 'ml') return "പോസ്റ്റ്നാറ്റൽ പ്രസവ വാർഡ് മൂന്നാം നിലയിൽ റൂം 406 മുതൽ 410 വരെയാണ്.";
    if (lang === 'es') return "La Sala de Posparto se encuentra en el 3.er piso, Habitaciones 406 a 410.";
    return "Postnatal Maternity Wards are located on the 3rd Floor in Rooms 406 to 410.";
  }

  // Medicine Home Delivery & Courier
  if (query.includes('delivery') || query.includes('home') || query.includes('courier') || query.includes('order') || query.includes('डिलीवरी') || query.includes('घर') || query.includes('டெலிவரி') || query.includes('டோர்ஸ்டெப்') || query.includes('డెలివరీ') || query.includes('ഡെലിവറി') || query.includes('entrega')) {
    if (lang === 'hi') return "जन औषधि फार्मेसी (कमरा 004) से आपकी दवाइयां डिलीवरी पार्टनर कार्तिक सेल्वाम द्वारा भेजी जा चुकी हैं। अनुमानित समय 12 मिनट है। डिलीवरी ओटीपी 4829 है।";
    if (lang === 'ta') return "ஜன் ஔஷதி மருந்தகத்திலிருந்து உங்கள் மருந்துகள் டெலிவரி பார்ட்னர் கார்த்திக் செல்வம் மூலம் அனுப்பப்பட்டுள்ளது. வருகை நேரம் 12 நிமிடங்கள். டெலிவரி OTP 4829.";
    if (lang === 'te') return "జన్ ఔషధి ఫార్మసీ నుండి మీ మందులు డెలివరీ పార్టనర్ కార్తీక్ సెల్వం ద్వారా రవాణాలో ఉన్నాయి. రాక సమయం 12 నిమిషాలు. OTP 4829.";
    if (lang === 'ml') return "ജൻ ഔഷധി ഫാർമസിയിൽ നിന്ന് മരുന്നുകൾ കാർത്തിക് സെൽവം എത്തിക്കുന്നു. 12 മിനിറ്റിനകം എത്തും. നിങ്ങളുടെ OTP 4829 ആണ്.";
    if (lang === 'es') return "Sus medicamentos de la Farmacia Jan Aushadhi están en camino con el repartidor Karthik Selvam. Tiempo estimado: 12 minutos. Su código OTP es 4829.";
    return "Your prescribed medicines from Jan Aushadhi Pharmacy (Room 004) are Out for Delivery by partner Karthik Selvam. ETA is 12 minutes. Your secure delivery OTP is 4829.";
  }

  // Medicines & Dosage Reminders
  if (query.includes('medicine') || query.includes('pill') || query.includes('dose') || query.includes('timing') || query.includes('दवा') || query.includes('மருந்து') || query.includes('మందు') || query.includes('മരുന്ന്') || query.includes('medicamento')) {
    if (lang === 'hi') return "आपकी दैनिक दवाएं: सुबह नाश्ते के बाद ग्लूकोसामाइन, नाश्ते से पहले पेंटोप्राजोल, दोपहर में कैल्शियम और रात को डायसेरिन। आप होम डिलीवरी भी मंगवा सकते हैं।";
    if (lang === 'ta') return "உங்கள் மருந்துகள்: காலை உணவுக்குப் பின் குளுக்கோசமைன், உணவுக்கு முன் பான்டோபிரசோல், மதியம் கால்சியம், இரவில் டயாசெரின். வீட்டு டெலிவரி வசதியும் உள்ளது.";
    if (lang === 'te') return "మీ నేటి మందులు: ఉదయం గ్లూకోసమైన్, భోజనానికి ముందు పాంటోప్రజోల్, మధ్యాహ్నం కాల్షియం, రాత్రి డయాసిరిన్. మీరు హోమ్ డెలివరీ పొందవచ్చు.";
    if (lang === 'ml') return "നിങ്ങളുടെ മരുന്നുകൾ: രാവിലെ ഗ്ലൂക്കോസാമൈൻ, ഭക്ഷണത്തിന് മുമ്പ് പാന്റോപ്രാസോൾ, ഉച്ചയ്ക്ക് കാൽസ്യം, രാത്രി ഡയസെറിൻ. ഹോം ഡെലിവറി ലഭ്യമാണ്.";
    if (lang === 'es') return "Sus medicamentos: Glucosamina por la mañana con desayuno, Pantoprazol antes de comer, Calcio al almuerzo y Diacereína por la noche.";
    return "Your daily medicines: Glucosamine (Morning after food), Pantoprazole (Morning before food), Calcium (Afternoon), and Diacerein (Night after dinner).";
  }

  // Government Health Schemes & Subsidies
  if (query.includes('scheme') || query.includes('ayushman') || query.includes('subsidy') || query.includes('discount') || query.includes('योजना') || query.includes('आयुष्मान') || query.includes('திட்டம்') || query.includes('రాయితీ') || query.includes('പദ്ധതി') || query.includes('descuento')) {
    if (lang === 'hi') return "आयुष्मान भारत योजना और वरिष्ठ नागरिक कल्याण के अंतर्गत ओपीडी परामर्श पर 50% छूट और जन औषधि फार्मेसी से दवाओं पर 90% तक की छूट मिलती है।";
    if (lang === 'ta') return "ஆயுஷ்மான் பாரத் மற்றும் முதியோர் நலத்திட்டத்தின் கீழ் ஆலோசனை கட்டணத்தில் 50% தள்ளுபடியும், மருந்துகளுக்கு 90% வரை சேமிப்பும் உண்டு.";
    if (lang === 'te') return "ఆయుష్మాన్ భారత్ మరియు సీనియర్ సిటిజన్ పథకాల ద్వారా మీకు కన్సల్టేషన్‌లో 50% తగ్గింపు మరియు మందులపై 90% వరకు రాయితీ లభిస్తుంది.";
    if (lang === 'ml') return "ആയുഷ്മാൻ ഭാരത് പദ്ധതി വഴി കൺസൾട്ടേഷനിൽ 50% ഇളവും മരുന്നുകൾക്ക് 90% വരെ വിലക്കുറവും ലഭിക്കും.";
    if (lang === 'es') return "Bajo los convenios gubernamentales y descuentos de adulto mayor, usted recibe 50% de descuento en consultas y hasta 90% en farmacia genérica.";
    return "Under Ayushman Bharat PM-JAY and Senior Citizen Welfare Concessions, you receive 50% discount on OPD consultations and up to 90% savings on generic medications.";
  }

  // Emergency SOS
  if (query.includes('emergency') || query.includes('sos') || query.includes('ambulance') || query.includes('आपातकालीन') || query.includes('அவசரம்') || query.includes('అత్యవసరం') || query.includes('അടിയന്തരം') || query.includes('urgencia')) {
    if (lang === 'hi') return "गंभीर आपात स्थिति में तुरंत लाल एसओएस (SOS) बटन दबाएं या राष्ट्रीय एम्बुलेंस 108 पर कॉल करें। ट्रॉमा सेंटर भूतल पर कमरा 001 में है।";
    if (lang === 'ta') return "அவசர சிகிச்சைக்கு உடனே சிவப்பு SOS பட்டனை அழுத்தவும் அல்லது ஆம்புலன்ஸ் 108 ஐ அழைக்கவும். அவசர பிரிவு தரைத்தளத்தில் அறை 001-ல் உள்ளது.";
    if (lang === 'te') return "తీవ్ర అత్యవసర పరిస్థితుల్లో వెంటనే ఎరుపు SOS బటన్ నొక్కండి లేదా అంబులెన్స్ 108 కి కాల్ చేయండి. అత్యవసర గది గ్రౌండ్ ఫ్లోర్‌లో రూమ్ 001.";
    if (lang === 'ml') return "അടിയന്തര സാഹചര്യങ്ങളിൽ ചുവപ്പ് SOS ബട്ടൺ അമർത്തുക അല്ലെങ്കിൽ ആംബുലൻസ് 108 വിളിക്കുക. ട്രോമ കെയർ ഗ്രൗണ്ട് ഫ്ലോർ റൂം 001-ലാണ്.";
    if (lang === 'es') return "Para emergencias médicas, presione el botón rojo de SOS o llame al 112 / 108. La sala de Urgencias está en la Planta Baja, Habitación 001.";
    return "For medical emergencies, tap the red SOS button immediately or call Ambulance at 108. Trauma Ward is in Room 001 on the Ground Floor.";
  }

  // Default multilingual fallback
  if (lang === 'hi') return "मैं आपका हेलोडॉक अस्पताल गाइड हूँ। आप मुझसे कमरा नंबर (जैसे 401, 402), डॉक्टर, दवाइयों का समय या सरकारी योजनाओं के बारे में पूछ सकते हैं।";
  if (lang === 'ta') return "நான் உங்கள் ஹெலோடாக் மருத்துவமனை வழிகாட்டி. அறை எண்கள் (401, 402), மருத்துவர்கள், மருந்துகள் மற்றும் அரசு திட்டங்கள் குறித்து என்னிடம் கேட்கலாம்.";
  if (lang === 'te') return "నేను మీ హ‌లోడాక్ హాస్పిటల్ గైడ్‌ని. రూమ్ నంబర్లు (401, 402), డాక్టర్లు, మందులు మరియు ప్రభుత్వ పథకాల గురించి నన్ను అడగవచ్చు.";
  if (lang === 'ml') return "ഞാൻ നിങ്ങളുടെ ഹെലോഡോക് ഹോസ്പിറ്റൽ ഗൈഡ് ആണ്. റൂം നമ്പറുകൾ (401, 402), ഡോക്ടർമാർ, മരുന്നുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.";
  if (lang === 'es') return "Soy su guía médico de HeloDoc. Puede preguntarme sobre habitaciones (ej. 401, 402), médicos, medicamentos o descuentos gubernamentales.";
  return "I am your HeloDoc Hospital Guide. Ask me for room directions (e.g. Room 401, 402, 403, 404, 405, 406-410), doctor appointments, medicines, or government schemes in your language.";
}

function toggleSpeechRecognition() {
  const micBtn = document.getElementById('ai-mic-btn');
  if (micBtn) micBtn.classList.add('recording');

  const listeningPhrases = {
    hi: "सुन रहा हूँ... बोलिए",
    ta: "கேட்கிறேன்... பேசுங்கள்",
    te: "వింటున్నాను... మాట్లాడండి",
    ml: "ശ്രദ്ധിക്കുന്നു... പറയൂ",
    es: "Escuchando... Hable por favor",
    en: "Listening... Please speak"
  };
  speakText(listeningPhrases[state.currentLang] || listeningPhrases.en);

  simulateVoiceInput((spoken) => {
    if (micBtn) micBtn.classList.remove('recording');
    const input = document.getElementById('ai-text-input');
    if (input) {
      input.value = spoken;
      sendAiUserMessage();
    }
  });
}

function simulateVoiceInput(callback) {
  const langMap = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    ml: 'ml-IN',
    es: 'es-ES'
  };
  const currentVoiceLang = langMap[state.currentLang] || 'en-US';

  // Try Web Speech API if supported
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = currentVoiceLang;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript);
    };
    recognition.onerror = () => {
      fallbackPrompt(callback);
    };
    try {
      recognition.start();
      return;
    } catch (e) {
      fallbackPrompt(callback);
    }
  } else {
    fallbackPrompt(callback);
  }
}

function fallbackPrompt(callback) {
  const prompts = [
    "Which room is Dr. Rajesh Kumar in?",
    "How to get free Govt treatment under Ayushman Bharat?",
    "When should I take my knee pain medicines?",
    "Guide me to the hospital pharmacy room"
  ];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  setTimeout(() => callback(randomPrompt), 1200);
}

function startVoiceRecognition() {
  openAIGuideModal();
  toggleSpeechRecognition();
}

// ==================== EMERGENCY SOS & CAREGIVER ====================
function triggerSOSModal() {
  const modal = document.getElementById('modal-sos');
  if (modal) modal.classList.add('open');
  speakText('Emergency SOS activated. Contacting City Care emergency desk and hospital ambulance.');
}

function callHospitalAmbulance() {
  alert('Connecting call to Hospital Emergency Ambulance Service (108 / +91 44 2800 1234)...');
  speakText('Calling hospital ambulance desk.');
}

function alertCaregiverSMS() {
  alert('Emergency SMS with live GPS hospital coordinates sent to Kavitha R (Daughter): "SOS! Mr. Ramachandran triggered emergency alert at City Care Hospital Ground Floor."');
  speakText('Emergency SMS and GPS coordinates sent to your family.');
}

function callCaregiver() {
  alert('Calling primary caregiver: Kavitha R (Daughter) at +91 98765 43210...');
  speakText('Calling daughter Kavitha.');
}

// ==================== DATA SHARING & HEALTH CARD ====================
function shareHealthData() {
  const modal = document.getElementById('modal-share');
  if (modal) modal.classList.add('open');
}

function shareViaWhatsApp() {
  alert('Health Card & Prescriptions shared to WhatsApp (+91 98765 43210 - Kavitha R)!');
  closeModal('modal-share');
}

function shareViaSMS() {
  alert('Prescription summary and Room 104 token sent via SMS!');
  closeModal('modal-share');
}

function downloadMedicalSummaryPDF() {
  alert('Downloading HeloDoc_Medical_Summary_Ramachandran.pdf...');
  closeModal('modal-share');
}

// ==================== MODAL HELPER ====================
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

// ==================== 3D VIEWPORT MEDICAL AMBIANCE (THREE.JS) ====================
function initMedical3DBackground() {
  const container = document.getElementById('medical-3d-bg-canvas');
  if (!container || typeof THREE === 'undefined') return;

  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
  camera.position.set(0, 12, 36);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.6);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(20, 30, 20);
  scene.add(dirLight);

  // Undulating Particle Wave
  const numX = 45;
  const numZ = 45;
  const numParticles = numX * numZ;
  const positions = new Float32Array(numParticles * 3);
  const colors = new Float32Array(numParticles * 3);
  const c1 = new THREE.Color(0x0284c7);
  const c2 = new THREE.Color(0x00d2ff);

  let pIdx = 0;
  for (let ix = 0; ix < numX; ix++) {
    for (let iz = 0; iz < numZ; iz++) {
      positions[pIdx * 3] = (ix - numX / 2) * 1.8;
      positions[pIdx * 3 + 1] = 0;
      positions[pIdx * 3 + 2] = (iz - numZ / 2) * 1.8;

      const ratio = (ix + iz) / (numX + numZ);
      const c = c1.clone().lerp(c2, ratio);
      colors[pIdx * 3] = c.r;
      colors[pIdx * 3 + 1] = c.g;
      colors[pIdx * 3 + 2] = c.b;
      pIdx++;
    }
  }

  const waveGeo = new THREE.BufferGeometry();
  waveGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  waveGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const waveMat = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const wavePoints = new THREE.Points(waveGeo, waveMat);
  wavePoints.position.y = -14;
  scene.add(wavePoints);

  // Floating 3D Cross
  const crossGroup = new THREE.Group();
  const crossMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.5,
    metalness: 0.4
  });
  const b1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 1.1), crossMat);
  const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 3.6, 1.1), crossMat);
  crossGroup.add(b1);
  crossGroup.add(b2);
  crossGroup.position.set(-20, 10, -5);
  scene.add(crossGroup);

  const cross2 = crossGroup.clone();
  cross2.position.set(20, 12, -4);
  cross2.scale.set(0.7, 0.7, 0.7);
  scene.add(cross2);

  // Mouse Parallax
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  window.addEventListener('pointermove', (e) => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;

    camera.position.x = mouseX * 4;
    camera.position.y = 12 + mouseY * 3;
    camera.lookAt(0, 0, 0);

    const pos = waveGeo.attributes.position;
    let idx = 0;
    for (let ix = 0; ix < numX; ix++) {
      for (let iz = 0; iz < numZ; iz++) {
        pos.array[idx * 3 + 1] = Math.sin(ix * 0.3 + elapsed * 1.4) * 2 + Math.cos(iz * 0.25 + elapsed * 1.2) * 1.6;
        idx++;
      }
    }
    pos.needsUpdate = true;

    crossGroup.rotation.y = elapsed * 0.4;
    crossGroup.position.y = 10 + Math.sin(elapsed * 0.7) * 1.2;
    cross2.rotation.y = -elapsed * 0.5;
    cross2.position.y = 12 + Math.cos(elapsed * 0.8) * 1;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    if (!container) return;
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

// ==================== IN-APP 3D MEDICAL HELIX & MOLECULES (THREE.JS) ====================
function initInApp3DCanvas() {
  const canvas = document.getElementById('in-app-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const parent = canvas.parentElement;
  let width = parent.clientWidth || 390;
  let height = parent.clientHeight || 844;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(0, 0, 24);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient & Directional Lighting
  const ambLight = new THREE.AmbientLight(0x38bdf8, 0.8);
  scene.add(ambLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(10, 20, 15);
  scene.add(dirLight);

  // Floating 3D DNA Helix Structure
  const dnaGroup = new THREE.Group();
  const baseCount = 28;
  const radius = 3.2;
  const heightStep = 0.95;
  const sphereGeo = new THREE.SphereGeometry(0.28, 12, 12);
  const matCyan = new THREE.MeshStandardMaterial({
    color: 0x00d2ff,
    emissive: 0x0284c7,
    emissiveIntensity: 0.8,
    metalness: 0.3,
    roughness: 0.2
  });
  const matBlue = new THREE.MeshStandardMaterial({
    color: 0x818cf8,
    emissive: 0x4338ca,
    emissiveIntensity: 0.7,
    metalness: 0.3,
    roughness: 0.2
  });
  const barMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.45
  });

  for (let i = 0; i < baseCount; i++) {
    const angle = i * 0.42;
    const y = (i - baseCount / 2) * heightStep;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const sphere1 = new THREE.Mesh(sphereGeo, matCyan);
    sphere1.position.set(x1, y, z1);
    dnaGroup.add(sphere1);

    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;
    const sphere2 = new THREE.Mesh(sphereGeo, matBlue);
    sphere2.position.set(x2, y, z2);
    dnaGroup.add(sphere2);

    if (i % 2 === 0) {
      const lineGeo = new THREE.CylinderGeometry(0.05, 0.05, radius * 2, 6);
      lineGeo.rotateZ(Math.PI / 2);
      lineGeo.rotateY(-angle);
      const bar = new THREE.Mesh(lineGeo, barMat);
      bar.position.set(0, y, 0);
      dnaGroup.add(bar);
    }
  }

  dnaGroup.position.set(4.5, -2, -6);
  dnaGroup.rotation.z = 0.18;
  scene.add(dnaGroup);

  // Floating Micro-Molecules
  const moleculeCount = 18;
  const moleculeGeo = new THREE.IcosahedronGeometry(0.35, 0);
  const moleculeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.3,
    metalness: 0.5,
    wireframe: true
  });
  const molecules = [];
  for (let m = 0; m < moleculeCount; m++) {
    const mesh = new THREE.Mesh(moleculeGeo, moleculeMat);
    mesh.position.set(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 26,
      (Math.random() - 0.5) * 10 - 2
    );
    mesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.03,
      rotSpeedY: (Math.random() - 0.5) * 0.03,
      floatSpeed: 0.5 + Math.random() * 0.8,
      baseY: mesh.position.y
    };
    scene.add(mesh);
    molecules.push(mesh);
  }

  let clock = new THREE.Clock();
  function animateInApp() {
    requestAnimationFrame(animateInApp);
    const elapsed = clock.getElapsedTime();

    dnaGroup.rotation.y = elapsed * 0.45;
    dnaGroup.position.y = -2 + Math.sin(elapsed * 0.8) * 0.6;

    molecules.forEach(m => {
      m.rotation.x += m.userData.rotSpeedX;
      m.rotation.y += m.userData.rotSpeedY;
      m.position.y = m.userData.baseY + Math.sin(elapsed * m.userData.floatSpeed) * 0.8;
    });

    renderer.render(scene, camera);
  }
  animateInApp();

  function resizeInApp() {
    if (!parent) return;
    const w = parent.clientWidth || 390;
    const h = parent.clientHeight || 844;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  if (window.ResizeObserver) {
    new ResizeObserver(resizeInApp).observe(parent);
  }
}
window.initInApp3DCanvas = initInApp3DCanvas;

// Auto-initialize 3D background when page loads
function initAll3DAmbiance() {
  initMedical3DBackground();
  initInApp3DCanvas();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll3DAmbiance);
} else {
  initAll3DAmbiance();
}

// ========================================================
// 3D HOSPITAL DIGITAL TWIN MAP ENGINE (THREE.JS WEBGL)
// ========================================================
let map3dScene = null;
let map3dCamera = null;
let map3dRenderer = null;
let map3dAnimId = null;
let mapFloorGroups = {};
let mapTargetBeacon = null;
let mapBeaconLight = null;
let mapPathParticles = null;
let mapPathTube = null;
let map3dInitialized = false;
let autoTourActive = false;
let current3DCamMode = 'isometric';
let mapCameraAngle = { theta: Math.PI / 4, phi: Math.PI / 3, radius: 36 };
let targetCameraPos = typeof THREE !== 'undefined' ? new THREE.Vector3(26, 24, 26) : null;
let targetLookAtPos = typeof THREE !== 'undefined' ? new THREE.Vector3(0, 4, 0) : null;
let currentLookAt = typeof THREE !== 'undefined' ? new THREE.Vector3(0, 4, 0) : null;

function setHospitalMapMode(mode) {
  const btn3D = document.getElementById('btn-map-mode-3d');
  const btn2D = document.getElementById('btn-map-mode-2d');
  const viewport3D = document.getElementById('hospital-3d-viewport');
  const area2D = document.getElementById('map-canvas-area');

  if (mode === '3d') {
    if (btn3D) btn3D.classList.add('active');
    if (btn2D) btn2D.classList.remove('active');
    if (viewport3D) viewport3D.style.display = 'block';
    if (area2D) area2D.style.display = 'none';
    initHospital3DMap();
    speakText('Switched to 3D Digital Twin Hospital Navigator.');
  } else {
    if (btn3D) btn3D.classList.remove('active');
    if (btn2D) btn2D.classList.add('active');
    if (viewport3D) viewport3D.style.display = 'none';
    if (area2D) area2D.style.display = 'block';
    renderFloorMap(state.currentFloor);
    speakText('Switched to 2D Architectural Floor Plan.');
  }
}
window.setHospitalMapMode = setHospitalMapMode;

function set3DCameraAngle(mode) {
  if (typeof THREE === 'undefined' || !targetCameraPos) return;
  current3DCamMode = mode;
  const btns = ['iso', 'walk', 'top'];
  btns.forEach(b => {
    const el = document.getElementById(`btn-3d-cam-${b}`);
    if (el) el.classList.remove('active');
  });

  const activeBtn = document.getElementById(`btn-3d-cam-${mode === 'isometric' ? 'iso' : mode === 'walk' ? 'walk' : 'top'}`);
  if (activeBtn) activeBtn.classList.add('active');

  autoTourActive = false;
  const tourBtn = document.getElementById('btn-3d-cam-tour');
  if (tourBtn) tourBtn.classList.remove('active');

  if (mode === 'isometric') {
    mapCameraAngle.theta = Math.PI / 4;
    mapCameraAngle.phi = Math.PI / 3;
    targetCameraPos.set(26, 24, 26);
    targetLookAtPos.set(0, 4, 0);
  } else if (mode === 'walk') {
    // Eye-level low angle hallway corridor view
    targetCameraPos.set(0, 5.5, 9);
    targetLookAtPos.set(4, 4.8, 3);
  } else if (mode === 'topdown') {
    // Overhead architectural plan
    targetCameraPos.set(0, 38, 0.1);
    targetLookAtPos.set(0, 0, 0);
  }
}
window.set3DCameraAngle = set3DCameraAngle;

function toggle3DAutoTour() {
  autoTourActive = !autoTourActive;
  const tourBtn = document.getElementById('btn-3d-cam-tour');
  if (tourBtn) {
    if (autoTourActive) {
      tourBtn.classList.add('active');
      speakText('3D Hospital auto-tour active.');
    } else {
      tourBtn.classList.remove('active');
    }
  }
}
window.toggle3DAutoTour = toggle3DAutoTour;

function zoom3D(factor) {
  if (!mapCameraAngle || !targetCameraPos || !targetLookAtPos) return;
  mapCameraAngle.radius = Math.max(12, Math.min(60, mapCameraAngle.radius * factor));
  targetCameraPos.x = targetLookAtPos.x + mapCameraAngle.radius * Math.sin(mapCameraAngle.phi) * Math.sin(mapCameraAngle.theta);
  targetCameraPos.y = targetLookAtPos.y + mapCameraAngle.radius * Math.cos(mapCameraAngle.phi);
  targetCameraPos.z = targetLookAtPos.z + mapCameraAngle.radius * Math.sin(mapCameraAngle.phi) * Math.cos(mapCameraAngle.theta);
}
window.zoom3D = zoom3D;

function focus3DTarget() {
  if (!targetLookAtPos || !targetCameraPos) return;
  autoTourActive = false;
  set3DCameraAngle('isometric');
  const targetRoom = state.activeAppointment?.room || 'Room 104';
  const hudTarget = document.getElementById('hud-target-indicator');
  if (hudTarget) hudTarget.textContent = `Target: ${targetRoom} • 1st Floor OPD`;
  speakText(`Camera focused on target ${targetRoom}, Dr. Rajesh Kumar Orthopedics.`);
}
window.focus3DTarget = focus3DTarget;

function focus3DFacility(roomNo, floorKey) {
  state.currentFloor = floorKey;
  switchFloor(floorKey);

  const chips = document.querySelectorAll('.facility-chip');
  chips.forEach(c => {
    if (c.textContent.includes(roomNo)) c.classList.add('active');
    else c.classList.remove('active');
  });

  const floorNames = {
    ground: 'Ground Floor',
    floor1: '1st Floor',
    floor2: '2nd Floor',
    floor3: '3rd Floor'
  };
  const floorName = floorNames[floorKey] || '1st Floor';
  quickGuideToRoom(roomNo, floorName);

  if (map3dScene && targetLookAtPos && targetCameraPos) {
    const floorHeights = { ground: 0.3, floor1: 4.5, floor2: 9.0, floor3: 13.5 };
    const y = floorHeights[floorKey] || 4.5;
    
    let roomX = 7, roomZ = 3;
    if (roomNo === 'Room 001') { roomX = -7; roomZ = 3; }
    else if (roomNo === 'Room 004') { roomX = 7; roomZ = 3; }
    else if (roomNo === 'Room 007') { roomX = -7; roomZ = -4.5; }
    else if (roomNo === 'Room 009') { roomX = 7; roomZ = -4.5; }
    else if (roomNo === 'Room 401') { roomX = -7; roomZ = 3; }
    else if (roomNo === 'Room 402') { roomX = 7; roomZ = -4.5; }
    else if (roomNo === 'Room 403') { roomX = 7; roomZ = 3; }
    else if (roomNo === 'Room 404') { roomX = -7; roomZ = 3; }
    else if (roomNo === 'Room 405') { roomX = 7; roomZ = 3; }
    else if (roomNo === 'Room 406') { roomX = -7; roomZ = 3; }

    if (mapTargetBeacon) {
      mapTargetBeacon.position.set(roomX, y + 4.0, roomZ);
    }
    if (mapBeaconLight) {
      mapBeaconLight.position.set(roomX, y + 4.0, roomZ);
    }
    targetLookAtPos.set(roomX, y + 1.2, roomZ);
    targetCameraPos.set(roomX + 16, y + 15, roomZ + 16);

    const hudTarget = document.getElementById('hud-target-indicator');
    if (hudTarget) hudTarget.textContent = `Target: ${roomNo} • ${floorName}`;
  }
}
window.focus3DFacility = focus3DFacility;

function update3DFloorFocus(floorKey) {
  if (!map3dScene) return;
  const floorHeights = { ground: 0.3, floor1: 4.5, floor2: 9.0, floor3: 13.5 };
  const targetY = floorHeights[floorKey] || 4.5;
  if (targetLookAtPos) targetLookAtPos.y = targetY;

  // Highlight selected floor rooms with full opacity, soften other floors
  Object.keys(mapFloorGroups).forEach(k => {
    const grp = mapFloorGroups[k];
    if (!grp) return;
    const isCurrent = (k === floorKey);
    grp.traverse(child => {
      if (child.isMesh && child.material && child.userData && child.userData.roomNo) {
        child.material.opacity = isCurrent ? 0.94 : 0.32;
        child.material.transparent = true;
      }
    });
  });
}
window.update3DFloorFocus = update3DFloorFocus;

function initHospital3DMap() {
  const container = document.getElementById('hospital-3d-webgl-canvas');
  if (!container || typeof THREE === 'undefined') return;

  if (map3dInitialized && map3dRenderer) {
    const w = container.clientWidth || 380;
    const h = container.clientHeight || 390;
    map3dCamera.aspect = w / h;
    map3dCamera.updateProjectionMatrix();
    map3dRenderer.setSize(w, h);
    return;
  }

  container.innerHTML = '';
  const width = container.clientWidth || 380;
  const height = container.clientHeight || 390;

  map3dScene = new THREE.Scene();
  map3dScene.background = new THREE.Color(state.elderMode ? 0x090e17 : 0x070b14);

  targetCameraPos = new THREE.Vector3(26, 24, 26);
  targetLookAtPos = new THREE.Vector3(0, 4, 0);
  currentLookAt = new THREE.Vector3(0, 4, 0);

  map3dCamera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  map3dCamera.position.copy(targetCameraPos);
  map3dCamera.lookAt(targetLookAtPos);

  map3dRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  map3dRenderer.setSize(width, height);
  map3dRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  map3dRenderer.shadowMap.enabled = true;
  container.appendChild(map3dRenderer.domElement);

  // Lighting System
  const ambient = new THREE.AmbientLight(0xffffff, 0.92);
  map3dScene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
  dirLight.position.set(25, 40, 20);
  dirLight.castShadow = true;
  map3dScene.add(dirLight);

  const pointLight = new THREE.PointLight(0x38bdf8, 1.4, 60);
  pointLight.position.set(0, 12, 0);
  map3dScene.add(pointLight);

  // Ground Base Plate & Digital Floor Matrix
  const baseGeo = new THREE.BoxGeometry(28, 0.6, 24);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.5, metalness: 0.2 });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.3;
  baseMesh.receiveShadow = true;
  map3dScene.add(baseMesh);

  const gridHelper = new THREE.GridHelper(32, 24, 0x0284c7, 0x1e293b);
  gridHelper.position.y = 0.02;
  map3dScene.add(gridHelper);

  // Helper to look up room metadata
  function getRoomInfo(roomNo) {
    for (const f in hospitalRoomsData) {
      const found = hospitalRoomsData[f].find(r => r.room === roomNo || r.room.includes(roomNo));
      if (found) return found;
    }
    return null;
  }

  // Create Photographic Canvas Texture for Top Surface of 3D Room Box
  function createRoomTopCanvasTexture(roomNo, name, type, colorHex, imgUrl, icon) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    function drawCanvas(roomImage) {
      // 1. Draw photographic background
      if (roomImage) {
        ctx.drawImage(roomImage, 0, 0, 512, 512);
      } else {
        // Fallback gradient
        const grad = ctx.createLinearGradient(0, 0, 512, 512);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);
      }

      // 2. Dark readability scrim / vignette
      const scrim = ctx.createLinearGradient(0, 0, 0, 512);
      scrim.addColorStop(0, 'rgba(15, 23, 42, 0.70)');
      scrim.addColorStop(0.45, 'rgba(15, 23, 42, 0.35)');
      scrim.addColorStop(1, 'rgba(15, 23, 42, 0.92)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, 512, 512);

      // 3. High-Contrast Senior Room Badge Pill at Top
      const badgeColor = typeof colorHex === 'number' ? '#' + colorHex.toString(16).padStart(6, '0') : (colorHex || '#1d4ed8');
      ctx.fillStyle = badgeColor;
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 10;
      
      const rx = 24, ry = 24, rw = 464, rh = 90, rRadius = 20;
      ctx.beginPath();
      ctx.moveTo(rx + rRadius, ry);
      ctx.lineTo(rx + rw - rRadius, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rRadius);
      ctx.lineTo(rx + rw, ry + rh - rRadius);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rRadius, ry + rh);
      ctx.lineTo(rx + rRadius, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rRadius);
      ctx.lineTo(rx, ry + rRadius);
      ctx.quadraticCurveTo(rx, ry, rx + rRadius, ry);
      ctx.closePath();
      ctx.fill();

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Badge text
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px Outfit, Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${icon || '📍'} ${roomNo}`, 256, 68);

      // 4. Large bold white room name with drop shadow
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Outfit, Inter, sans-serif';
      const displayName = name.length > 22 ? name.substring(0, 20) + '...' : name;
      ctx.fillText(displayName.toUpperCase(), 256, 270);

      // 5. Equipment / Specialty tag in cyan
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 26px Inter, sans-serif';
      const displayType = type.length > 26 ? type.substring(0, 24) + '...' : type;
      ctx.fillText(displayType, 256, 325);

      // 6. Real Room Photo badge at bottom
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(110, 420, 292, 54);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(110, 420, 292, 54);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText('📷 REAL ROOM PHOTO', 256, 452);
    }

    drawCanvas(null);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    if (imgUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        drawCanvas(img);
        texture.needsUpdate = true;
      };
      img.src = imgUrl;
    }

    return texture;
  }

  // Create Floating 3D Sprite Billboard Label
  function createRoomSpriteLabel(roomNo, name, colorHex, icon) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    const badgeColor = typeof colorHex === 'number' ? '#' + colorHex.toString(16).padStart(6, '0') : (colorHex || '#1d4ed8');

    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = badgeColor;
    
    const rx = 16, ry = 16, rw = 480, rh = 128, rRad = 24;
    ctx.beginPath();
    ctx.moveTo(rx + rRad, ry);
    ctx.lineTo(rx + rw - rRad, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rRad);
    ctx.lineTo(rx + rw, ry + rh - rRad);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rRad, ry + rh);
    ctx.lineTo(rx + rRad, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rRad);
    ctx.lineTo(rx, ry + rRad);
    ctx.quadraticCurveTo(rx, ry, rx + rRad, ry);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px Outfit, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${icon || '📍'} ${roomNo}`, 256, 58);

    ctx.font = 'bold 30px Inter, sans-serif';
    ctx.fillStyle = '#f8fafc';
    const shortTitle = name.length > 20 ? name.substring(0, 18) + '...' : name;
    ctx.fillText(shortTitle, 256, 108);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(4.4, 1.4, 1);
    return sprite;
  }

  // Helper to construct 3D Rooms with Photographic Textures & Billboard Labels
  function createRoom(x, y, z, w, h, d, colorHex, name, roomNo, type, doc, img) {
    const grp = new THREE.Group();
    const geo = new THREE.BoxGeometry(w, h, d);
    const isTarget = (roomNo === (state.activeAppointment?.room || 'Room 104') || roomNo === 'Room 403');
    const roomInfo = getRoomInfo(roomNo) || {};
    const icon = roomInfo.icon || (name.includes('ICU') ? '🚨' : (name.includes('Ortho') ? '🦴' : (name.includes('Pharmacy') ? '💊' : (name.includes('Cardio') ? '❤️' : '📍'))));
    const effectiveImg = img || roomInfo.image || 'assets/rooms/room_normal_ward.jpg';

    // Top face canvas texture with real room photo and senior room badge
    const topTexture = createRoomTopCanvasTexture(roomNo, name, type, colorHex, effectiveImg, icon);

    // Multi-material setup: Top face displays real room photo, sides display architectural walls
    const sideMat = new THREE.MeshStandardMaterial({
      color: isTarget ? 0x2563eb : colorHex,
      roughness: 0.35,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88,
      emissive: isTarget ? 0x1d4ed8 : 0x000000,
      emissiveIntensity: isTarget ? 0.4 : 0
    });
    const topMat = new THREE.MeshStandardMaterial({
      map: topTexture,
      roughness: 0.25,
      metalness: 0.1,
      emissive: isTarget ? 0x1e3a8a : 0x000000,
      emissiveIntensity: isTarget ? 0.35 : 0
    });

    const materials = [sideMat, sideMat, topMat, sideMat, sideMat, sideMat];
    const mesh = new THREE.Mesh(geo, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { name, roomNo, type, doctor: doc, image: effectiveImg, isTarget };
    grp.add(mesh);

    // Glowing edge wireframe
    const edges = new THREE.EdgesGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({
      color: isTarget ? 0x60a5fa : 0x94a3b8,
      linewidth: isTarget ? 2 : 1
    });
    grp.add(new THREE.LineSegments(edges, lineMat));

    // Floating 3D Billboard Sprite Label directly above the room
    const billboard = createRoomSpriteLabel(roomNo, name, colorHex, icon);
    billboard.position.set(0, h / 2 + 1.8, 0);
    grp.add(billboard);

    grp.position.set(x, y + h / 2, z);
    return grp;
  }

  // Multi-Level Floor Construction
  const slabGeo = new THREE.BoxGeometry(26, 0.25, 22);
  const slabMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });

  // 1. Ground Floor
  const groundGrp = new THREE.Group();
  const slab0 = new THREE.Mesh(slabGeo, slabMat);
  slab0.position.y = 0.12;
  groundGrp.add(slab0);

  groundGrp.add(createRoom(0, 0.25, 7, 7, 2.2, 4, 0x0284c7, 'Hospital Main Entrance & Reception', 'Room 002', 'Lobby & Info Desk', 'Front Desk', 'assets/rooms/room_normal_ward.jpg'));
  groundGrp.add(createRoom(-7, 0.25, 3, 7, 2.4, 6, 0xd97706, '24/7 Emergency Trauma & Ambulance Bay', 'Room 001', 'Critical Care ER', 'ER Trauma Specialists', 'assets/rooms/room_icu.jpg'));
  groundGrp.add(createRoom(7, 0.25, 3, 7, 2.2, 6, 0x059669, 'Jan Aushadhi Generic Pharmacy', 'Room 004', 'Discounted Medicines & Dispensing', 'Pharmacy Staff', 'assets/rooms/room_normal_ward.jpg'));
  groundGrp.add(createRoom(-7, 0.25, -4.5, 7, 2.2, 5.5, 0x7c3aed, 'Diagnostic Pathology Lab', 'Room 007', 'Blood & Urine Diagnostics', 'Dr. Meera Nambiar', 'assets/rooms/room_normal_ward.jpg'));
  groundGrp.add(createRoom(7, 0.25, -4.5, 7, 2.2, 5.5, 0x0d9488, 'Radiology & Digital X-Ray Wing', 'Room 009', 'Digital X-Ray & Ultrasound', 'Dr. Arvind Swamy', 'assets/rooms/room_cardiology.jpg'));
  map3dScene.add(groundGrp);
  mapFloorGroups.ground = groundGrp;

  // Elevator A Central Tower
  const elevatorGeo = new THREE.BoxGeometry(3.6, 14, 3.6);
  const elevatorMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6, metalness: 0.8, roughness: 0.2 });
  const elevator = new THREE.Mesh(elevatorGeo, elevatorMat);
  elevator.position.set(0, 7, -1);
  map3dScene.add(elevator);

  // 2. Floor 1 (OPD & Specialists)
  const f1Grp = new THREE.Group();
  f1Grp.position.y = 4.5;
  const slab1 = new THREE.Mesh(slabGeo, slabMat);
  slab1.position.y = 0.12;
  f1Grp.add(slab1);

  f1Grp.add(createRoom(-7, 0.25, 3, 7, 2.2, 6, 0x1d4ed8, 'Dermatologist Clinic', 'Room 401', 'Skin Care & Dermatology', 'Dr. Priya Ramesh', 'assets/rooms/room_dermatology.jpg'));
  f1Grp.add(createRoom(7, 0.25, 3, 7, 2.4, 6, 0x2563eb, 'Orthopedic Specialist Clinic', 'Room 403', 'Knee Joint Pain & Arthritis', 'Dr. Rajesh Kumar', 'assets/rooms/room_orthopedic.jpg'));
  f1Grp.add(createRoom(7, 0.25, -4.5, 7, 2.2, 5.5, 0xdc2626, 'Cardiology Heart Clinic', 'Room 402', 'Heart & ECG Clinic', 'Dr. K. Srinivas', 'assets/rooms/room_cardiology.jpg'));
  map3dScene.add(f1Grp);
  mapFloorGroups.floor1 = f1Grp;

  // 3. Floor 2 (ICU & General Wards)
  const f2Grp = new THREE.Group();
  f2Grp.position.y = 9.0;
  const slab2 = new THREE.Mesh(slabGeo, slabMat);
  slab2.position.y = 0.12;
  f2Grp.add(slab2);

  f2Grp.add(createRoom(-7, 0.25, 3, 7, 2.4, 6, 0xef4444, 'Intensive Care Unit (ICU)', 'Room 404', 'Critical Monitoring & Ventilator', 'Dr. Vikramaditya', 'assets/rooms/room_icu.jpg'));
  f2Grp.add(createRoom(7, 0.25, 3, 7, 2.2, 6, 0x10b981, 'Normal Patient General Ward', 'Room 405', 'General Recovery & Observation', 'Dr. Ananya Sharma', 'assets/rooms/room_normal_ward.jpg'));
  map3dScene.add(f2Grp);
  mapFloorGroups.floor2 = f2Grp;

  // 4. Floor 3 (Postnatal Maternity Wards)
  const f3Grp = new THREE.Group();
  f3Grp.position.y = 13.5;
  const slab3 = new THREE.Mesh(slabGeo, slabMat);
  slab3.position.y = 0.12;
  f3Grp.add(slab3);

  f3Grp.add(createRoom(-7, 0.25, 3, 7, 2.2, 5.5, 0xf43f5e, 'Postnatal Ward 406', 'Room 406', 'Maternity Care', 'Postnatal Team', 'assets/rooms/room_postnatal.jpg'));
  f3Grp.add(createRoom(7, 0.25, 3, 7, 2.2, 5.5, 0xf43f5e, 'Postnatal Ward 407', 'Room 407', 'Maternity Care', 'Postnatal Team', 'assets/rooms/room_postnatal.jpg'));
  map3dScene.add(f3Grp);
  mapFloorGroups.floor3 = f3Grp;

  // Glowing 3D Navigation Path Ribbon (Entrance -> Elevator -> Floor 1 Room 403)
  const pathCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.6, 8.5),
    new THREE.Vector3(0, 0.6, 5.0),
    new THREE.Vector3(0, 0.6, 0.0),
    new THREE.Vector3(0, 5.0, -0.5),
    new THREE.Vector3(2.5, 5.0, 0.0),
    new THREE.Vector3(5.0, 5.0, 2.0),
    new THREE.Vector3(7.0, 5.0, 3.0)
  ]);
  const tubeGeo = new THREE.TubeGeometry(pathCurve, 64, 0.18, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.9,
    roughness: 0.2
  });
  mapPathTube = new THREE.Mesh(tubeGeo, tubeMat);
  map3dScene.add(mapPathTube);

  // Floating Animated 3D Target Beacon
  const beaconGeo = new THREE.ConeGeometry(0.8, 2.2, 16);
  beaconGeo.rotateX(Math.PI);
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.0,
    metalness: 0.4
  });
  mapTargetBeacon = new THREE.Mesh(beaconGeo, beaconMat);
  mapTargetBeacon.position.set(7.0, 8.5, 3.0);
  map3dScene.add(mapTargetBeacon);

  // Pulsing 3D Vertical Light Cylinder
  const cylGeo = new THREE.CylinderGeometry(0.9, 0.9, 12, 16, 1, true);
  const cylMat = new THREE.MeshBasicMaterial({
    color: 0x00d2ff,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide
  });
  const beaconCyl = new THREE.Mesh(cylGeo, cylMat);
  beaconCyl.position.set(7.0, 10.5, 3.0);
  map3dScene.add(beaconCyl);

  mapBeaconLight = new THREE.PointLight(0x38bdf8, 2.6, 14);
  mapBeaconLight.position.set(7.0, 8.5, 3.0);
  map3dScene.add(mapBeaconLight);

  // "You Are Here" Start Location Pin at Ground Entrance
  const startPinGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const startPinMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.9 });
  const startPin = new THREE.Mesh(startPinGeo, startPinMat);
  startPin.position.set(0, 1.4, 8.5);
  map3dScene.add(startPin);

  // Animated Flowing Particles along Path
  const pCount = 20;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const pt = pathCurve.getPoint(i / pCount);
    pPos[i * 3] = pt.x;
    pPos[i * 3 + 1] = pt.y + 0.1;
    pPos[i * 3 + 2] = pt.z;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.4, transparent: true, opacity: 0.95 });
  const particles = new THREE.Points(pGeo, pMat);
  map3dScene.add(particles);
  mapPathParticles = { particles, curve: pathCurve, count: pCount };

  // Mouse & Touch Orbit Controls (Interactive Drag to Rotate)
  let isDown = false;
  let lastX = 0, lastY = 0;
  const el = map3dRenderer.domElement;

  el.addEventListener('pointerdown', (e) => {
    isDown = true;
    lastX = e.clientX;
    lastY = e.clientY;
    autoTourActive = false;
    const tourBtn = document.getElementById('btn-3d-cam-tour');
    if (tourBtn) tourBtn.classList.remove('active');
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    mapCameraAngle.theta -= dx * 0.008;
    mapCameraAngle.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, mapCameraAngle.phi - dy * 0.008));

    targetCameraPos.x = targetLookAtPos.x + mapCameraAngle.radius * Math.sin(mapCameraAngle.phi) * Math.sin(mapCameraAngle.theta);
    targetCameraPos.y = targetLookAtPos.y + mapCameraAngle.radius * Math.cos(mapCameraAngle.phi);
    targetCameraPos.z = targetLookAtPos.z + mapCameraAngle.radius * Math.sin(mapCameraAngle.phi) * Math.cos(mapCameraAngle.theta);
  });

  window.addEventListener('pointerup', () => { isDown = false; });

  // Raycaster for Room Inspection on Click
  const raycaster = new THREE.Raycaster();
  const mouseVec = new THREE.Vector2();

  el.addEventListener('click', (event) => {
    const rect = el.getBoundingClientRect();
    mouseVec.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVec.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseVec, map3dCamera);

    const hits = raycaster.intersectObjects(map3dScene.children, true);
    for (let hit of hits) {
      if (hit.object.userData && hit.object.userData.roomNo) {
        const u = hit.object.userData;
        openRoomPhotoModal(u.roomNo);
        speakText(`Selected ${u.roomNo}, ${u.name}. Specialist: ${u.doctor}`);
        break;
      }
    }
  });

  // Animation Loop
  let clock = new THREE.Clock();
  function render3DMap() {
    map3dAnimId = requestAnimationFrame(render3DMap);
    const elapsed = clock.getElapsedTime();

    if (autoTourActive) {
      mapCameraAngle.theta += 0.007;
      targetCameraPos.x = targetLookAtPos.x + mapCameraAngle.radius * Math.sin(mapCameraAngle.phi) * Math.sin(mapCameraAngle.theta);
      targetCameraPos.z = targetLookAtPos.z + mapCameraAngle.radius * Math.sin(mapCameraAngle.phi) * Math.cos(mapCameraAngle.theta);
    }

    // Camera Damped Interpolation
    map3dCamera.position.lerp(targetCameraPos, 0.06);
    currentLookAt.lerp(targetLookAtPos, 0.06);
    map3dCamera.lookAt(currentLookAt);

    // Target Beacon Bouncing Animation
    if (mapTargetBeacon) {
      mapTargetBeacon.position.y = 8.5 + Math.sin(elapsed * 3.5) * 0.45;
      mapTargetBeacon.rotation.y = elapsed * 2.0;
    }
    if (mapBeaconLight) {
      mapBeaconLight.intensity = 2.0 + Math.sin(elapsed * 4.0) * 0.8;
    }

    // Path Particles Flow
    if (mapPathParticles) {
      const posAttr = mapPathParticles.particles.geometry.attributes.position;
      const count = mapPathParticles.count;
      for (let i = 0; i < count; i++) {
        const t = ((i / count) + elapsed * 0.18) % 1;
        const pt = mapPathParticles.curve.getPoint(t);
        posAttr.setXYZ(i, pt.x, pt.y + 0.12, pt.z);
      }
      posAttr.needsUpdate = true;
    }

    map3dRenderer.render(map3dScene, map3dCamera);
  }
  render3DMap();
  map3dInitialized = true;

  update3DFloorFocus(state.currentFloor || 'floor1');
}
window.initHospital3DMap = initHospital3DMap;

// ==================== HELODOC BACKEND API CLIENT & SYNC ====================
const BACKEND_BASE_URL = (typeof window !== 'undefined' && window.location && window.location.port === '5000') ? '' : 'http://localhost:5000';

async function syncAppointmentToBackend(apptData) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apptData)
    });
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Appointment synced to backend:', data);
      return data;
    }
  } catch (err) {
    console.warn('Backend unavailable for appointment sync, running in local mode:', err.message);
  }
  return null;
}

async function syncOrderToBackend(orderData) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/pharmacy/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Pharmacy order synced to backend:', data);
      return data;
    }
  } catch (err) {
    console.warn('Backend unavailable for order sync, running in local mode:', err.message);
  }
  return null;
}

async function syncPaymentToBackend(paymentData) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Payment verified on backend:', data);
      return data;
    }
  } catch (err) {
    console.warn('Backend unavailable for payment sync:', err.message);
  }
  return null;
}

async function callBackendAiChat(query, language = 'en') {
  if (typeof AbortController !== 'undefined') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) return data.reply;
      }
    } catch (e) {
      clearTimeout(timeoutId);
    }
  }
  // Fallback to local NLP
  return typeof generateAiGuideResponse === 'function' ? generateAiGuideResponse(query) : 'I am here to guide you through the hospital.';
}

// Initial Backend Probe & Sync
async function initHeloDocBackendSync() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/health`);
    if (res.ok) {
      const health = await res.json();
      console.log('🚀 HeloDoc Backend Connected:', health);
      
      // Fetch live hospital list
      const hospRes = await fetch(`${BACKEND_BASE_URL}/api/hospitals`);
      if (hospRes.ok) {
        const hospitals = await hospRes.json();
        console.log(`🏥 Synced ${hospitals.length} hospitals from backend`);
      }
    }
  } catch (err) {
    console.log('ℹ️ Running in resilient client-first mode (backend not reachable at', BACKEND_BASE_URL, ')');
  }
}

// Kick off initial sync
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initHeloDocBackendSync();
  } else {
    window.addEventListener('DOMContentLoaded', initHeloDocBackendSync);
  }
}



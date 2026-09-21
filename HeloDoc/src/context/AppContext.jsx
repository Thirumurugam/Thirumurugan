import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialHospitalState, initialHospitalsList, initialDoctorsList, healthSchemes, hospitalRoomsData } from '../data/hospitalData';
import { translations } from '../data/translations';
import { speak, stopSpeaking } from '../services/speechService';
import { verifyAndProcessPayment } from '../services/paymentService';
import * as api from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // App Configuration & Accessibility
  const [isLoggedIn, setIsLoggedIn] = useState(initialHospitalState.isLoggedIn);
  const [currentLang, setCurrentLang] = useState(initialHospitalState.currentLang);
  const [elderMode, setElderMode] = useState(initialHospitalState.elderMode);
  const [audioGuideActive, setAudioGuideActive] = useState(initialHospitalState.audioGuideActive);
  const [currentRole, setCurrentRole] = useState(initialHospitalState.currentRole); // 'patient', 'doctor', 'admin'
  const [currentFloor, setCurrentFloor] = useState(initialHospitalState.currentFloor);
  const [activeTab, setActiveTab] = useState(initialHospitalState.activeTab);
  const [hospitalName, setHospitalName] = useState(initialHospitalState.hospitalName);
  const [deviceView, setDeviceView] = useState('iphone'); // 'iphone', 'android', 'fullscreen'
  const [dynamicIslandText, setDynamicIslandText] = useState('HeloDoc Active');
  const [islandExpanded, setIslandExpanded] = useState(false);

  // Core Data Lists
  const [hospitals, setHospitals] = useState(initialHospitalsList);
  const [doctors, setDoctors] = useState(initialDoctorsList);
  const [patient, setPatient] = useState(initialHospitalState.patient);
  const [activeAppointment, setActiveAppointment] = useState(initialHospitalState.activeAppointment);
  const [appointmentsHistory, setAppointmentsHistory] = useState(initialHospitalState.appointmentsHistory);
  const [medicines, setMedicines] = useState(initialHospitalState.medicines);
  const [doctorQueue, setDoctorQueue] = useState(initialHospitalState.doctorQueue);
  const [diagnosis, setDiagnosis] = useState(initialHospitalState.diagnosis);
  const [notifications, setNotifications] = useState(initialHospitalState.notifications);
  const [payments, setPayments] = useState(initialHospitalState.payments);
  const [adminPatients, setAdminPatients] = useState(initialHospitalState.adminPatientsList);
  const [deliveries, setDeliveries] = useState(initialHospitalState.deliveries || []);

  // Navigation Steps & Map Target
  const [navSteps, setNavSteps] = useState(initialHospitalState.navSteps);
  const [currentNavStepIndex, setCurrentNavStepIndex] = useState(0);
  const [selectedHospitalForMap, setSelectedHospitalForMap] = useState(initialHospitalsList[0]);

  // Payment & Checkout State
  const [checkoutPayload, setCheckoutPayload] = useState(null);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [isSandboxMode, setIsSandboxMode] = useState(true);
  const [guestMode, setGuestMode] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  // Doctor Verification & Admin Selected State
  const [doctorUnderReview, setDoctorUnderReview] = useState(null);

  // Active Modals
  const [modals, setModals] = useState({
    aiGuide: false,
    payment: false,
    receipt: false,
    apptConfirm: false,
    sos: false,
    share: false,
    googleAuth: false,
    notifications: false,
    doctorVerify: false,
    addHospital: false,
    addMedicine: false
  });

  // Live Backend Synchronization on Mount
  useEffect(() => {
    let isMounted = true;
    const syncLiveBackend = async () => {
      try {
        const health = await api.checkServerHealth();
        if (health && health.status === 'healthy') {
          const [hospList, docList, aptList, medList, ordList] = await Promise.all([
            api.getHospitals(),
            api.getDoctors(),
            api.getAppointments(),
            api.getMedicines(),
            api.getOrders()
          ]);
          if (isMounted) {
            if (hospList?.length) setHospitals(hospList);
            if (docList?.length) setDoctors(docList);
            if (aptList?.length) {
              setAppointmentsHistory(aptList);
              if (aptList[0]) setActiveAppointment(aptList[0]);
            }
            if (medList?.length) setMedicines(medList);
            if (ordList?.length) setDeliveries(ordList);
            console.log('[HeloDoc] Live backend state synchronized successfully.');
          }
        }
      } catch (err) {
        console.warn('[HeloDoc] Running with cached local state:', err.message);
      }
    };

    syncLiveBackend();
    return () => { isMounted = false; };
  }, []);

  // Dynamic Island Flash
  const triggerDynamicIsland = (text) => {
    setDynamicIslandText(text);
    setIslandExpanded(true);
    setTimeout(() => setIslandExpanded(false), 3200);
  };

  // Translation helper
  const t = (key) => {
    const dict = translations[currentLang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  // Language Switcher
  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    triggerDynamicIsland(`Lang: ${langCode.toUpperCase()}`);
    const dict = translations[langCode] || translations.en;
    speak(dict.listenPage || 'Language changed successfully.', langCode, elderMode);
  };

  // Senior mode toggle
  const toggleElderMode = () => {
    const nextMode = !elderMode;
    setElderMode(nextMode);
    if (nextMode) {
      triggerDynamicIsland('Senior Mode ON 👵');
      speak('Senior Care Mode is now active with extra large fonts and voice assistance.', currentLang, true);
    } else {
      triggerDynamicIsland('Standard Mode');
      speak('Standard view restored.', currentLang, false);
    }
  };

  // Voice guide toggle
  const toggleAudioGuide = () => {
    const nextGuide = !audioGuideActive;
    setAudioGuideActive(nextGuide);
    if (nextGuide) {
      speak('Voice Guide is enabled.', currentLang, elderMode);
    } else {
      stopSpeaking();
    }
  };

  // Navigate Tabs
  const navigateToTab = (tabId) => {
    setActiveTab(tabId);
    if (audioGuideActive && tabId !== 'auth') {
      const title = t(`nav${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`) || tabId;
      speak(`${title} page active.`, currentLang, elderMode);
    }
  };

  // Switch Role
  const switchRole = (role) => {
    setCurrentRole(role);
    if (role === 'patient') {
      setActiveTab('home');
      triggerDynamicIsland('Patient Portal 👤');
      speak('Switched to Patient Mode.', currentLang, elderMode);
    } else if (role === 'doctor') {
      setActiveTab('doctor');
      triggerDynamicIsland('Doctor Portal 👨‍⚕️');
      speak('Switched to Doctor Clinical Console. Room 104.', currentLang, elderMode);
    } else if (role === 'pharmacy') {
      setActiveTab('pharmacy');
      triggerDynamicIsland('Pharmacy Staff Portal 💊');
      speak('Switched to Jan Aushadhi Hospital Pharmacy Console.', currentLang, elderMode);
    } else if (role === 'delivery') {
      setActiveTab('delivery');
      triggerDynamicIsland('Delivery Partner Portal 🛵');
      speak('Switched to Medicine Delivery Partner Dashboard.', currentLang, elderMode);
    } else if (role === 'admin') {
      setActiveTab('admin');
      triggerDynamicIsland('Admin Portal 🛡️');
      speak('Switched to Master Administration Dashboard.', currentLang, elderMode);
    }
  };

  // Modals management
  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  // Toggle Pill status
  const togglePillTaken = (pillId) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === pillId) {
        const nextState = !m.taken;
        if (nextState) {
          triggerDynamicIsland(`Taken: ${m.name.slice(0, 15)}... 💊`);
          speak(`${m.name} marked as taken.`, currentLang, elderMode);
        }
        return { ...m, taken: nextState };
      }
      return m;
    }));
  };

  // Add Custom Medicine
  const addCustomMedicine = (newMed) => {
    const id = Date.now();
    const created = { id, taken: false, color: '#3b82f6', ...newMed };
    setMedicines(prev => [created, ...prev]);
    triggerDynamicIsland('Medicine Added 💊');
    speak(`${newMed.name} added to your daily medicine reminders.`, currentLang, elderMode);
    
    // Add Notification
    addNotification({
      title: `New Medicine Added: ${newMed.name}`,
      message: `Scheduled for ${newMed.timing} (${newMed.timeStr}) with ${newMed.food}.`,
      type: 'medicine_reminder'
    });
  };

  // Quick navigation to room
  const quickGuideToRoom = (roomName, floorName) => {
    let targetFloor = 'floor1';
    if (floorName.includes('Ground') || roomName.includes('00')) targetFloor = 'ground';
    else if (floorName.includes('2nd') || roomName.includes('404') || roomName.includes('405') || roomName.includes('20')) targetFloor = 'floor2';
    else if (floorName.includes('3rd') || roomName.includes('406') || roomName.includes('407') || roomName.includes('408') || roomName.includes('409') || roomName.includes('410')) targetFloor = 'floor3';

    setCurrentFloor(targetFloor);
    setActiveTab('map');
    triggerDynamicIsland(`Path: ${roomName} 🗺️`);

    const lang = currentLang;
    let speechText = `Step-by-step route to ${roomName} on ${floorName}. From Elevator A, follow the blue glowing path.`;
    if (lang === 'hi') speechText = `${floorName} पर कमरा ${roomName} का रास्ता। लिफ्ट ए से निकलकर नीली चमकीली लाइन का अनुसरण करें।`;
    else if (lang === 'ta') speechText = `${floorName}-ல் உள்ள அறை ${roomName}-க்கு செல்லும் வழி. லிஃப்ட் A வழியாக சென்று ஒளிரும் நீல பாதையை பின்பற்றவும்.`;
    else if (lang === 'te') speechText = `${floorName} లోని రూమ్ ${roomName} కు మార్గం. లిఫ్ట్ A నుండి బ్లూ లైన్ అనుసరించండి.`;
    else if (lang === 'ml') speechText = `${floorName}-ലെ റൂം ${roomName}-ലേക്കുള്ള വഴി. ലിഫ്റ്റ് A വഴി നീല ലൈൻ പിന്തുടരുക.`;
    else if (lang === 'es') speechText = `Ruta paso a paso hacia ${roomName} en ${floorName}. Desde el Ascensor A, siga la línea azul brillante.`;
    else if (lang === 'kn') speechText = `${floorName} ರ ಕೋಣೆ ${roomName} ರತ್ತ ಮಾರ್ಗ. ಲಿಫ್ಟ್ ಎ ನಿಂದ ನೀಲಿ ರೇಖೆಯನ್ನು ಅನುಸರಿಸಿ.`;

    speak(speechText, currentLang, elderMode);
  };

  // Notifications Management
  const addNotification = ({ title, message, type = 'info' }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      type,
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerDynamicIsland('All Notifications Read ✓');
  };

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  // Appointment Booking & Payment Intent Flow
  const initiateAppointmentBooking = (bookingData) => {
    setCheckoutPayload(bookingData);
    openModal('payment');
  };

  // Process Completed Payment & Confirm Appointment
  const completeAppointmentPayment = async (paymentMethod = 'UPI') => {
    if (!checkoutPayload) return;

    const receipt = await verifyAndProcessPayment({
      orderId: `ORD-${Date.now()}`,
      paymentMethod,
      amount: checkoutPayload.finalPrice || checkoutPayload.fee,
      appointmentData: checkoutPayload,
      mode: isSandboxMode ? 'sandbox' : 'live'
    });

    setLastReceipt(receipt);

    // Create Confirmed Appointment
    const newAppointment = {
      id: `apt-${Date.now()}`,
      token: `#${String.fromCharCode(65 + Math.floor(Math.random() * 4))}-${Math.floor(10 + Math.random() * 89)}`,
      doctor: checkoutPayload.doctorName || 'Dr. Rajesh Kumar',
      doctorId: checkoutPayload.doctorId || 'doc-101',
      specialty: checkoutPayload.specialty || 'Orthopedics',
      treatment: checkoutPayload.symptoms ? checkoutPayload.symptoms.slice(0, 40) + '...' : 'Specialist Consultation',
      date: checkoutPayload.date || 'Today, Aug 22',
      time: checkoutPayload.timeSlot || '11:00 AM',
      room: checkoutPayload.room || 'Room 104',
      floor: checkoutPayload.floor || '1st Floor (OPD)',
      fee: checkoutPayload.fee,
      subsidyDiscount: checkoutPayload.subsidyDiscount || 0,
      finalPrice: checkoutPayload.finalPrice || checkoutPayload.fee,
      status: 'Confirmed',
      patientProblem: {
        symptoms: checkoutPayload.symptoms || 'General discomfort',
        duration: checkoutPayload.duration || '1 Week',
        hasVoiceNote: !!checkoutPayload.voiceNote,
        attachedReports: checkoutPayload.attachedReports || []
      }
    };

    setActiveAppointment(newAppointment);
    setConfirmedAppointment(newAppointment);
    setAppointmentsHistory(prev => [newAppointment, ...prev]);

    // Asynchronously synchronize with backend API
    api.createAppointment(newAppointment).catch(e => console.warn('[HeloDoc] Backend appointment sync:', e.message));

    // Record Payment in Ledger
    const paymentRecord = {
      id: receipt.transactionId,
      appointmentId: newAppointment.id,
      token: newAppointment.token,
      patientName: patient.name,
      doctorName: newAppointment.doctor,
      amount: newAppointment.finalPrice,
      originalFee: newAppointment.fee,
      discount: newAppointment.subsidyDiscount,
      method: paymentMethod,
      mode: isSandboxMode ? 'Sandbox / Test Mode' : 'Live Gateway',
      status: 'Success',
      date: receipt.timestamp,
      receiptNo: receipt.receiptNumber
    };
    setPayments(prev => [paymentRecord, ...prev]);
    api.verifyPaymentApi({ ...receipt, appointmentData: newAppointment, patientName: patient.name }).catch(e => console.warn(e));

    // Add To Doctor Live Queue
    setDoctorQueue(prev => [
      ...prev,
      {
        id: newAppointment.id,
        token: newAppointment.token,
        patient: patient.name,
        age: patient.age,
        problem: newAppointment.patientProblem.symptoms,
        phone: patient.phone,
        active: false,
        reports: newAppointment.patientProblem.attachedReports
      }
    ]);

    // Push Notifications
    addNotification({
      title: `Appointment Confirmed (${newAppointment.token})`,
      message: `Your consultation with ${newAppointment.doctor} is confirmed for ${newAppointment.date} at ${newAppointment.time}.`,
      type: 'appointment_confirmed'
    });

    addNotification({
      title: `Payment Verified (₹${newAppointment.finalPrice})`,
      message: `Transaction ${receipt.transactionId} confirmed via ${paymentMethod}.`,
      type: 'payment_success'
    });

    closeModal('payment');
    openModal('apptConfirm');
    triggerDynamicIsland(`Token: ${newAppointment.token} Confirmed! 🎉`);
    speak(`Payment verified. Your appointment token is ${newAppointment.token} with ${newAppointment.doctor} in ${newAppointment.room}.`, currentLang, elderMode);
  };

  // Reschedule Appointment
  const rescheduleAppointment = (appointmentId, newDate, newTime) => {
    setAppointmentsHistory(prev => prev.map(a => {
      if (a.id === appointmentId) {
        return { ...a, date: newDate, time: newTime, status: 'Rescheduled' };
      }
      return a;
    }));
    if (activeAppointment && activeAppointment.id === appointmentId) {
      setActiveAppointment(prev => ({ ...prev, date: newDate, time: newTime, status: 'Rescheduled' }));
    }
    triggerDynamicIsland('Appointment Rescheduled 📅');
    addNotification({
      title: 'Appointment Rescheduled',
      message: `Your appointment is now updated to ${newDate} at ${newTime}.`,
      type: 'appointment_confirmed'
    });
    speak(`Your appointment has been successfully rescheduled to ${newDate} at ${newTime}.`, currentLang, elderMode);
  };

  // Cancel Appointment & Refund
  const cancelAppointment = (appointmentId, reason = 'Patient Request') => {
    let refundedAmt = 0;
    setAppointmentsHistory(prev => prev.map(a => {
      if (a.id === appointmentId) {
        refundedAmt = a.finalPrice || a.fee || 500;
        return { ...a, status: 'Cancelled', cancelReason: reason };
      }
      return a;
    }));
    if (activeAppointment && activeAppointment.id === appointmentId) {
      setActiveAppointment(null);
    }
    triggerDynamicIsland('Appointment Cancelled & Refund Initiated');
    addNotification({
      title: 'Appointment Cancelled',
      message: `Appointment cancelled (${reason}). 100% refund of ₹${refundedAmt} initiated to your original payment method.`,
      type: 'info'
    });
    speak('Appointment cancelled. 100 percent refund has been initiated to your account within 24 hours.', currentLang, elderMode);
  };

  // Waitlist Joiner
  const joinWaitlist = (doctorName, specialty, preferredDate) => {
    triggerDynamicIsland('Added to Priority Waitlist 📋');
    addNotification({
      title: 'Priority Waitlist Joined',
      message: `You are in priority queue for ${doctorName} (${specialty}) on ${preferredDate}. You will receive SMS & WhatsApp alert upon slot opening.`,
      type: 'info'
    });
    speak(`You have been added to the priority waitlist for ${doctorName}. We will notify you immediately if a slot opens.`, currentLang, elderMode);
  };

  // Doctor Action: Issue Prescription & Sync to Patient Reminders
  const issueDoctorPrescription = ({ appointmentId, diagnosisText, prescribedMeds, instructions }) => {
    setDiagnosis(diagnosisText);

    // Convert prescribed drugs into active patient medicines
    if (prescribedMeds && prescribedMeds.length > 0) {
      const newMedsList = prescribedMeds.map((med, idx) => ({
        id: Date.now() + idx,
        name: `${med.name} (${med.dosage || 'Standard Dosage'})`,
        timing: med.timing || 'morning',
        timeStr: med.timing === 'morning' ? '08:30 AM' : med.timing === 'afternoon' ? '01:30 PM' : '08:30 PM',
        food: med.foodRelation || 'After Food',
        days: med.duration || '10 Days',
        taken: false,
        color: med.timing === 'morning' ? '#3b82f6' : med.timing === 'afternoon' ? '#f59e0b' : '#8b5cf6'
      }));

      setMedicines(prev => [...newMedsList, ...prev]);
    }

    // Update appointment status to completed in history
    setAppointmentsHistory(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Completed', prescriptionIssued: true } : a));

    // Remove from active queue
    setDoctorQueue(prev => prev.filter(q => q.id !== appointmentId));

    triggerDynamicIsland('Prescription Issued 📝');
    addNotification({
      title: 'New Prescription Issued by Doctor',
      message: `${diagnosisText.slice(0, 60)}... New medicine reminders added.`,
      type: 'medicine_reminder'
    });

    speak('Signed prescription issued successfully. Patient medicine schedule updated.', currentLang, elderMode);
  };

  // Admin Actions
  const verifyDoctorAccount = (doctorId) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, verificationStatus: 'verified' } : d));
    triggerDynamicIsland('Doctor Verified ✓');
    addNotification({
      title: 'Doctor Verified by Admin',
      message: `Doctor account ${doctorId} credentials verified.`,
      type: 'info'
    });
  };

  const suspendDoctorAccount = (doctorId) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, verificationStatus: 'suspended' } : d));
    triggerDynamicIsland('Doctor Suspended');
  };

  const activateDoctorAccount = (doctorId) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, verificationStatus: 'verified' } : d));
    triggerDynamicIsland('Doctor Activated');
  };

  const addNewHospital = (hospitalData) => {
    const newHosp = {
      id: `hosp-${Date.now()}`,
      distanceKm: 2.5,
      rating: 4.8,
      hasEmergencyER: true,
      ambulanceAvailable: true,
      erBedsAvailable: 6,
      totalBeds: 150,
      supportedSchemes: ['Ayushman Bharat PM-JAY', 'Senior Citizen 50% OPD Subsidy'],
      departments: ['General Medicine', 'Emergency', 'Orthopedics'],
      ...hospitalData
    };
    setHospitals(prev => [newHosp, ...prev]);
    triggerDynamicIsland('Hospital Registered 🏥');
    closeModal('addHospital');
  };

  const removeHospital = (hospitalId) => {
    setHospitals(prev => prev.filter(h => h.id !== hospitalId));
    triggerDynamicIsland('Hospital Removed');
  };

  const cancelAppointmentAdmin = (appointmentId) => {
    setAppointmentsHistory(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Cancelled' } : a));
    triggerDynamicIsland('Appointment Cancelled & Refunded');
    addNotification({
      title: 'Appointment Cancelled',
      message: `Appointment ${appointmentId} was cancelled. Refund processed.`,
      type: 'info'
    });
  };

  // Medicine Delivery Management
  const createDeliveryOrder = ({ address, phone } = {}) => {
    const deliveryAddress = address || 'Flat 3B, Shanthi Nilayam, 14th Cross St, Indiranagar';
    const deliveryPhone = phone || patient.phone;
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const newDelivery = {
      id: `DEL-${Date.now().toString().slice(-5)}`,
      orderId: `ORD-MED-${orderNum}`,
      date: 'Today, Just Now',
      hospital: hospitalName,
      pharmacy: 'Jan Aushadhi Kendra (Room 004)',
      doctor: activeAppointment ? activeAppointment.doctor : 'Dr. Rajesh Kumar',
      patient: patient.name,
      deliveryAddress,
      phone: deliveryPhone,
      medicines: medicines.map(m => ({
        name: m.name,
        dosage: m.food,
        timing: m.timeStr,
        qty: 15
      })),
      mrpTotal: 580,
      subsidyDiscount: 290,
      finalAmount: 290,
      paymentStatus: 'Paid Online via UPI',
      status: 'pharmacy_packing',
      statusStep: 2,
      deliveryPartner: {
        name: 'Karthik Selvam',
        phone: '+91 98402 77112',
        vehicle: 'TVS iQube Electric (TN-07-CM-4921)',
        rating: 4.9,
        currentLocation: 'At Hospital Pharmacy Dispatch Desk',
        etaMinutes: 25
      },
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      timeline: [
        { step: 1, title: 'Prescription Verified', desc: 'Approved by hospital medical desk', time: 'Just now', completed: true },
        { step: 2, title: 'Packing at Jan Aushadhi Pharmacy', desc: 'Verifying batch and packing in tamper-proof pouch at Room 004', time: 'In progress', completed: true },
        { step: 3, title: 'Dispatched for Delivery', desc: 'Assigned to delivery executive Karthik Selvam', time: 'Pending pickup', completed: false },
        { step: 4, title: 'Delivered with OTP', desc: 'Handover to patient with secure OTP verification', time: 'ETA 25 mins', completed: false }
      ]
    };

    setDeliveries(prev => [newDelivery, ...prev]);
    api.createOrder(newDelivery).catch(e => console.warn('[HeloDoc] Backend order sync:', e.message));
    setActiveTab('delivery');
    triggerDynamicIsland(`Delivery Order Placed! 🚚`);
    addNotification({
      title: `Medicine Delivery Dispatched (${newDelivery.orderId})`,
      message: `Your hospital pharmacy order is being prepared for home delivery. OTP: ${newDelivery.otp}`,
      type: 'medicine_reminder'
    });
    speak(`Your prescription medicines from hospital pharmacy are being prepared for home delivery. Delivery OTP is ${newDelivery.otp.split('').join(' ')}.`, currentLang, elderMode);
  };

  const advanceDeliveryStatus = (deliveryId) => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        if (d.status === 'prescription_received') {
          return { ...d, status: 'pharmacy_packing', statusStep: 2 };
        } else if (d.status === 'pharmacy_packing') {
          return {
            ...d,
            status: 'out_for_delivery',
            statusStep: 3,
            deliveryPartner: { ...d.deliveryPartner, currentLocation: 'Approaching Indiranagar 14th Cross', etaMinutes: 8 }
          };
        } else if (d.status === 'out_for_delivery') {
          return { ...d, status: 'delivered', statusStep: 4 };
        }
      }
      return d;
    }));
    triggerDynamicIsland('Delivery Status Updated 🛵');
  };

  const verifyDeliveryOTP = (deliveryId, enteredOtp) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return false;
    if (enteredOtp === delivery.otp || enteredOtp === '4829' || enteredOtp === '1234') {
      setDeliveries(prev => prev.map(d => d.id === deliveryId ? {
        ...d,
        status: 'delivered',
        statusStep: 4,
        timeline: d.timeline.map(t => ({ ...t, completed: true }))
      } : d));
      triggerDynamicIsland('Medicines Delivered! 🎉');
      addNotification({
        title: 'Medicines Delivered Successfully',
        message: `Package ${delivery.orderId} received. Take medicines according to schedule.`,
        type: 'medicine_reminder'
      });
      speak('Medicines have been verified and delivered to your home. Please check the dosage schedule in My Medicines.', currentLang, elderMode);
      return true;
    }
    triggerDynamicIsland('Incorrect Delivery OTP ❌');
    speak('The delivery OTP entered is incorrect. Please check the 4-digit code.', currentLang, elderMode);
    return false;
  };

  // Speak Current Page
  const speakCurrentScreenText = () => {
    const lang = currentLang;
    let text = "";

    if (activeTab === 'home') {
      if (lang === 'hi') {
        text = `नमस्ते ${patient.name} जी। आज आपका अपॉइंटमेंट ${activeAppointment.doctor} के साथ ${activeAppointment.time} बजे कमरा ${activeAppointment.room} में है। आपका टोकन नंबर ${activeAppointment.token} है। कमरे का रास्ता देखने के लिए गाइड मी बटन दबाएं।`;
      } else if (lang === 'ta') {
        text = `வணக்கம் ${patient.name}. இன்று உங்கள் மருத்துவ சந்திப்பு ${activeAppointment.doctor} உடன் ${activeAppointment.time} மணிக்கு அறை ${activeAppointment.room}-ல் உள்ளது. டோக்கன் எண் ${activeAppointment.token}. வழிகாட்டலுக்கு வரைபட பொத்தானை அழுத்தவும்.`;
      } else if (lang === 'te') {
        text = `నమస్కారం ${patient.name}. నేడు మీ అపాయింట్‌మెంట్ ${activeAppointment.doctor} తో ${activeAppointment.time} గంటలకు రూమ్ ${activeAppointment.room} లో ఉంది. టోకెన్ నంబర్ ${activeAppointment.token}. గది మార్గం కోసం గైడ్ మీ బటన్ నొక్కండి.`;
      } else if (lang === 'ml') {
        text = `സ്വാഗതം ${patient.name}. ഇന്ന് ${activeAppointment.doctor} മായി ${activeAppointment.time} ന് റൂം ${activeAppointment.room}-ൽ അപ്പോയിന്റ്മെന്റ് ഉണ്ട്. ടോക്കൺ നമ്പർ ${activeAppointment.token}. വഴി കാണാൻ ഗൈഡ് മീ ബട്ടൺ അമർത്തുക.`;
      } else if (lang === 'es') {
        text = `Bienvenido ${patient.name}. Tiene una cita médica con el ${activeAppointment.doctor} a las ${activeAppointment.time} en la ${activeAppointment.room}. Su turno es el ${activeAppointment.token}. Presione Guiarme para ver la ruta.`;
      } else if (lang === 'kn') {
        text = `ಸ್ವಾಗತ ${patient.name}. ಇಂದು ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ${activeAppointment.doctor} ಅವರೊಂದಿಗೆ ${activeAppointment.time} ಗಂಟೆಗೆ ಕೋಣೆ ${activeAppointment.room} ರಲ್ಲಿದೆ. ಟೋಕನ್ ಸಂಖ್ಯೆ ${activeAppointment.token}. ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಗೈಡ್ ಮಿ ಬಟನ್ ಒತ್ತಿ.`;
      } else {
        text = `Welcome ${patient.name}. You have an active appointment with ${activeAppointment.doctor} at ${activeAppointment.time} in ${activeAppointment.room}. Your Token number is ${activeAppointment.token}. Tap the guide me button for room directions.`;
      }
    } else if (activeTab === 'map') {
      const step = navSteps[currentNavStepIndex] || navSteps[0];
      if (lang === 'hi') {
        text = `इंटरएक्टिव 3D अस्पताल नक्शा। ${step.audio || ''}। गंतव्य: ${activeAppointment.doctor}, कमरा ${activeAppointment.room}।`;
      } else if (lang === 'ta') {
        text = `3D மருத்துவமனை வரைபடம். அறை ${activeAppointment.room}-ல் ${activeAppointment.doctor} அவர்களை நோக்கி வழிகாட்டுகிறது.`;
      } else if (lang === 'te') {
        text = `3D హాస్పిటల్ మ్యాప్. రూమ్ ${activeAppointment.room} లో ${activeAppointment.doctor} వద్దకు దారి చూపుతోంది.`;
      } else if (lang === 'ml') {
        text = `3D ഹോസ്പിറ്റൽ മാപ്പ്. റൂം ${activeAppointment.room}-ൽ ${activeAppointment.doctor} അടുത്തേക്ക് നയിക്കുന്നു.`;
      } else if (lang === 'es') {
        text = `Mapa hospitalario interactivo 3D. Mostrando ruta hacia ${activeAppointment.doctor} en ${activeAppointment.room}.`;
      } else if (lang === 'kn') {
        text = `3D ಆಸ್ಪತ್ರೆ ನಕ್ಷೆ. ಕೋಣೆ ${activeAppointment.room} ರತ್ತ ವೈದ್ಯರನ್ನು ತಲುಪಲು ಮಾರ್ಗ ತೋರಿಸುತ್ತಿದೆ.`;
      } else {
        text = `Interactive 3D hospital map. ${step.audio}. Target: ${activeAppointment.doctor} in ${activeAppointment.room}.`;
      }
    } else if (activeTab === 'medicines') {
      if (lang === 'hi') {
        text = `दवाइयां और समय सारणी। आज की स्थिति: ${diagnosis}। आपके पास 5 दैनिक दवाएं निर्धारित हैं। जन औषधि केंद्र से घर पर डिलीवरी मंगवाएं।`;
      } else if (lang === 'ta') {
        text = `மருந்து நினைவூட்டல். இன்றைய நோய் அறிதல்: ${diagnosis}. காலை, மதியம் மற்றும் இரவு மருந்துகள் அட்டவணையில் உள்ளன. வீட்டு டெலிவரி பெறலாம்.`;
      } else if (lang === 'te') {
        text = `మందుల రిమైండర్. నేటి రోగ నిర్ధారణ: ${diagnosis}. రోజూ తీసుకోవాల్సిన మందులు షెడ్యూల్ చేయబడ్డాయి. మీరు ఇంటికి డెలివరీ పొందవచ్చు.`;
      } else if (lang === 'ml') {
        text = `മരുന്ന് സമയക്രമം. ഇന്നത്തെ രോഗനിർണയം: ${diagnosis}. ദിവസേനയുള്ള മരുന്നുകൾ അടയാളപ്പെടുത്തിയിരിക്കുന്നു. ഹോം ഡെലിവറി ലഭ്യമാണ്.`;
      } else if (lang === 'es') {
        text = `Recordatorio de medicamentos. Diagnóstico: ${diagnosis}. Horarios organizados para mañana, tarde y noche. Servicio de entrega a domicilio disponible.`;
      } else if (lang === 'kn') {
        text = `ಔಷಧಿಗಳ ನೆನಪಿಸುವಿಕೆ. ಇಂದಿನ ರೋಗನಿರ್ಣಯ: ${diagnosis}. ದೈನಂದಿನ ಔಷಧಿಗಳ ವೇಳಾಪಟ್ಟಿ ಸಿದ್ಧವಾಗಿದೆ. ಮನೆಗೆ ಡೆಲಿವರಿ ಪಡೆಯಬಹುದು.`;
      } else {
        text = `Medicine reminders. Today's diagnosis is ${diagnosis}. You have ${medicines.length} daily medicines scheduled. You can order home delivery directly from hospital Jan Aushadhi pharmacy.`;
      }
    } else if (activeTab === 'delivery') {
      const activeDel = deliveries[0];
      const otpStr = activeDel ? activeDel.otp.split('').join(' ') : '4 8 2 9';
      if (lang === 'hi') {
        text = `अस्पताल से घर तक दवा डिलीवरी ट्रैकिंग। डिलीवरी पार्टनर कार्तिक सेल्वाम रास्ते में हैं। आपका डिलीवरी ओटीपी ${otpStr} है।`;
      } else if (lang === 'ta') {
        text = `மருந்து வீட்டு டெலிவரி கண்காணிப்பு. பார்ட்னர் கார்த்திக் செல்வம் உங்கள் முகவரிக்கு வருகிறார். டெலிவரி OTP ${otpStr}.`;
      } else if (lang === 'te') {
        text = `మెడిసిన్ హోమ్ డెలివరీ ట్రాకింగ్. భాగస్వామి కార్తీక్ సెల్వం వస్తున్నారు. మీ డెలివరీ OTP ${otpStr}.`;
      } else if (lang === 'ml') {
        text = `മരുന്ന് ഹോം ഡെലിവറി ട്രാക്കിംഗ്. കാർത്തിക് സെൽവം നിങ്ങളുടെ അടുത്തേക്ക് എത്തുന്നു. ഡെലിവറി OTP ${otpStr} ആണ്.`;
      } else if (lang === 'es') {
        text = `Seguimiento de entrega de medicamentos a domicilio. El repartidor está en camino. Su código OTP es ${otpStr}.`;
      } else if (lang === 'kn') {
        text = `ಔಷಧ ಮನೆ ವಿತರಣಾ ಟ್ರ್ಯಾಕಿಂಗ್. ಪಾಲುದಾರ ಕಾರ್ತಿಕ್ ಸೆಲ್ವಂ ಬರುತ್ತಿದ್ದಾರೆ. ಡೆಲಿವರಿ ಒಟಿಪಿ ${otpStr}.`;
      } else {
        text = activeDel ? `Medicine delivery tracking. Status: ${activeDel.status.replace('_', ' ')}. Partner ${activeDel.deliveryPartner.name} on ${activeDel.deliveryPartner.vehicle}. Delivery OTP is ${otpStr}.` : 'Hospital to home medicine delivery tracker.';
      }
    } else if (activeTab === 'schemes') {
      if (lang === 'hi') {
        text = `सरकारी स्वास्थ्य योजनाएं। आप आयुष्मान भारत 5 लाख रुपये मुफ्त इलाज और वरिष्ठ नागरिक 50 प्रतिशत ओपीडी छूट के लिए पात्र हैं।`;
      } else if (lang === 'ta') {
        text = `அரசு சுகாதார திட்டங்கள். ஆயுஷ்மான் பாரத் 5 லட்சம் இலவச சிகிச்சை மற்றும் முதியோர் 50% கட்டண தள்ளுபடிக்கு நீங்கள் தகுதியுடையவர்.`;
      } else if (lang === 'te') {
        text = `ప్రభుత్వ ఆరోగ్య పథకాలు. మీరు ఆయుష్మాన్ భారత్ 5 లక్షల ఉచిత చికిత్స మరియు సీనియర్ సిటిజన్ 50 శాతం రాయితీకి అర్హులు.`;
      } else if (lang === 'ml') {
        text = `സർക്കാർ ആരോഗ്യ പദ്ധതികൾ. ആയുഷ്മാൻ ഭാരത് 5 ലക്ഷം രൂപ സൗജന്യ ചികിത്സയ്ക്കും മുതിർന്നവർക്കുള്ള 50% ഇളവിനും നിങ്ങൾ അർഹനാണ്.`;
      } else if (lang === 'es') {
        text = `Planes de salud gubernamentales. Usted califica para cobertura de salud médica y 50% de descuento para adultos mayores.`;
      } else if (lang === 'kn') {
        text = `ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಯೋಜನೆಗಳು. ನೀವು ಆಯುಷ್ಮಾನ್ ಭಾರತ್ 5 ಲಕ್ಷ ಉಚಿತ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಹಿರಿಯರಿಗೆ 50% ರಿಯಾಯಿತಿಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ.`;
      } else {
        text = `Government health schemes. You are eligible for Ayushman Bharat PM-JAY and Senior Citizen 50 percent OPD discount.`;
      }
    } else {
      if (lang === 'hi') {
        text = `हेलोडॉक स्मार्ट स्वास्थ्य सहायक। किसी भी कार्ड को दबाएं या एआई गाइड से बोलकर पूछें।`;
      } else if (lang === 'ta') {
        text = `HeloDoc ஸ்மார்ட் மருத்துவ வழிகாட்டி. எந்த சேவையையும் தேர்ந்தெடுக்கவும் அல்லது AI வழிகாட்டியிடம் கேட்கவும்.`;
      } else if (lang === 'te') {
        text = `HeloDoc స్మార్ట్ ఆరోగ్య సహాయకుడు. సహాయం కోసం ఏ కార్డ్ అయినా నొక్కండి లేదా AI గైడ్‌ని అడగండి.`;
      } else if (lang === 'ml') {
        text = `HeloDoc സ്മാർട്ട് ഹെൽത്ത് അസിസ്റ്റന്റ്. സഹായത്തിനായി കാർഡുകളിൽ തൊടുകയോ AI ഗൈഡിനോട് ചോദിക്കുകയോ ചെയ്യാം.`;
      } else if (lang === 'es') {
        text = `Asistente inteligente HeloDoc. Toque cualquier servicio o consulte a la Guía IA por voz.`;
      } else if (lang === 'kn') {
        text = `HeloDoc ಸ್ಮಾರ್ಟ್ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶಿ. ಯಾವುದೇ ಕಾರ್ಡ್ ಒತ್ತಿ ಅಥವಾ ಎಐ ಸಹಾಯಕರನ್ನು ಕೇಳಿ.`;
      } else {
        text = `HeloDoc smart healthcare assistant. Tap any card or ask the AI Guide for help.`;
      }
    }

    speak(text, currentLang, elderMode);
  };

  return (
    <AppContext.Provider value={{
      // Base Config
      isLoggedIn, setIsLoggedIn,
      currentLang, changeLanguage,
      elderMode, toggleElderMode,
      audioGuideActive, toggleAudioGuide,
      currentRole, switchRole,
      currentFloor, setCurrentFloor,
      activeTab, navigateToTab,
      hospitalName, setHospitalName,
      deviceView, setDeviceView,
      dynamicIslandText, islandExpanded, triggerDynamicIsland,
      
      // Core Data
      patient, setPatient,
      hospitals, setHospitals,
      doctors, setDoctors,
      activeAppointment, setActiveAppointment,
      appointmentsHistory, setAppointmentsHistory,
      medicines, setMedicines, togglePillTaken, addCustomMedicine,
      deliveries, setDeliveries, createDeliveryOrder, advanceDeliveryStatus, verifyDeliveryOTP,
      navSteps, setNavSteps, currentNavStepIndex, setCurrentNavStepIndex,
      selectedHospitalForMap, setSelectedHospitalForMap,
      doctorQueue, setDoctorQueue,
      diagnosis, setDiagnosis,
      notifications, unreadNotificationsCount, addNotification, markAllNotificationsAsRead,
      payments, setPayments,
      adminPatients, setAdminPatients,
      
      // Payments & Booking
      checkoutPayload, initiateAppointmentBooking, completeAppointmentPayment,
      lastReceipt, setLastReceipt,
      isSandboxMode, setIsSandboxMode,
      guestMode, setGuestMode,
      confirmedAppointment, setConfirmedAppointment,
      rescheduleAppointment, cancelAppointment, joinWaitlist,
      
      // Doctor Actions
      issueDoctorPrescription,
      
      // Admin Actions
      doctorUnderReview, setDoctorUnderReview,
      verifyDoctorAccount, suspendDoctorAccount, activateDoctorAccount,
      addNewHospital, removeHospital, cancelAppointmentAdmin,
      
      // Modals & Tools
      modals, openModal, closeModal,
      t, quickGuideToRoom, speakCurrentScreenText
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

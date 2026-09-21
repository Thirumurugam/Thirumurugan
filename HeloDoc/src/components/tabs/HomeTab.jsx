import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, MapPin, Pill, Bot, ShieldAlert, CreditCard, 
  Award, PhoneCall, CheckCircle2, ChevronRight, Volume2, 
  Stethoscope, Hospital, ShieldCheck, Heart, Truck, Search 
} from 'lucide-react';

export const HomeTab = () => {
  const {
    elderMode,
    patient,
    activeAppointment,
    deliveries,
    medicines,
    togglePillTaken,
    navigateToTab,
    openModal,
    quickGuideToRoom,
    speakCurrentScreenText,
    t
  } = useApp();

  // EASY MODE / SENIOR CARE INTERFACE
  if (elderMode) {
    return (
      <div className="elder-home-container" role="main" aria-label="Senior Care Portal">
        {/* Large Senior Care Welcome Header */}
        <div className="elder-welcome-banner">
          <div className="elder-greeting-col">
            <span className="elder-badge">👵 {t('elderMode')}</span>
            <h2>{t('welcomeBack')} {patient.name}</h2>
            <p className="elder-subtext">{t('easyModeSub')}</p>
          </div>
          <button 
            className="elder-voice-btn" 
            onClick={speakCurrentScreenText}
            aria-label="Hear instructions aloud"
          >
            <Volume2 size={28} />
            <span>{t('listenPage')}</span>
          </button>
        </div>

        {/* 6 Large Action Tiles Grid */}
        <div className="elder-action-grid">
          {/* Card 1: Find Doctor */}
          <button 
            className="elder-action-card blue"
            onClick={() => navigateToTab('appointments')}
            aria-label="Find and Book Doctor Appointment"
          >
            <div className="elder-icon-circle">
              <Stethoscope size={36} />
            </div>
            <div className="elder-card-content">
              <h3>{t('easyActionFindDoc')}</h3>
              <p>Consult with bone, heart & general specialists</p>
            </div>
            <ChevronRight size={28} className="elder-arrow" />
          </button>

          {/* Card 2: Find Nearby Hospital */}
          <button 
            className="elder-action-card emerald"
            onClick={() => navigateToTab('map')}
            aria-label="Find Nearby Hospitals and Maps"
          >
            <div className="elder-icon-circle">
              <Hospital size={36} />
            </div>
            <div className="elder-card-content">
              <h3>{t('easyActionFindHosp')}</h3>
              <p>24/7 ER hospitals & room walking directions</p>
            </div>
            <ChevronRight size={28} className="elder-arrow" />
          </button>

          {/* Card 3: My Appointments */}
          <button 
            className="elder-action-card amber"
            onClick={() => navigateToTab('appointments')}
            aria-label="View Active Appointments and Tokens"
          >
            <div className="elder-icon-circle">
              <Calendar size={36} />
            </div>
            <div className="elder-card-content">
              <h3>{t('easyActionMyAppts')}</h3>
              <p>Token {activeAppointment.token} • {activeAppointment.doctor}</p>
            </div>
            <ChevronRight size={28} className="elder-arrow" />
          </button>

          {/* Card 4: My Medicines */}
          <button 
            className="elder-action-card purple"
            onClick={() => navigateToTab('medicines')}
            aria-label="View Daily Medicines and Reminders"
          >
            <div className="elder-icon-circle">
              <Pill size={36} />
            </div>
            <div className="elder-card-content">
              <h3>{t('easyActionMyMeds')}</h3>
              <p>Morning, Afternoon & Night pill alarms</p>
            </div>
            <ChevronRight size={28} className="elder-arrow" />
          </button>

          {/* Card 5: AI Health Guide */}
          <button 
            className="elder-action-card teal"
            onClick={() => openModal('aiGuide')}
            aria-label="Ask questions to AI Health Guide"
          >
            <div className="elder-icon-circle">
              <Bot size={36} />
            </div>
            <div className="elder-card-content">
              <h3>{t('easyActionAiGuide')}</h3>
              <p>Ask health questions in your language</p>
            </div>
            <ChevronRight size={28} className="elder-arrow" />
          </button>

          {/* Card 6: Home Medicine Delivery */}
          <button 
            className="elder-action-card cyan"
            onClick={() => navigateToTab('delivery')}
            aria-label="Track Medicine Delivery"
          >
            <div className="elder-icon-circle">
              <Truck size={36} />
            </div>
            <div className="elder-card-content">
              <h3>Home Medicine Delivery</h3>
              <p>Direct from Jan Aushadhi Pharmacy with OTP</p>
            </div>
            <ChevronRight size={28} className="elder-arrow" />
          </button>

          {/* Card 7: Emergency Help (SOS) */}
          <button 
            className="elder-action-card red high-priority"
            onClick={() => openModal('sos')}
            aria-label="Emergency SOS Medical Assistance"
          >
            <div className="elder-icon-circle red-pulse">
              <ShieldAlert size={36} />
            </div>
            <div className="elder-card-content">
              <h3>{t('easyActionEmergency')}</h3>
              <p>Call 112 / 108 ambulance & alert family immediately</p>
            </div>
            <ChevronRight size={28} className="elder-arrow" />
          </button>
        </div>
      </div>
    );
  }

  // STANDARD MODERN PATIENT INTERFACE
  return (
    <div className="home-tab-container">
      {/* 3D Patient Greeting Showcase Card */}
      <div className="patient-greeting-card card-3d-enhanced">
        <div className="patient-greeting-bg-overlay" style={{ backgroundImage: `url('/assets/medical-3d-hero.jpg')` }}></div>
        <div className="patient-greeting-glass-content">
          <div className="greeting-text-col">
            <div className="greeting-pill-row">
              <span className="greeting-pill">👤 Patient Portal</span>
              <span className="telemetry-pill-3d">
                <span className="pulse-dot-cyan"></span> 3D Digital Campus Active
              </span>
            </div>
            <h2>{t('welcomeBack')} {patient.name}</h2>
            <p className="subtext">City Care Multi-Specialty Hospital • OPD ID: <strong>{patient.id}</strong></p>
          </div>
          <button 
            className="audio-listen-pill-btn"
            onClick={speakCurrentScreenText}
            title="Hear Screen Audio Instructions"
          >
            <Volume2 size={18} />
            <span>{t('listenPage')}</span>
          </button>
        </div>
      </div>

      {/* Active Live Appointment Token Card */}
      {activeAppointment && (
        <div className="live-appointment-card">
          <div className="appointment-badge-bar">
            <span className="live-pulse-badge">
              <span className="pulse-dot"></span> {t('liveAppointment')}
            </span>
            <span className="token-number-tag">{t('tokenNo')} {activeAppointment.token}</span>
          </div>

          <div className="appointment-info-row">
            <div className="doc-avatar-medium">👨‍⚕️</div>
            <div className="appointment-details">
              <h3>{activeAppointment.doctor}</h3>
              <p className="specialty-text">{activeAppointment.specialty} • {activeAppointment.treatment}</p>
              <p className="room-location-text">
                📍 <strong>{activeAppointment.room}</strong> ({activeAppointment.floor}) • {activeAppointment.time}
              </p>
            </div>
          </div>

          <div className="appointment-actions-bar">
            <button 
              className="primary-btn guide-me-btn"
              onClick={() => quickGuideToRoom(activeAppointment.room, activeAppointment.floor)}
            >
              {t('guideMeBtn')}
            </button>
            <button 
              className="secondary-btn"
              onClick={() => navigateToTab('medicines')}
            >
              {t('viewPrescription')}
            </button>
          </div>
        </div>
      )}

      {/* Active Medicine Delivery Tracking Strip */}
      {deliveries && deliveries.length > 0 && deliveries[0].status !== 'delivered' && (
        <div 
          className="active-delivery-strip flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl mb-4 cursor-pointer hover:bg-blue-100 transition"
          onClick={() => navigateToTab('delivery')}
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Truck size={18} />
            </span>
            <div>
              <span className="text-xs font-bold text-blue-900">
                Hospital Medicine Delivery ({deliveries[0].orderId})
              </span>
              <p className="text-xs text-blue-700">
                OTP: <strong>{deliveries[0].otp}</strong> • {deliveries[0].deliveryPartner.name} ({deliveries[0].deliveryPartner.etaMinutes} mins)
              </p>
            </div>
          </div>
          <button className="text-xs font-semibold text-blue-700 bg-white px-2.5 py-1 rounded shadow-sm">
            Track Live ➜
          </button>
        </div>
      )}

      {/* Quick Services Grid */}
      <div className="services-section">
        <div className="section-title-row">
          <h3>{t('quickServices')}</h3>
          <span className="section-subtitle">{t('tapAnyService')}</span>
        </div>

        <div className="services-cards-grid">
          {/* Service 1: Doctor Search & Discovery */}
          <div className="service-card" onClick={() => navigateToTab('doctor-search')}>
            <div className="service-icon blue">
              <Search size={24} />
            </div>
            <h4>Search Doctors</h4>
            <p>Filter by specialty, language, rating & hospital</p>
          </div>

          {/* Service 2: Find Doctor & Book */}
          <div className="service-card" onClick={() => navigateToTab('appointments')}>
            <div className="service-icon blue">
              <Stethoscope size={24} />
            </div>
            <h4>{t('bookApptTitle')}</h4>
            <p>{t('bookApptDesc')}</p>
          </div>

          {/* Service 2: Nearby Hospitals & Maps */}
          <div className="service-card" onClick={() => navigateToTab('map')}>
            <div className="service-icon emerald">
              <Hospital size={24} />
            </div>
            <h4>{t('nearbyHospitalsTitle')}</h4>
            <p>{t('nearbyHospitalsDesc')}</p>
          </div>

          {/* Service 3: Medicine Reminders */}
          <div className="service-card" onClick={() => navigateToTab('medicines')}>
            <div className="service-icon purple">
              <Pill size={24} />
            </div>
            <h4>{t('myMedicinesTitle')}</h4>
            <p>{t('myMedicinesDesc')}</p>
          </div>

          {/* Service 4: AI Healthcare Guide */}
          <div className="service-card" onClick={() => openModal('aiGuide')}>
            <div className="service-icon teal">
              <Bot size={24} />
            </div>
            <h4>{t('aiVoiceAssistantTitle')}</h4>
            <p>{t('aiVoiceAssistantDesc')}</p>
          </div>

          {/* Service 5: Online Payment & Receipts */}
          <div className="service-card" onClick={() => openModal('payment')}>
            <div className="service-icon indigo">
              <CreditCard size={24} />
            </div>
            <h4>{t('payBillTitle')}</h4>
            <p>{t('payBillDesc')}</p>
          </div>

          {/* Service 6: Govt Schemes & Subsidies */}
          <div className="service-card" onClick={() => navigateToTab('schemes')}>
            <div className="service-icon amber">
              <Award size={24} />
            </div>
            <h4>{t('govtSchemesTitle')}</h4>
            <p>{t('govtSchemesDesc')}</p>
          </div>

          {/* Service 7: Hospital-to-Home Medicine Delivery */}
          <div className="service-card" onClick={() => navigateToTab('delivery')}>
            <div className="service-icon cyan">
              <Truck size={24} />
            </div>
            <h4>Home Medicine Delivery</h4>
            <p>Direct from Jan Aushadhi with live tracking & OTP</p>
          </div>
        </div>
      </div>

      {/* Daily Medicines Snapshot */}
      <div className="home-medicines-snapshot">
        <div className="section-title-row">
          <h3>{t('todayMeds')}</h3>
          <button className="link-action-btn" onClick={() => navigateToTab('medicines')}>
            {t('viewFullPrescription')}
          </button>
        </div>

        <div className="medicines-horizontal-list">
          {medicines.slice(0, 3).map((med) => (
            <div key={med.id} className={`med-mini-card ${med.taken ? 'taken' : ''}`}>
              <div className="med-mini-header">
                <span className="timing-dot" style={{ background: med.color }}></span>
                <span className="timing-str">{med.timeStr}</span>
                <span className="food-str">{med.food}</span>
              </div>
              <h4 className="med-name">{med.name}</h4>
              <button 
                className={`pill-check-btn ${med.taken ? 'checked' : ''}`}
                onClick={() => togglePillTaken(med.id)}
              >
                {med.taken ? `✓ ${t('alreadyTaken')}` : t('markTaken')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Caregiver Call Strip */}
      <div className="home-caregiver-strip">
        <div className="caregiver-strip-text">
          <Heart size={20} className="text-red-500" />
          <div>
            <strong>{t('emergencyCaregiver')}:</strong>
            <span> {patient.caregiver}</span>
          </div>
        </div>
        <a href="tel:9876543210" className="caregiver-quick-dial-btn">
          <PhoneCall size={16} /> {t('callCaregiver')}
        </a>
      </div>
    </div>
  );
};

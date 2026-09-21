import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, PhoneCall, MapPin, Send, ShieldAlert, X, Hospital } from 'lucide-react';

export const SOSModal = () => {
  const { modals, closeModal, hospitals, patient, triggerDynamicIsland, navigateToTab, setSelectedHospitalForMap, t } = useApp();
  const [alertSent, setAlertSent] = useState(false);

  if (!modals.sos) return null;

  const emergencyHospitals = hospitals.filter(h => h.hasEmergencyER);

  const handleSendCaregiverAlert = () => {
    setAlertSent(true);
    triggerDynamicIsland('Caregiver Alert Dispatched 📲');
    setTimeout(() => setAlertSent(false), 5000);
  };

  const handleDirectHospitalNav = (hosp) => {
    setSelectedHospitalForMap(hosp);
    closeModal('sos');
    navigateToTab('map');
  };

  return (
    <div className="modal-overlay sos-overlay" onClick={() => closeModal('sos')}>
      <div className="modal-content sos-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="sos-title">
        <div className="modal-header sos-header">
          <div className="title-with-icon">
            <div className="icon-badge red">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h2 id="sos-title">{t('emergencyHeader')}</h2>
              <span className="subtitle-badge red-badge">High Urgency Emergency Care</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => closeModal('sos')} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {/* Clear Mandatory Disclaimer */}
        <div className="sos-disclaimer-box">
          <AlertCircle size={22} className="text-red-600 flex-shrink-0" />
          <p>{t('emergencyDisclaimer')}</p>
        </div>

        <div className="modal-body">
          {/* Direct 1-Tap Emergency Calling Grid */}
          <div className="sos-calling-grid">
            <a href="tel:112" className="sos-call-card national-er">
              <PhoneCall size={26} />
              <div>
                <span className="er-num">112</span>
                <span className="er-label">{t('call112')}</span>
              </div>
            </a>

            <a href="tel:108" className="sos-call-card ambulance-er">
              <PhoneCall size={26} />
              <div>
                <span className="er-num">108</span>
                <span className="er-label">{t('call108')}</span>
              </div>
            </a>

            <a href="tel:100" className="sos-call-card police-er">
              <PhoneCall size={26} />
              <div>
                <span className="er-num">100</span>
                <span className="er-label">{t('call100')}</span>
              </div>
            </a>
          </div>

          {/* Alert Family / Caregiver */}
          <div className="sos-caregiver-card">
            <div className="caregiver-info">
              <h4>{t('emergencyCaregiver')}</h4>
              <p className="caregiver-contact">{patient.caregiver || 'Kavitha R (Daughter) - +91 98765 43210'}</p>
            </div>
            <div className="caregiver-actions">
              <a href="tel:9876543210" className="caregiver-call-btn">
                <PhoneCall size={18} /> {t('callCaregiver')}
              </a>
              <button
                className={`caregiver-alert-btn ${alertSent ? 'sent' : ''}`}
                onClick={handleSendCaregiverAlert}
              >
                <Send size={18} /> {alertSent ? t('sosAlertSent') : t('alertCaregiverNow')}
              </button>
            </div>
          </div>

          {/* Nearest Emergency Hospitals */}
          <div className="nearest-er-section">
            <div className="section-title-row">
              <Hospital size={20} className="text-red-600" />
              <h3>{t('findNearestER')}</h3>
            </div>

            <div className="er-hospitals-list">
              {emergencyHospitals.map(hosp => (
                <div key={hosp.id} className="er-hosp-card">
                  <div className="er-hosp-info">
                    <h4>{hosp.name}</h4>
                    <p className="er-hosp-addr">{hosp.address}</p>
                    <div className="er-badges-row">
                      <span className="badge-dist">📍 {hosp.distanceKm} km away</span>
                      <span className="badge-beds">🛏️ {hosp.erBedsAvailable} ER Beds Available</span>
                    </div>
                  </div>
                  <div className="er-hosp-actions">
                    <a href={`tel:${hosp.phone}`} className="er-phone-btn">
                      <PhoneCall size={16} /> Call ER
                    </a>
                    <button
                      className="er-route-btn"
                      onClick={() => handleDirectHospitalNav(hosp)}
                    >
                      <MapPin size={16} /> Route Map
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="secondary-btn full-width" onClick={() => closeModal('sos')}>
            Close Emergency Panel
          </button>
        </div>
      </div>
    </div>
  );
};

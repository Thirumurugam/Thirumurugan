import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, PhoneCall } from 'lucide-react';

export const EmergencyFloatingButton = () => {
  const { openModal, elderMode, currentLang } = useApp();

  return (
    <button
      id="btn-emergency-floating"
      className={`emergency-floating-btn ${elderMode ? 'elder-sos' : ''}`}
      onClick={() => openModal('sos')}
      aria-label="Emergency SOS Medical Assistance"
      title="Emergency Help & Nearest ER (SOS)"
    >
      <div className="sos-pulse-ring"></div>
      <div className="sos-btn-content">
        <AlertCircle size={elderMode ? 28 : 22} className="sos-icon" />
        <span className="sos-text">EMERGENCY (SOS)</span>
      </div>
    </button>
  );
};

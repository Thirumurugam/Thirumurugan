import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, ShieldCheck, Mail, Phone, Heart, Award, 
  Globe, Moon, LogOut, CheckCircle2, AlertCircle, FileText, CreditCard 
} from 'lucide-react';

export const ProfileTab = () => {
  const {
    patient,
    setPatient,
    currentLang,
    changeLanguage,
    elderMode,
    toggleElderMode,
    payments,
    switchRole,
    triggerDynamicIsland,
    t
  } = useApp();

  const [emailVerified, setEmailVerified] = useState(patient.emailVerified ?? true);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleResendEmail = () => {
    setVerificationSent(true);
    triggerDynamicIsland('Verification Link Sent 📧');
    setTimeout(() => setVerificationSent(false), 4000);
  };

  return (
    <div className="profile-tab-container">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-avatar-large">👤</div>
        <div className="profile-main-details">
          <h2>{patient.name}</h2>
          <p className="profile-id-badge">ID: {patient.id} • {patient.age} yrs • {patient.gender}</p>
          
          <div className="profile-verification-status">
            {emailVerified ? (
              <span className="badge-verified">
                <CheckCircle2 size={16} /> {t('emailVerifiedBadge')}
              </span>
            ) : (
              <button className="badge-unverified" onClick={handleResendEmail}>
                <AlertCircle size={16} /> {verificationSent ? 'Link Dispatched ✉️' : t('emailUnverifiedBadge')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Demographics & Clinical Information */}
      <div className="profile-section-card">
        <div className="section-header-line">
          <User size={20} className="text-blue-500" />
          <h3>Personal & Medical Profile</h3>
        </div>

        <div className="profile-info-grid">
          <div className="info-item">
            <span className="info-label">Blood Group:</span>
            <span className="info-value text-red-600 font-bold">{patient.blood}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Primary Mobile:</span>
            <span className="info-value">{patient.phone}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Email Address:</span>
            <span className="info-value">{patient.email}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Ayushman Card:</span>
            <span className="info-value font-mono text-emerald-600">{patient.schemeCardNo}</span>
          </div>
        </div>

        {/* Chronic Conditions & Allergies */}
        <div className="clinical-tags-block mt-3">
          <span className="block-label">Chronic Conditions:</span>
          <div className="chips-wrap">
            {patient.chronicConditions && patient.chronicConditions.map((cond, idx) => (
              <span key={idx} className="chronic-chip">🩺 {cond}</span>
            ))}
          </div>
        </div>

        <div className="clinical-tags-block mt-2">
          <span className="block-label">Known Drug Allergies:</span>
          <div className="chips-wrap">
            {patient.allergies && patient.allergies.map((allg, idx) => (
              <span key={idx} className="allergy-chip">⚠️ {allg}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Caregiver Card */}
      <div className="profile-section-card caregiver-card">
        <div className="section-header-line">
          <Heart size={20} className="text-red-500" />
          <h3>{t('emergencyCaregiver')}</h3>
        </div>
        <p className="caregiver-val">{patient.caregiver}</p>
        <p className="caregiver-note">This contact receives automatic SMS alerts with GPS coordinates during Emergency SOS activations.</p>
      </div>

      {/* Preferences & Accessibility */}
      <div className="profile-section-card">
        <div className="section-header-line">
          <Globe size={20} className="text-purple-500" />
          <h3>App Preferences & Accessibility</h3>
        </div>

        <div className="pref-row">
          <label>Interface Language:</label>
          <select value={currentLang} onChange={e => changeLanguage(e.target.value)}>
            <option value="en">English (US/UK)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
            <option value="es">Español (Spanish)</option>
          </select>
        </div>

        <div className="pref-row mt-3">
          <div>
            <label className="font-semibold">{t('elderMode')}:</label>
            <p className="text-xs text-gray-500">Extra large text, high contrast & speech assistance</p>
          </div>
          <button 
            className={`toggle-switch-btn ${elderMode ? 'active' : ''}`}
            onClick={toggleElderMode}
          >
            {elderMode ? 'ACTIVE ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Payment History Invoices */}
      <div className="profile-section-card">
        <div className="section-header-line">
          <CreditCard size={20} className="text-indigo-500" />
          <h3>{t('paymentHistory')}</h3>
        </div>

        <div className="invoices-list">
          {payments.map((p, idx) => (
            <div key={idx} className="invoice-row-item">
              <div>
                <strong>{p.receiptNo}</strong>
                <p className="text-xs text-gray-500">{p.doctorName} • {p.date}</p>
              </div>
              <div className="text-right">
                <span className="invoice-amount font-bold text-emerald-600">₹{p.amount}</span>
                <span className="invoice-status block text-xs text-gray-400">{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Switch Portal & Sign Out */}
      <div className="profile-actions-footer">
        <button 
          className="secondary-btn portal-switch-btn"
          onClick={() => switchRole('doctor')}
        >
          👨‍⚕️ Switch to Doctor Console
        </button>

        <button 
          className="secondary-btn portal-switch-btn"
          onClick={() => switchRole('admin')}
        >
          🛡️ Switch to Admin Portal
        </button>

        <button 
          className="danger-btn signout-btn full-width mt-3"
          onClick={() => switchRole('patient')}
        >
          <LogOut size={18} /> {t('signOutBtn')}
        </button>
      </div>
    </div>
  );
};

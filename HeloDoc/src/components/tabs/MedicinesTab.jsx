import React from 'react';
import { useApp } from '../../context/AppContext';
import { speak } from '../../services/speechService';
import { 
  Pill, Clock, Sun, Moon, Utensils, CheckCircle2, 
  Plus, Volume2, Award, FileText, AlertCircle, ShoppingBag 
} from 'lucide-react';

export const MedicinesTab = () => {
  const {
    medicines,
    togglePillTaken,
    diagnosis,
    openModal,
    navigateToTab,
    createDeliveryOrder,
    currentLang,
    elderMode,
    t
  } = useApp();

  const morningMeds = medicines.filter(m => m.timing === 'morning');
  const afternoonMeds = medicines.filter(m => m.timing === 'afternoon');
  const nightMeds = medicines.filter(m => m.timing === 'night');

  const takenCount = medicines.filter(m => m.taken).length;
  const compliancePercent = medicines.length > 0 ? Math.round((takenCount / medicines.length) * 100) : 0;

  const handleListenDiagnosis = () => {
    speak(`Doctor's Diagnosis: ${diagnosis}`, currentLang, elderMode);
  };

  return (
    <div className="medicines-tab-container">
      {/* Header Banner */}
      <div className="medicines-header-card">
        <div className="title-row">
          <div className="icon-badge blue">
            <Pill size={24} />
          </div>
          <div>
            <h2>{t('medicineReminderHeader')}</h2>
            <p>{t('medicineSubHeader')}</p>
          </div>
        </div>

        {/* Daily Compliance Bar */}
        <div className="compliance-bar-card">
          <div className="compliance-header">
            <span>{t('complianceRate')}</span>
            <strong>{takenCount} of {medicines.length} Taken ({compliancePercent}%)</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${compliancePercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Doctor's Diagnosis & Notes Banner */}
      <div className="diagnosis-banner-box">
        <div className="diag-header-line">
          <div className="diag-title">
            <FileText size={18} className="text-blue-500" />
            <h4>{t('diagnosisLabel')}</h4>
          </div>
          <button 
            className="diag-listen-btn"
            onClick={handleListenDiagnosis}
            title="Listen to diagnosis"
          >
            <Volume2 size={16} /> {t('listenRx')}
          </button>
        </div>
        <p className="diagnosis-text">{diagnosis}</p>
      </div>

      {/* Add Custom Medicine Button */}
      <div className="add-med-action-row">
        <button className="primary-btn add-btn" onClick={() => openModal('addMedicine')}>
          <Plus size={18} /> {t('addNewMedicine')}
        </button>
      </div>

      {/* SECTION 1: MORNING MEDICINES */}
      <div className="timing-group-section">
        <div className="timing-section-header morning">
          <Sun size={22} className="text-amber-500" />
          <h3>{t('morningMeds')}</h3>
          <span className="timing-badge">07:30 AM - 09:00 AM</span>
        </div>

        <div className="medicines-cards-list">
          {morningMeds.map((med) => (
            <div key={med.id} className={`med-full-card ${med.taken ? 'taken' : ''}`}>
              <div className="med-color-bar" style={{ background: med.color || '#3b82f6' }}></div>
              <div className="med-info-col">
                <h4>{med.name}</h4>
                <div className="med-meta-tags">
                  <span className="tag-food">🍽️ {med.food}</span>
                  <span className="tag-time">⏰ {med.timeStr}</span>
                  <span className="tag-days">📅 {med.days}</span>
                </div>
              </div>
              <button 
                className={`med-take-action-btn ${med.taken ? 'checked' : ''}`}
                onClick={() => togglePillTaken(med.id)}
                aria-label={`Mark ${med.name} as taken`}
              >
                {med.taken ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span>{t('alreadyTaken')}</span>
                  </>
                ) : (
                  <span>{t('markTaken')}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: AFTERNOON MEDICINES */}
      <div className="timing-group-section">
        <div className="timing-section-header afternoon">
          <Utensils size={22} className="text-blue-500" />
          <h3>{t('afternoonMeds')}</h3>
          <span className="timing-badge">01:00 PM - 02:30 PM</span>
        </div>

        <div className="medicines-cards-list">
          {afternoonMeds.map((med) => (
            <div key={med.id} className={`med-full-card ${med.taken ? 'taken' : ''}`}>
              <div className="med-color-bar" style={{ background: med.color || '#f59e0b' }}></div>
              <div className="med-info-col">
                <h4>{med.name}</h4>
                <div className="med-meta-tags">
                  <span className="tag-food">🍽️ {med.food}</span>
                  <span className="tag-time">⏰ {med.timeStr}</span>
                  <span className="tag-days">📅 {med.days}</span>
                </div>
              </div>
              <button 
                className={`med-take-action-btn ${med.taken ? 'checked' : ''}`}
                onClick={() => togglePillTaken(med.id)}
                aria-label={`Mark ${med.name} as taken`}
              >
                {med.taken ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span>{t('alreadyTaken')}</span>
                  </>
                ) : (
                  <span>{t('markTaken')}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: NIGHT MEDICINES */}
      <div className="timing-group-section">
        <div className="timing-section-header night">
          <Moon size={22} className="text-purple-500" />
          <h3>{t('nightMeds')}</h3>
          <span className="timing-badge">08:00 PM - 10:00 PM</span>
        </div>

        <div className="medicines-cards-list">
          {nightMeds.map((med) => (
            <div key={med.id} className={`med-full-card ${med.taken ? 'taken' : ''}`}>
              <div className="med-color-bar" style={{ background: med.color || '#8b5cf6' }}></div>
              <div className="med-info-col">
                <h4>{med.name}</h4>
                <div className="med-meta-tags">
                  <span className="tag-food">🍽️ {med.food}</span>
                  <span className="tag-time">⏰ {med.timeStr}</span>
                  <span className="tag-days">📅 {med.days}</span>
                </div>
              </div>
              <button 
                className={`med-take-action-btn ${med.taken ? 'checked' : ''}`}
                onClick={() => togglePillTaken(med.id)}
                aria-label={`Mark ${med.name} as taken`}
              >
                {med.taken ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span>{t('alreadyTaken')}</span>
                  </>
                ) : (
                  <span>{t('markTaken')}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Jan Aushadhi Generic Pharmacy & Home Delivery Promotion */}
      <div className="jan-aushadhi-card">
        <div className="aushadhi-icon">
          <ShoppingBag size={24} />
        </div>
        <div className="aushadhi-text">
          <h4>{t('getMedicineHospital')}</h4>
          <p>Avail 50% to 90% savings on generic medicines at Jan Aushadhi Kendra (Ground Floor Room 004). You can also have them delivered directly to your doorstep.</p>
          <div className="aushadhi-actions-row">
            <button 
              className="primary-btn text-sm"
              onClick={() => {
                createDeliveryOrder();
              }}
            >
              🚚 Order Home Delivery of Prescribed Medicines (50% Off)
            </button>
            <button 
              className="secondary-btn text-sm"
              onClick={() => navigateToTab('delivery')}
            >
              📍 Track Active Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

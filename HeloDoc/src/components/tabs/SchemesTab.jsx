import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { healthSchemes } from '../../data/hospitalData';
import { speak } from '../../services/speechService';

export const SchemesTab = () => {
  const { triggerDynamicIsland, currentLang, elderMode, t } = useApp();

  const [calcAge, setCalcAge] = useState(68);
  const [calcIncome, setCalcIncome] = useState('low');

  const applyScheme = (schemeName) => {
    triggerDynamicIsland('Subsidy Applied 🏛️');
    speak(`${schemeName} subsidy applied to your hospital billing account.`, currentLang, elderMode);
    alert(`${schemeName} applied! 50% discount will be reflected on your checkout invoice.`);
  };

  return (
    <section className="tab-page active" id="tab-schemes">
      <div className="page-title-header">
        <h2>{t('schemesHeader')}</h2>
        <p>{t('schemesSubHeader')}</p>
      </div>

      {/* Scheme Eligibility Calculator Widget */}
      <div className="eligibility-widget">
        <div className="widget-header">
          <span className="widget-icon">💡</span>
          <div>
            <h3>{t('checkEligibilityTitle')}</h3>
            <p>{t('checkEligibilitySub')}</p>
          </div>
        </div>

        <div className="eligibility-form">
          <div className="form-row">
            <div className="form-col">
              <label className="form-label">{t('patientAge')}</label>
              <select
                className="form-input"
                value={calcAge}
                onChange={(e) => setCalcAge(parseInt(e.target.value))}
              >
                <option value="68">60+ Years (Senior Citizen)</option>
                <option value="45">40 - 59 Years</option>
                <option value="25">Below 40 Years</option>
              </select>
            </div>
            <div className="form-col">
              <label className="form-label">{t('annualIncome')}</label>
              <select
                className="form-input"
                value={calcIncome}
                onChange={(e) => setCalcIncome(e.target.value)}
              >
                <option value="low">Below ₹2.5 Lakhs / Ayushman Card</option>
                <option value="mid">₹2.5L - ₹5 Lakhs</option>
                <option value="high">Above ₹5 Lakhs</option>
              </select>
            </div>
          </div>

          <div className="eligibility-result-box" id="eligibility-result-box">
            {calcAge >= 60 ? (
              <>
                <div className="res-badge">🎉 100% Eligible for Senior Concessions & PM-JAY!</div>
                <p>
                  As a senior citizen ({calcAge}y), you qualify for <strong>50% discount on all OPD visits and scans</strong> plus <strong>₹5,00,000 cashless cover</strong> under Ayushman Bharat.
                </p>
              </>
            ) : calcIncome === 'low' ? (
              <>
                <div className="res-badge">🎉 Eligible for Ayushman Bharat (PM-JAY)!</div>
                <p>
                  You qualify for <strong>₹5,00,000 full cashless hospitalization</strong> across all major surgeries and treatments.
                </p>
              </>
            ) : (
              <>
                <div className="res-badge">✅ Eligible for Jan Aushadhi Low Cost Pharmacy</div>
                <p>
                  Save up to <strong>90% on generic medications</strong> at hospital counter Room 004.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Schemes Directory List */}
      <div className="schemes-list">
        {healthSchemes.map((s) => (
          <div key={s.id} className="scheme-card">
            <div className="scheme-header-row">
              <div>
                <span className="scheme-badge">{s.badge}</span>
                <h3 className="mt-2">{s.name}</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.type}</span>
              </div>
            </div>
            <p className="mt-2">{s.desc}</p>
            <div className="scheme-benefit-box">
              💰 Benefit: <strong>{s.coverage}</strong> ({s.discount})
            </div>
            <button
              className="btn btn-primary btn-full btn-sm"
              onClick={() => applyScheme(s.name)}
            >
              ✅ Apply {s.name.split(' ')[0]} Subsidy
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

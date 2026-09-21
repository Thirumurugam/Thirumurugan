import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Stethoscope, Clock, UserCheck, FileText, Pill, Plus, Trash2, 
  CheckCircle2, AlertCircle, Calendar, Sparkles, Send, FileSpreadsheet 
} from 'lucide-react';

export const DoctorTab = () => {
  const { doctorQueue, issueDoctorPrescription, diagnosis, setDiagnosis, appointmentsHistory, t } = useApp();
  const [activeQueueIndex, setActiveQueueIndex] = useState(0);
  const [diagnosisInput, setDiagnosisInput] = useState(diagnosis);
  const [treatmentNotes, setTreatmentNotes] = useState('Continue warm water fermentation twice daily. Avoid squatting on floor. Quadriceps strengthening exercises.');
  
  // Structured Medication Builder
  const [prescribedMeds, setPrescribedMeds] = useState([
    { name: 'Glucosamine & Chondroitin', dosage: '500mg', timing: 'morning', foodRelation: 'After Breakfast', duration: '15 Days' },
    { name: 'Pantoprazole', dosage: '40mg', timing: 'morning', foodRelation: 'Before Breakfast', duration: '10 Days' },
    { name: 'Calcimax Calcium + D3', dosage: '500mg', timing: 'afternoon', foodRelation: 'After Lunch', duration: '30 Days' },
    { name: 'Diacerein', dosage: '50mg', timing: 'night', foodRelation: 'After Dinner', duration: '30 Days' }
  ]);

  const [newDrug, setNewDrug] = useState({
    name: '',
    dosage: '500mg',
    timing: 'morning',
    foodRelation: 'After Food',
    duration: '10 Days'
  });

  const [activeView, setActiveView] = useState('console'); // 'console', 'schedule', 'history'

  const activePatient = doctorQueue[activeQueueIndex] || doctorQueue[0];

  const handleAddDrug = (e) => {
    e.preventDefault();
    if (!newDrug.name) return;
    setPrescribedMeds(prev => [...prev, newDrug]);
    setNewDrug({ name: '', dosage: '500mg', timing: 'morning', foodRelation: 'After Food', duration: '10 Days' });
  };

  const handleRemoveDrug = (index) => {
    setPrescribedMeds(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleIssuePrescription = () => {
    if (!activePatient) return;
    issueDoctorPrescription({
      appointmentId: activePatient.id,
      diagnosisText: diagnosisInput,
      prescribedMeds,
      instructions: treatmentNotes
    });
  };

  return (
    <div className="doctor-console-container">
      {/* Console Top Header */}
      <div className="doctor-header-card">
        <div className="doc-meta-row">
          <div className="doc-avatar-badge">👨‍⚕️</div>
          <div>
            <h2>Dr. Rajesh Kumar (Room 104)</h2>
            <p>Senior Orthopedic Surgeon & Geriatric Care • City Care Hospital</p>
          </div>
        </div>

        <div className="doc-sub-tabs">
          <button 
            className={`doc-tab-btn ${activeView === 'console' ? 'active' : ''}`}
            onClick={() => setActiveView('console')}
          >
            🩺 Consultation Desk ({doctorQueue.length} Waiting)
          </button>
          <button 
            className={`doc-tab-btn ${activeView === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveView('schedule')}
          >
            📅 Weekly Schedule
          </button>
          <button 
            className={`doc-tab-btn ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            📜 Completed Consultations
          </button>
        </div>
      </div>

      {activeView === 'console' && (
        <div className="doctor-consultation-layout">
          {/* Left Column: Live Queue */}
          <div className="doctor-queue-panel">
            <div className="panel-header">
              <Clock size={18} />
              <h3>{t('doctorQueueTitle')}</h3>
              <span className="badge-count">{doctorQueue.length}</span>
            </div>

            <div className="queue-list">
              {doctorQueue.length === 0 ? (
                <div className="empty-queue-msg">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                  <p>All patients for today's session have been consulted!</p>
                </div>
              ) : (
                doctorQueue.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className={`queue-item-card ${activeQueueIndex === idx ? 'active-queue-card' : ''}`}
                    onClick={() => setActiveQueueIndex(idx)}
                  >
                    <div className="queue-token-col">
                      <span className="token-tag">{item.token}</span>
                      <span className="patient-age">{item.age} yrs</span>
                    </div>
                    <div className="queue-patient-col">
                      <h4>{item.patient}</h4>
                      <p className="problem-preview">{item.problem}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Active Consultation Desk */}
          {activePatient ? (
            <div className="doctor-desk-panel">
              <div className="active-patient-header">
                <div>
                  <span className="current-token-badge">{activePatient.token}</span>
                  <h3>{activePatient.patient}</h3>
                  <p className="patient-sub-details">Age: {activePatient.age} yrs • Phone: {activePatient.phone}</p>
                </div>
                <div className="room-active-indicator">
                  <span className="pulse-dot"></span> In Consultation
                </div>
              </div>

              {/* Patient's Submitted Problem & Reports */}
              <div className="patient-symptom-review-box">
                <div className="review-title-row">
                  <FileText size={18} className="text-blue-500" />
                  <h4>{t('patientProblemTitle')}</h4>
                </div>
                <p className="patient-problem-text">"{activePatient.problem}"</p>

                {activePatient.reports && activePatient.reports.length > 0 && (
                  <div className="patient-reports-row">
                    <span className="reports-label">{t('patientAttachedDocs')}</span>
                    <div className="reports-chips">
                      {activePatient.reports.map((rep, rIdx) => (
                        <span key={rIdx} className="report-chip">
                          📄 {rep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Diagnosis Notes Editor */}
              <div className="desk-section">
                <label className="desk-section-label">
                  <Stethoscope size={16} /> {t('addClinicalNotes')}
                </label>
                <textarea
                  rows={2}
                  value={diagnosisInput}
                  onChange={e => setDiagnosisInput(e.target.value)}
                  placeholder="Enter medical diagnosis and findings..."
                />
              </div>

              {/* Prescription Builder */}
              <div className="desk-section">
                <label className="desk-section-label">
                  <Pill size={16} /> {t('prescriptionBuilderTitle')}
                </label>

                <div className="prescribed-drugs-table-wrap">
                  <table className="prescribed-table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Timing</th>
                        <th>Food Relation</th>
                        <th>Duration</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescribedMeds.map((drug, dIdx) => (
                        <tr key={dIdx}>
                          <td><strong>{drug.name}</strong></td>
                          <td>{drug.dosage}</td>
                          <td>
                            <span className={`timing-badge ${drug.timing}`}>
                              {drug.timing.toUpperCase()}
                            </span>
                          </td>
                          <td>{drug.foodRelation}</td>
                          <td>{drug.duration}</td>
                          <td>
                            <button 
                              className="remove-drug-btn"
                              onClick={() => handleRemoveDrug(dIdx)}
                              title="Remove Drug"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Drug Row Form */}
                <form onSubmit={handleAddDrug} className="add-drug-form-row">
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    value={newDrug.name}
                    onChange={e => setNewDrug({ ...newDrug, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Dosage (500mg)"
                    value={newDrug.dosage}
                    onChange={e => setNewDrug({ ...newDrug, dosage: e.target.value })}
                  />
                  <select
                    value={newDrug.timing}
                    onChange={e => setNewDrug({ ...newDrug, timing: e.target.value })}
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="night">Night</option>
                  </select>
                  <select
                    value={newDrug.foodRelation}
                    onChange={e => setNewDrug({ ...newDrug, foodRelation: e.target.value })}
                  >
                    <option value="After Food">After Food</option>
                    <option value="Before Food">Before Food</option>
                    <option value="With Food">With Food</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Days (10 Days)"
                    value={newDrug.duration}
                    onChange={e => setNewDrug({ ...newDrug, duration: e.target.value })}
                  />
                  <button type="submit" className="add-drug-btn">
                    <Plus size={16} /> Add
                  </button>
                </form>
              </div>

              {/* Issue Prescription Button */}
              <div className="desk-actions-bar">
                <button 
                  className="primary-btn issue-rx-btn full-width"
                  onClick={handleIssuePrescription}
                >
                  <Send size={18} /> {t('issuePrescriptionBtn')}
                </button>
              </div>
            </div>
          ) : (
            <div className="doctor-desk-panel empty-desk">
              <CheckCircle2 size={48} className="text-emerald-500" />
              <h3>No Active Patient Selected</h3>
              <p>Select a patient from the waiting queue on the left to start the consultation.</p>
            </div>
          )}
        </div>
      )}

      {activeView === 'schedule' && (
        <div className="doctor-schedule-view">
          <div className="schedule-card">
            <h3>{t('doctorScheduleTitle')}</h3>
            <p>Define weekly consultation days, OPD hours, and consultation fee.</p>

            <div className="days-selector-grid mt-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <div key={idx} className="day-slot-card active">
                  <h4>{day}</h4>
                  <p>09:30 AM - 01:00 PM</p>
                  <p>04:30 PM - 07:00 PM</p>
                  <span className="slot-badge">8 Slots Available</span>
                </div>
              ))}
            </div>

            <div className="fee-config-row mt-4">
              <label>Standard Consultation Fee: <strong>₹500</strong></label>
              <label>Room Allocation: <strong>Room 104 (1st Floor OPD)</strong></label>
            </div>
          </div>
        </div>
      )}

      {activeView === 'history' && (
        <div className="doctor-history-view">
          <div className="history-card">
            <h3>Past Consultation Logs</h3>
            <div className="admin-table-container mt-3">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Diagnosis Summary</th>
                    <th>Prescription Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsHistory.map((apt, idx) => (
                    <tr key={idx}>
                      <td><span className="token-badge">{apt.token}</span></td>
                      <td><strong>{apt.patient || 'Mr. Ramachandran V.'}</strong></td>
                      <td>{apt.date}</td>
                      <td>{apt.treatment || diagnosis}</td>
                      <td><span className="status-pill verified">Signed Rx Issued ✓</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

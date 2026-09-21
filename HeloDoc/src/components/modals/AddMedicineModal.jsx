import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Pill, X, Plus, Clock } from 'lucide-react';

export const AddMedicineModal = () => {
  const { modals, closeModal, addCustomMedicine, t } = useApp();
  const [medData, setMedData] = useState({
    name: '',
    dosage: '500mg',
    timing: 'morning',
    timeStr: '08:30 AM',
    food: 'After Breakfast',
    days: '15 Days'
  });

  if (!modals.addMedicine) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!medData.name) return;
    addCustomMedicine(medData);
    closeModal('addMedicine');
  };

  const handleTimingChange = (val) => {
    let timeStr = '08:30 AM';
    let food = 'After Breakfast';
    if (val === 'afternoon') {
      timeStr = '01:30 PM';
      food = 'After Lunch';
    } else if (val === 'night') {
      timeStr = '08:30 PM';
      food = 'After Dinner';
    }
    setMedData({ ...medData, timing: val, timeStr, food });
  };

  return (
    <div className="modal-overlay" onClick={() => closeModal('addMedicine')}>
      <div className="modal-content add-medicine-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="add-med-title">
        <div className="modal-header">
          <div className="title-with-icon">
            <div className="icon-badge blue">
              <Pill size={24} />
            </div>
            <div>
              <h2 id="add-med-title">{t('addNewMedicine')}</h2>
              <span className="subtitle-badge">Custom Pill & Timing Reminder</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => closeModal('addMedicine')} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Medicine / Drug Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Telmisartan 40mg or Metformin"
                value={medData.name}
                onChange={e => setMedData({ ...medData, name: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Schedule Timing</label>
                <select
                  value={medData.timing}
                  onChange={e => handleTimingChange(e.target.value)}
                >
                  <option value="morning">Morning (Breakfast)</option>
                  <option value="afternoon">Afternoon (Lunch)</option>
                  <option value="night">Night (Dinner / Bedtime)</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Reminder Time</label>
                <input
                  type="text"
                  value={medData.timeStr}
                  onChange={e => setMedData({ ...medData, timeStr: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Food Relationship</label>
                <select
                  value={medData.food}
                  onChange={e => setMedData({ ...medData, food: e.target.value })}
                >
                  <option value="After Breakfast">After Breakfast</option>
                  <option value="Before Breakfast (Empty Stomach)">Before Breakfast (Empty Stomach)</option>
                  <option value="After Lunch">After Lunch</option>
                  <option value="Before Lunch">Before Lunch</option>
                  <option value="After Dinner">After Dinner</option>
                  <option value="At Bedtime">At Bedtime</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Duration / Total Days</label>
                <input
                  type="text"
                  placeholder="e.g. 15 Days or Ongoing"
                  value={medData.days}
                  onChange={e => setMedData({ ...medData, days: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-btn" onClick={() => closeModal('addMedicine')}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              <Plus size={18} /> Add to Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

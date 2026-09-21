import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, X, Plus } from 'lucide-react';

export const AddHospitalModal = () => {
  const { modals, closeModal, addNewHospital } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Multi-Specialty Hospital',
    address: '',
    phone: '',
    emergencyHelpline: '108',
    hasEmergencyER: true,
    ambulanceAvailable: true,
    erBedsAvailable: 10,
    totalBeds: 200
  });

  if (!modals.addHospital) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;
    addNewHospital(formData);
  };

  return (
    <div className="modal-overlay" onClick={() => closeModal('addHospital')}>
      <div className="modal-content add-hospital-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="add-hosp-title">
        <div className="modal-header">
          <div className="title-with-icon">
            <div className="icon-badge blue">
              <Building2 size={24} />
            </div>
            <div>
              <h2 id="add-hosp-title">Register Hospital / Clinic</h2>
              <span className="subtitle-badge">HeloDoc Verified Healthcare Facility Network</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => closeModal('addHospital')} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Hospital / Clinic Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sanjeevani Care Memorial Hospital"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Facility Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Multi-Specialty Hospital">Multi-Specialty Hospital</option>
                  <option value="Government Public Hospital">Government Public Hospital</option>
                  <option value="Super Specialty Centre">Super Specialty Centre</option>
                  <option value="Specialized Geriatric Clinic">Specialized Geriatric Clinic</option>
                  <option value="Daycare & Diagnostic Centre">Daycare & Diagnostic Centre</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Main Contact Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 44 2800 1234"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Full Address & Landmark *</label>
              <input
                type="text"
                required
                placeholder="Street address, City, Pincode"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>24/7 Emergency Helpline</label>
                <input
                  type="text"
                  value={formData.emergencyHelpline}
                  onChange={e => setFormData({ ...formData, emergencyHelpline: e.target.value })}
                />
              </div>

              <div className="form-group flex-1">
                <label>Available ER Beds</label>
                <input
                  type="number"
                  min="0"
                  value={formData.erBedsAvailable}
                  onChange={e => setFormData({ ...formData, erBedsAvailable: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.hasEmergencyER}
                  onChange={e => setFormData({ ...formData, hasEmergencyER: e.target.checked })}
                />
                <span>24/7 Emergency Trauma & ICU Ward</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.ambulanceAvailable}
                  onChange={e => setFormData({ ...formData, ambulanceAvailable: e.target.checked })}
                />
                <span>Ambulance Available</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-btn" onClick={() => closeModal('addHospital')}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              <Plus size={18} /> Register Hospital
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

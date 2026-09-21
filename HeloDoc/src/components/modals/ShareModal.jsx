import React from 'react';
import { useApp } from '../../context/AppContext';

export const ShareModal = () => {
  const { modals, closeModal } = useApp();

  if (!modals.share) return null;

  const handleShareWhatsApp = () => {
    alert('Health Card & Prescriptions shared to WhatsApp (+91 98765 43210 - Kavitha R)!');
    closeModal('share');
  };

  const handleShareSMS = () => {
    alert('Prescription summary and Room 104 token sent via SMS!');
    closeModal('share');
  };

  const handleDownloadPDF = () => {
    alert('Downloading HeloDoc_Medical_Summary_Ramachandran.pdf...');
    closeModal('share');
  };

  return (
    <div className="modal-backdrop open" id="modal-share">
      <div className="modal-card">
        <div className="modal-header">
          <h3>📤 Share Medical Card & Records</h3>
          <button className="modal-close-btn" onClick={() => closeModal('share')}>
            ✕
          </button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Send your live room token, prescription, and hospital report to family members or doctors.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-success btn-full" onClick={handleShareWhatsApp}>
              💬 Share via WhatsApp (+91 98765 43210)
            </button>
            <button className="btn btn-primary btn-full" onClick={handleShareSMS}>
              📱 Send SMS to Caregiver
            </button>
            <button className="btn btn-outline btn-full" onClick={handleDownloadPDF}>
              📄 Download Complete Summary (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

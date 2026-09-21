import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Check, X, AlertTriangle, FileText, Award } from 'lucide-react';

export const DoctorVerificationModal = () => {
  const { modals, closeModal, doctorUnderReview, verifyDoctorAccount, suspendDoctorAccount, activateDoctorAccount } = useApp();

  if (!modals.doctorVerify || !doctorUnderReview) return null;

  return (
    <div className="modal-overlay" onClick={() => closeModal('doctorVerify')}>
      <div className="modal-content doctor-verify-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="doc-verify-title">
        <div className="modal-header">
          <div className="title-with-icon">
            <div className="icon-badge blue">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 id="doc-verify-title">Doctor Credential Verification</h2>
              <span className="subtitle-badge">National Medical Commission (NMC) Audit</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => closeModal('doctorVerify')} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="doctor-review-profile">
            <div className="doc-avatar-large">{doctorUnderReview.avatar || '👨‍⚕️'}</div>
            <div className="doc-info-col">
              <h3>{doctorUnderReview.name}</h3>
              <p className="doc-title-badge">{doctorUnderReview.title}</p>
              <p className="doc-hospital">{doctorUnderReview.hospitalName}</p>
            </div>
          </div>

          <div className="credentials-grid">
            <div className="cred-card">
              <span className="cred-label">Medical Registration No.</span>
              <span className="cred-val highlight">{doctorUnderReview.registrationNumber || 'MCI-TN-48291'}</span>
            </div>
            <div className="cred-card">
              <span className="cred-label">State Medical Council</span>
              <span className="cred-val">{doctorUnderReview.medicalCouncil || 'Tamil Nadu Medical Council'}</span>
            </div>
            <div className="cred-card">
              <span className="cred-label">Clinical Experience</span>
              <span className="cred-val">{doctorUnderReview.experienceYears} Years Active</span>
            </div>
            <div className="cred-card">
              <span className="cred-label">Current Status</span>
              <span className={`status-pill ${doctorUnderReview.verificationStatus}`}>
                {doctorUnderReview.verificationStatus ? doctorUnderReview.verificationStatus.toUpperCase() : 'PENDING'}
              </span>
            </div>
          </div>

          <div className="documents-audit-section">
            <h4>Submitted Digital Certificates & Degrees:</h4>
            <div className="doc-attachment-item">
              <FileText size={18} className="text-blue-500" />
              <span>MBBS_MD_Degree_Certificate_Signed.pdf</span>
              <span className="badge-verified">Verified Signature ✓</span>
            </div>
            <div className="doc-attachment-item">
              <Award size={18} className="text-emerald-500" />
              <span>State_Medical_Council_Registration_2026.pdf</span>
              <span className="badge-verified">Authentic Record ✓</span>
            </div>
          </div>

          <div className="admin-audit-notice">
            <AlertTriangle size={16} className="text-amber-500" />
            <span>Auditor Responsibility: Approving this doctor allows them to issue official digital prescriptions and conduct live consultations.</span>
          </div>
        </div>

        <div className="modal-footer actions-split">
          {doctorUnderReview.verificationStatus === 'suspended' ? (
            <button
              className="primary-btn emerald-btn"
              onClick={() => {
                activateDoctorAccount(doctorUnderReview.id);
                closeModal('doctorVerify');
              }}
            >
              <Check size={18} /> Reactivate Doctor
            </button>
          ) : (
            <>
              <button
                className="secondary-btn danger-btn"
                onClick={() => {
                  suspendDoctorAccount(doctorUnderReview.id);
                  closeModal('doctorVerify');
                }}
              >
                <X size={18} /> Suspend Doctor
              </button>
              <button
                className="primary-btn emerald-btn"
                onClick={() => {
                  verifyDoctorAccount(doctorUnderReview.id);
                  closeModal('doctorVerify');
                }}
              >
                <Check size={18} /> Approve & Verify Doctor
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

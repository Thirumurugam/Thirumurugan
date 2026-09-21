import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, UserCheck, Building2, Calendar, CreditCard, DollarSign, 
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Search, Filter, 
  Plus, AlertTriangle, FileText, ArrowUpRight, RotateCcw, Hospital
} from 'lucide-react';

export const AdminTab = () => {
  const {
    adminPatients,
    doctors,
    hospitals,
    appointmentsHistory,
    payments,
    setDoctorUnderReview,
    openModal,
    suspendDoctorAccount,
    activateDoctorAccount,
    removeHospital,
    cancelAppointmentAdmin,
    t
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState('overview'); // 'overview', 'doctors', 'hospitals', 'appts', 'users', 'payments'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // KPI calculations
  const totalPatients = adminPatients.length;
  const verifiedDoctors = doctors.filter(d => d.verificationStatus === 'verified').length;
  const pendingDoctors = doctors.filter(d => d.verificationStatus === 'pending').length;
  const totalHospitals = hospitals.length;
  const totalAppointments = appointmentsHistory.length;
  const completedAppointments = appointmentsHistory.filter(a => a.status === 'Completed').length;
  const totalGrossVolume = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  // Filtered Doctors
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Hospitals
  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered Appointments
  const filteredAppointments = appointmentsHistory.filter(a => 
    a.token.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.specialty && a.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReviewDoctor = (doctor) => {
    setDoctorUnderReview(doctor);
    openModal('doctorVerify');
  };

  return (
    <div className="admin-portal-container">
      {/* Admin Header Banner */}
      <div className="admin-banner-card">
        <div className="admin-title-row">
          <div className="icon-badge purple">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2>{t('adminDashboardTitle')}</h2>
            <p>Role-Based System Administration, Doctor Verification & Facility Auditing</p>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button 
            className={`admin-tab-btn ${activeAdminTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveAdminTab('overview'); setSearchTerm(''); }}
          >
            📊 {t('adminTabOverview')}
          </button>
          <button 
            className={`admin-tab-btn ${activeAdminTab === 'doctors' ? 'active' : ''}`}
            onClick={() => { setActiveAdminTab('doctors'); setSearchTerm(''); }}
          >
            👨‍⚕️ {t('adminTabDoctors')} {pendingDoctors > 0 && <span className="badge-count">{pendingDoctors}</span>}
          </button>
          <button 
            className={`admin-tab-btn ${activeAdminTab === 'hospitals' ? 'active' : ''}`}
            onClick={() => { setActiveAdminTab('hospitals'); setSearchTerm(''); }}
          >
            🏥 {t('adminTabHospitals')}
          </button>
          <button 
            className={`admin-tab-btn ${activeAdminTab === 'appts' ? 'active' : ''}`}
            onClick={() => { setActiveAdminTab('appts'); setSearchTerm(''); }}
          >
            📅 {t('adminTabAppts')}
          </button>
          <button 
            className={`admin-tab-btn ${activeAdminTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveAdminTab('users'); setSearchTerm(''); }}
          >
            👥 {t('adminTabUsers')}
          </button>
          <button 
            className={`admin-tab-btn ${activeAdminTab === 'payments' ? 'active' : ''}`}
            onClick={() => { setActiveAdminTab('payments'); setSearchTerm(''); }}
          >
            💳 {t('adminTabPayments')}
          </button>
        </div>
      </div>

      {/* VIEW 1: DASHBOARD OVERVIEW */}
      {activeAdminTab === 'overview' && (
        <div className="admin-overview-view">
          {/* KPI Metrics Grid */}
          <div className="kpi-metrics-grid">
            <div className="kpi-card blue">
              <div className="kpi-icon-wrap">
                <Users size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">{t('adminKpiPatients')}</span>
                <span className="kpi-value">{totalPatients}</span>
                <span className="kpi-trend">↑ Active Senior Registry</span>
              </div>
            </div>

            <div className="kpi-card emerald">
              <div className="kpi-icon-wrap">
                <UserCheck size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">{t('adminKpiDoctors')}</span>
                <span className="kpi-value">{verifiedDoctors} <span className="sub-val">({pendingDoctors} Pending)</span></span>
                <span className="kpi-trend">NMC Verified</span>
              </div>
            </div>

            <div className="kpi-card purple">
              <div className="kpi-icon-wrap">
                <Building2 size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">{t('adminKpiHospitals')}</span>
                <span className="kpi-value">{totalHospitals}</span>
                <span className="kpi-trend">100% 24/7 ER Connected</span>
              </div>
            </div>

            <div className="kpi-card amber">
              <div className="kpi-icon-wrap">
                <Calendar size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">{t('adminKpiAppts')}</span>
                <span className="kpi-value">{totalAppointments}</span>
                <span className="kpi-trend">{completedAppointments} Completed</span>
              </div>
            </div>

            <div className="kpi-card indigo">
              <div className="kpi-icon-wrap">
                <DollarSign size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">{t('adminKpiRevenue')}</span>
                <span className="kpi-value">₹{totalGrossVolume}</span>
                <span className="kpi-trend">Sandbox & Live Gateway</span>
              </div>
            </div>
          </div>

          {/* Quick Action Pending Approvals */}
          {pendingDoctors > 0 && (
            <div className="admin-alert-card">
              <div className="alert-header">
                <AlertTriangle size={20} className="text-amber-500" />
                <h4>Action Required: {pendingDoctors} Doctor(s) Awaiting Credential Verification</h4>
              </div>
              <p>Review submitted Medical Council registration numbers and degree certificates before granting prescription authority.</p>
              <button 
                className="primary-btn mt-3"
                onClick={() => { setActiveAdminTab('doctors'); setStatusFilter('pending'); }}
              >
                Review Pending Doctors ➜
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DOCTOR MANAGEMENT */}
      {activeAdminTab === 'doctors' && (
        <div className="admin-doctors-view">
          <div className="admin-controls-bar">
            <div className="search-input-wrap">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search doctors by name or specialty..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <div className="filter-select-wrap">
              <Filter size={18} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Verification Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Verification</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Registration No.</th>
                  <th>Hospital Affiliation</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-table-cell">
                        <span className="doc-avatar-small">{doc.avatar || '👨‍⚕️'}</span>
                        <div>
                          <strong>{doc.name}</strong>
                          <span className="doc-exp">{doc.experienceYears}y Exp</span>
                        </div>
                      </div>
                    </td>
                    <td>{doc.specialization}</td>
                    <td className="font-mono text-sm">{doc.registrationNumber || 'MCI-TN-48291'}</td>
                    <td>{doc.hospitalName}</td>
                    <td>₹{doc.fee}</td>
                    <td>
                      <span className={`status-pill ${doc.verificationStatus}`}>
                        {doc.verificationStatus.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="table-action-btn review"
                          onClick={() => handleReviewDoctor(doc)}
                          title="Audit Certificates & Verify"
                        >
                          <ShieldCheck size={16} /> Audit
                        </button>
                        {doc.verificationStatus === 'verified' ? (
                          <button 
                            className="table-action-btn suspend"
                            onClick={() => suspendDoctorAccount(doc.id)}
                            title="Suspend Doctor"
                          >
                            <XCircle size={16} />
                          </button>
                        ) : doc.verificationStatus === 'suspended' ? (
                          <button 
                            className="table-action-btn activate"
                            onClick={() => activateDoctorAccount(doc.id)}
                            title="Reactivate Doctor"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: HOSPITAL REGISTRY */}
      {activeAdminTab === 'hospitals' && (
        <div className="admin-hospitals-view">
          <div className="admin-controls-bar">
            <div className="search-input-wrap">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search hospitals by name or address..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <button className="primary-btn" onClick={() => openModal('addHospital')}>
              <Plus size={18} /> {t('addHospitalBtn')}
            </button>
          </div>

          <div className="hospitals-admin-grid">
            {filteredHospitals.map(hosp => (
              <div key={hosp.id} className="hospital-admin-card">
                <div className="hosp-admin-header">
                  <div className="hosp-icon-badge">
                    <Hospital size={24} />
                  </div>
                  <div>
                    <h4>{hosp.name}</h4>
                    <span className="hosp-type-badge">{hosp.type}</span>
                  </div>
                </div>

                <p className="hosp-admin-addr">📍 {hosp.address}</p>

                <div className="hosp-admin-stats">
                  <div className="stat-col">
                    <span className="stat-val">{hosp.erBedsAvailable}</span>
                    <span className="stat-label">ER Beds</span>
                  </div>
                  <div className="stat-col">
                    <span className="stat-val">{hosp.totalBeds}</span>
                    <span className="stat-label">Total Beds</span>
                  </div>
                  <div className="stat-col">
                    <span className="stat-val">{hosp.hasEmergencyER ? '24/7 ER' : 'Daycare'}</span>
                    <span className="stat-label">Emergency</span>
                  </div>
                </div>

                <div className="hosp-schemes-tags">
                  {hosp.supportedSchemes.map((s, idx) => (
                    <span key={idx} className="scheme-tag">✓ {s}</span>
                  ))}
                </div>

                <div className="hosp-admin-actions">
                  <button className="secondary-btn danger-btn text-sm" onClick={() => removeHospital(hosp.id)}>
                    {t('deleteHospitalBtn')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: APPOINTMENT MASTER LEDGER */}
      {activeAdminTab === 'appts' && (
        <div className="admin-appts-view">
          <div className="admin-controls-bar">
            <div className="search-input-wrap">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search appointments by token (#A-14) or doctor..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Date & Time</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(apt => (
                  <tr key={apt.id}>
                    <td><span className="token-badge">{apt.token}</span></td>
                    <td><strong>{apt.doctor}</strong></td>
                    <td>{apt.specialty || 'General'}</td>
                    <td>{apt.date} • {apt.time}</td>
                    <td>₹{apt.fee}</td>
                    <td>
                      <span className={`status-pill ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>
                      {apt.status !== 'Cancelled' ? (
                        <button 
                          className="table-action-btn cancel"
                          onClick={() => cancelAppointmentAdmin(apt.id)}
                          title="Cancel & Process Refund"
                        >
                          <RotateCcw size={16} /> Cancel & Refund
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Refunded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: PATIENT DIRECTORY */}
      {activeAdminTab === 'users' && (
        <div className="admin-users-view">
          <div className="admin-controls-bar">
            <div className="search-input-wrap">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search patients by name or phone..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age & Gender</th>
                  <th>Phone</th>
                  <th>Linked Scheme</th>
                  <th>Consultations</th>
                  <th>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {adminPatients.map(pat => (
                  <tr key={pat.id}>
                    <td><strong>{pat.name}</strong></td>
                    <td>{pat.age} yrs • {pat.gender}</td>
                    <td>{pat.phone}</td>
                    <td><span className="scheme-tag">{pat.scheme}</span></td>
                    <td>{pat.appointmentsCount} Visits</td>
                    <td><span className="status-pill verified">{pat.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 6: PAYMENTS & REFUNDS */}
      {activeAdminTab === 'payments' && (
        <div className="admin-payments-view">
          <div className="admin-controls-bar">
            <div className="search-input-wrap">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search by Transaction ID or Token..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Token</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Gateway Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(pay => (
                  <tr key={pay.id}>
                    <td className="font-mono text-sm font-semibold">{pay.id}</td>
                    <td><span className="token-badge">{pay.token}</span></td>
                    <td>{pay.patientName}</td>
                    <td>{pay.doctorName}</td>
                    <td><strong>₹{pay.amount}</strong> <span className="text-xs text-gray-400">(-₹{pay.discount})</span></td>
                    <td>{pay.method}</td>
                    <td><span className="sandbox-badge">{pay.mode}</span></td>
                    <td><span className="status-pill success">{pay.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

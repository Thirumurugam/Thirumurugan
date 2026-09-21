import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { startListening } from '../../services/speechService';
import { 
  Stethoscope, Calendar, Clock, Mic, MicOff, Paperclip, 
  CheckCircle2, AlertCircle, Award, ChevronRight, Search, 
  Filter, FileText, ArrowRight, ShieldCheck, RefreshCw,
  X, AlertTriangle, Bell, User, MapPin
} from 'lucide-react';

const CALENDAR_DATES = [
  { label: 'Today', day: 'Fri', date: 'Sep 19', dateStr: 'Today, Sep 19' },
  { label: 'Tomorrow', day: 'Sat', date: 'Sep 20', dateStr: 'Tomorrow, Sep 20' },
  { label: '', day: 'Mon', date: 'Sep 22', dateStr: 'Mon, Sep 22' },
  { label: '', day: 'Tue', date: 'Sep 23', dateStr: 'Tue, Sep 23' },
  { label: '', day: 'Wed', date: 'Sep 24', dateStr: 'Wed, Sep 24' }
];

const AVAILABLE_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
];

export const AppointmentsTab = () => {
  const {
    doctors,
    initiateAppointmentBooking,
    appointmentsHistory,
    currentLang,
    quickGuideToRoom,
    rescheduleAppointment,
    cancelAppointment,
    joinWaitlist,
    t
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('book'); // 'book', 'calendar', 'history'
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchDocTerm, setSearchDocTerm] = useState('');
  
  // Selected Doctor for Booking
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [selectedDate, setSelectedDate] = useState('Today, Sep 19');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM');
  
  // Problem Intake Form
  const [symptomsText, setSymptomsText] = useState('Persistent right knee pain and morning stiffness for the past 2 weeks.');
  const [symptomDuration, setSymptomDuration] = useState('2 Weeks');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState(['Knee-XRay-AP-Lateral.pdf']);
  const [applyScheme, setApplyScheme] = useState(true);

  // Calendar View Filter States
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(CALENDAR_DATES[0].dateStr);
  const [calendarTimePeriod, setCalendarTimePeriod] = useState('all'); // 'all', 'morning', 'afternoon'

  // Reschedule & Cancel Dialog States
  const [reschedulingApt, setReschedulingApt] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('Tomorrow, Sep 20');
  const [rescheduleSlot, setRescheduleSlot] = useState('11:00 AM');

  const [cancellingApt, setCancellingApt] = useState(null);
  const [cancelReason, setCancelReason] = useState('Schedule conflict');

  // Waitlist Dialog State
  const [waitlistDoctor, setWaitlistDoctor] = useState(null);

  // Filter Doctors
  const filteredDoctors = doctors.filter(doc => {
    const matchesSpec = selectedSpecialty === 'all' || 
                        doc.specialtyKey === selectedSpecialty || 
                        doc.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
    const matchesSearch = doc.name.toLowerCase().includes(searchDocTerm.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchDocTerm.toLowerCase());
    return matchesSpec && matchesSearch && doc.verificationStatus === 'verified';
  });

  // Voice Symptom Recording
  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    startListening(
      currentLang,
      (transcript) => {
        setSymptomsText(prev => `${prev} ${transcript}`);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );
  };

  // Mock File Upload
  const handleAttachReport = () => {
    const mockReports = ['Blood-Sugar-Report.pdf', 'ECG-Test-Scan.pdf', 'MRI-Lumbar-Spine.pdf', 'Doctor-Prescription-Past.pdf'];
    const chosen = mockReports[Math.floor(Math.random() * mockReports.length)];
    if (!attachedFiles.includes(chosen)) {
      setAttachedFiles(prev => [...prev, chosen]);
    }
  };

  const handleRemoveFile = (fileName) => {
    setAttachedFiles(prev => prev.filter(f => f !== fileName));
  };

  const calculatePricing = () => {
    const fee = selectedDoctor ? selectedDoctor.fee : 500;
    const discount = applyScheme ? Math.round(fee * 0.5) : 0;
    const finalPrice = fee - discount;
    return { fee, discount, finalPrice };
  };

  const { fee, discount, finalPrice } = calculatePricing();

  const handleProceedToPayment = () => {
    if (!selectedDoctor) return;

    const payload = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialization,
      room: selectedDoctor.room,
      floor: selectedDoctor.floor,
      hospitalName: selectedDoctor.hospitalName,
      date: selectedDate,
      timeSlot: selectedSlot,
      symptoms: symptomsText,
      duration: symptomDuration,
      attachedReports: attachedFiles,
      fee,
      subsidyDiscount: discount,
      finalPrice
    };

    initiateAppointmentBooking(payload);
  };

  // Quick slot pick from calendar view
  const handleSelectSlotFromCalendar = (doc, dateStr, slot) => {
    setSelectedDoctor(doc);
    setSelectedDate(dateStr);
    setSelectedSlot(slot);
    setActiveSubTab('book');
  };

  // Confirm Reschedule
  const handleConfirmReschedule = () => {
    if (!reschedulingApt) return;
    rescheduleAppointment(reschedulingApt.id, rescheduleDate, rescheduleSlot);
    setReschedulingApt(null);
  };

  // Confirm Cancel
  const handleConfirmCancel = () => {
    if (!cancellingApt) return;
    cancelAppointment(cancellingApt.id, cancelReason);
    setCancellingApt(null);
  };

  // Confirm Waitlist
  const handleConfirmWaitlist = () => {
    if (!waitlistDoctor) return;
    joinWaitlist(waitlistDoctor.name, waitlistDoctor.specialization, calendarSelectedDate);
    setWaitlistDoctor(null);
  };

  return (
    <div className="appointments-tab-container">
      {/* Header Tabs (Book vs Calendar vs History) */}
      <div className="appointment-top-switcher">
        <button 
          className={`switch-tab-btn ${activeSubTab === 'book' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('book')}
        >
          <Stethoscope size={16} />
          <span>{t('bookApptTitle') || 'Book Doctor'}</span>
        </button>
        <button 
          className={`switch-tab-btn ${activeSubTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('calendar')}
        >
          <Calendar size={16} />
          <span>Week Slots</span>
        </button>
        <button 
          className={`switch-tab-btn ${activeSubTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('history')}
        >
          <Clock size={16} />
          <span>{t('myBookings') || 'My Bookings'} ({appointmentsHistory.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUBTAB 1: BOOKING FLOW */}
      {/* ======================================================== */}
      {activeSubTab === 'book' && (
        <div className="booking-flow-container">
          {/* STEP 1: SELECT SPECIALTY & DOCTOR */}
          <div className="booking-step-card">
            <div className="step-header">
              <span className="step-num">1</span>
              <h3>{t('selectProblem') || 'Select Doctor & Specialty'}</h3>
            </div>

            {/* Specialty Pills */}
            <div className="specialty-pills-row">
              <button 
                className={`spec-pill ${selectedSpecialty === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty('all')}
              >
                All Specialists
              </button>
              <button 
                className={`spec-pill ${selectedSpecialty === 'ortho' ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty('ortho')}
              >
                🦴 {t('specOrtho')}
              </button>
              <button 
                className={`spec-pill ${selectedSpecialty === 'cardio' ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty('cardio')}
              >
                🫀 {t('specCardio')}
              </button>
              <button 
                className={`spec-pill ${selectedSpecialty === 'general' ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty('general')}
              >
                🩺 {t('specGeneral')}
              </button>
              <button 
                className={`spec-pill ${selectedSpecialty === 'eye' ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty('eye')}
              >
                👁️ {t('specEye')}
              </button>
              <button 
                className={`spec-pill ${selectedSpecialty === 'neuro' ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty('neuro')}
              >
                🧠 {t('specNeuro')}
              </button>
            </div>

            {/* Doctor Selection Grid */}
            <div className="doctors-select-grid mt-3">
              {filteredDoctors.map(doc => (
                <div 
                  key={doc.id}
                  className={`doctor-select-card ${selectedDoctor && selectedDoctor.id === doc.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDoctor(doc)}
                >
                  <div className="doc-card-header">
                    <span className="doc-avatar-medium">{doc.avatar || '👨‍⚕️'}</span>
                    <div>
                      <h4>{doc.name}</h4>
                      <p className="doc-spec-badge">{doc.specialization}</p>
                      <p className="doc-qualifications">{doc.title}</p>
                    </div>
                  </div>

                  <div className="doc-card-meta">
                    <span>📍 {doc.room} ({doc.floor})</span>
                    <span>⭐ {doc.rating} ({doc.reviews} Reviews)</span>
                    <span className="doc-fee-tag">Fee: ₹{doc.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: PRE-CONSULTATION HEALTH PROBLEM INTAKE */}
          <div className="booking-step-card">
            <div className="step-header">
              <span className="step-num">2</span>
              <h3>Describe Your Health Problem & Symptoms</h3>
            </div>

            <div className="form-group">
              <label className="input-label-with-voice">
                <span>{t('describeSymptomsLabel')}</span>
                <button 
                  type="button" 
                  className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
                  onClick={handleVoiceRecord}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  <span>{isRecording ? t('recordingActive') : t('symptomVoiceRecord')}</span>
                </button>
              </label>

              <textarea
                rows={3}
                value={symptomsText}
                onChange={e => setSymptomsText(e.target.value)}
                placeholder="Type or speak your health issue, duration, and where it hurts..."
              />
            </div>

            {/* Attachments */}
            <div className="attachments-section">
              <div className="attach-header">
                <span>{t('attachReportsLabel')}</span>
                <button type="button" className="attach-btn" onClick={handleAttachReport}>
                  <Paperclip size={16} /> + Upload Report / Prescription
                </button>
              </div>

              {attachedFiles.length > 0 && (
                <div className="attached-files-list">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="file-chip">
                      <FileText size={16} className="text-blue-500" />
                      <span>{file}</span>
                      <button type="button" onClick={() => handleRemoveFile(file)} className="file-remove">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: DATE & TIME SLOT PICKER */}
          <div className="booking-step-card">
            <div className="step-header">
              <span className="step-num">3</span>
              <h3>{t('chooseDateTime')}</h3>
            </div>

            {/* Date Selector */}
            <div className="dates-pill-row">
              {CALENDAR_DATES.map((dateObj, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`date-pill ${selectedDate === dateObj.dateStr ? 'active' : ''}`}
                  onClick={() => setSelectedDate(dateObj.dateStr)}
                >
                  <span className="text-xs opacity-75">{dateObj.day}</span>
                  <strong>{dateObj.date}</strong>
                </button>
              ))}
            </div>

            {/* Time Slot Selector */}
            <div className="slots-grid mt-3">
              {selectedDoctor && selectedDoctor.timeSlots ? (
                selectedDoctor.timeSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`time-slot-btn ${selectedSlot === slot ? 'active' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <Clock size={14} />
                    <span>{slot}</span>
                  </button>
                ))
              ) : (
                AVAILABLE_SLOTS.slice(0, 6).map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`time-slot-btn ${selectedSlot === slot ? 'active' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <Clock size={14} />
                    <span>{slot}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* STEP 4: GOVT SUBSIDY & PRICING BREAKDOWN */}
          <div className="booking-step-card pricing-card">
            <div className="scheme-toggle-bar">
              <label className="scheme-checkbox-label">
                <input
                  type="checkbox"
                  checked={applyScheme}
                  onChange={e => setApplyScheme(e.target.checked)}
                />
                <div>
                  <strong>{t('applyGovtSubsidy')}</strong>
                  <p className="scheme-sub">{t('schemeSubText')}</p>
                </div>
              </label>
            </div>

            <div className="booking-price-summary">
              <div className="summary-line">
                <span>Doctor Consultation Fee:</span>
                <span>₹{fee}</span>
              </div>
              {applyScheme && (
                <div className="summary-line discount-line text-emerald-600 font-semibold">
                  <span>Ayushman / Senior Citizen 50% Concession:</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-line total-line">
                <span>Total Amount Payable:</span>
                <span className="final-price-tag">₹{finalPrice}</span>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn checkout-submit-btn full-width mt-4"
              onClick={handleProceedToPayment}
            >
              <span>{t('proceedToPaymentBtn')} (₹{finalPrice})</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 2: CALENDAR & AVAILABLE SLOTS VIEW */}
      {/* ======================================================== */}
      {activeSubTab === 'calendar' && (
        <div className="appointments-calendar-view">
          <div className="calendar-header-card">
            <div className="cal-title-row">
              <div className="cal-icon-circle">
                <Calendar size={22} className="text-blue-600" />
              </div>
              <div>
                <h3>Hospital Consultation Calendar</h3>
                <p>View daily OPD schedules and real-time slot availability</p>
              </div>
            </div>

            {/* Date Selector Strip */}
            <div className="dates-pill-row mt-3">
              {CALENDAR_DATES.map((d, i) => (
                <button
                  key={i}
                  className={`date-pill ${calendarSelectedDate === d.dateStr ? 'active' : ''}`}
                  onClick={() => setCalendarSelectedDate(d.dateStr)}
                >
                  <span className="text-xs opacity-75">{d.day}</span>
                  <strong>{d.date}</strong>
                </button>
              ))}
            </div>

            {/* Morning / Evening Filter */}
            <div className="cal-time-filters mt-3">
              <button 
                className={`cal-filter-btn ${calendarTimePeriod === 'all' ? 'active' : ''}`}
                onClick={() => setCalendarTimePeriod('all')}
              >
                All Hours
              </button>
              <button 
                className={`cal-filter-btn ${calendarTimePeriod === 'morning' ? 'active' : ''}`}
                onClick={() => setCalendarTimePeriod('morning')}
              >
                🌅 Morning (09:00 - 12:30)
              </button>
              <button 
                className={`cal-filter-btn ${calendarTimePeriod === 'afternoon' ? 'active' : ''}`}
                onClick={() => setCalendarTimePeriod('afternoon')}
              >
                🌇 Afternoon / Evening (14:00 - 17:30)
              </button>
            </div>
          </div>

          {/* Doctor Schedule List for Selected Date */}
          <div className="calendar-doctors-schedule-list mt-3">
            {doctors.map(doc => {
              const docSlots = doc.timeSlots || ['09:30 AM', '10:30 AM', '11:30 AM', '04:00 PM'];
              const filteredSlots = calendarTimePeriod === 'morning' 
                ? docSlots.filter(s => s.includes('AM')) 
                : calendarTimePeriod === 'afternoon'
                ? docSlots.filter(s => s.includes('PM'))
                : docSlots;

              return (
                <div key={doc.id} className="calendar-doc-schedule-card">
                  <div className="cal-doc-top">
                    <span className="cal-doc-avatar">{doc.avatar || '👨‍⚕️'}</span>
                    <div className="cal-doc-details">
                      <h4>{doc.name}</h4>
                      <p className="cal-doc-spec">{doc.specialization} • 📍 {doc.room} ({doc.floor})</p>
                      <span className="cal-fee-badge">₹{doc.fee} (50% with Ayushman)</span>
                    </div>
                    <button 
                      className="waitlist-btn-pill"
                      onClick={() => setWaitlistDoctor(doc)}
                      title="Join priority waitlist for this doctor"
                    >
                      <Bell size={13} />
                      <span>Waitlist</span>
                    </button>
                  </div>

                  <div className="cal-slots-row">
                    <span className="slots-label">Available Slots for {calendarSelectedDate}:</span>
                    <div className="slots-chips-list">
                      {filteredSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          className="cal-slot-chip"
                          onClick={() => handleSelectSlotFromCalendar(doc, calendarSelectedDate, slot)}
                        >
                          <Clock size={12} />
                          <span>{slot}</span>
                          <span className="slot-book-hint">Book</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 3: MY BOOKINGS (HISTORY, RESCHEDULE, CANCEL) */}
      {/* ======================================================== */}
      {activeSubTab === 'history' && (
        <div className="appointments-history-view">
          <div className="history-list">
            {appointmentsHistory.length === 0 ? (
              <div className="empty-history-state">
                <Calendar size={48} className="text-gray-300" />
                <h4>No Appointments Booked Yet</h4>
                <p>Book your first doctor consultation online with OPD room navigation.</p>
                <button className="primary-btn mt-3" onClick={() => setActiveSubTab('book')}>
                  Book Appointment Now
                </button>
              </div>
            ) : (
              appointmentsHistory.map((apt) => (
                <div key={apt.id} className="history-appointment-card">
                  <div className="apt-card-top">
                    <span className="token-tag-large">{apt.token}</span>
                    <span className={`status-pill ${apt.status ? apt.status.toLowerCase() : 'confirmed'}`}>
                      {apt.status || 'Confirmed'}
                    </span>
                  </div>

                  <div className="apt-doctor-info">
                    <h4>{apt.doctor}</h4>
                    <p className="apt-spec">{apt.specialty || 'Specialist Consultation'}</p>
                    <p className="apt-room">
                      📍 <strong>{apt.room || 'Room 104'}</strong> ({apt.floor || '1st Floor'}) • 📅 {apt.date} at {apt.time}
                    </p>
                    {apt.cancelReason && (
                      <p className="cancel-reason-note text-red-500 text-xs mt-1">
                        Reason: {apt.cancelReason} • Full refund processed
                      </p>
                    )}
                  </div>

                  <div className="apt-actions-row">
                    {apt.status !== 'Cancelled' && (
                      <button 
                        className="primary-btn text-sm"
                        onClick={() => quickGuideToRoom(apt.room || 'Room 104', apt.floor || '1st Floor')}
                      >
                        👉 {t('guideMeBtn') || 'Guide to Room'}
                      </button>
                    )}

                    {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                      <>
                        <button 
                          className="secondary-btn text-sm"
                          onClick={() => {
                            setReschedulingApt(apt);
                            setRescheduleDate(apt.date || 'Tomorrow, Sep 20');
                            setRescheduleSlot(apt.time || '11:00 AM');
                          }}
                        >
                          <RefreshCw size={14} /> Reschedule
                        </button>
                        <button 
                          className="danger-outline-btn text-sm"
                          onClick={() => setCancellingApt(apt)}
                        >
                          <X size={14} /> Cancel
                        </button>
                      </>
                    )}

                    {apt.status === 'Completed' && (
                      <button className="secondary-btn text-sm">
                        <FileText size={16} /> View Rx Notes
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DIALOG: RESCHEDULE MODAL */}
      {/* ======================================================== */}
      {reschedulingApt && (
        <div className="modal-overlay" onClick={() => setReschedulingApt(null)}>
          <div className="modal-content reschedule-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="title-with-icon">
                <RefreshCw size={22} className="text-blue-500" />
                <h3>Reschedule Appointment ({reschedulingApt.token})</h3>
              </div>
              <button className="close-btn" onClick={() => setReschedulingApt(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="text-sm text-gray-600 mb-3">
                Select a new date and time for consultation with <strong>{reschedulingApt.doctor}</strong> ({reschedulingApt.room}):
              </p>

              <div className="form-group">
                <label className="text-xs font-semibold text-gray-700">Select New Date:</label>
                <div className="dates-pill-row mt-1">
                  {CALENDAR_DATES.map((d, i) => (
                    <button
                      key={i}
                      className={`date-pill ${rescheduleDate === d.dateStr ? 'active' : ''}`}
                      onClick={() => setRescheduleDate(d.dateStr)}
                    >
                      <span className="text-xs opacity-75">{d.day}</span>
                      <strong>{d.date}</strong>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="text-xs font-semibold text-gray-700">Select New Time Slot:</label>
                <div className="slots-grid mt-1">
                  {AVAILABLE_SLOTS.slice(0, 8).map((slot, i) => (
                    <button
                      key={i}
                      className={`time-slot-btn ${rescheduleSlot === slot ? 'active' : ''}`}
                      onClick={() => setRescheduleSlot(slot)}
                    >
                      <Clock size={12} />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setReschedulingApt(null)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={handleConfirmReschedule}>
                Confirm Reschedule ➜
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DIALOG: CANCEL APPOINTMENT MODAL */}
      {/* ======================================================== */}
      {cancellingApt && (
        <div className="modal-overlay" onClick={() => setCancellingApt(null)}>
          <div className="modal-content cancel-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="title-with-icon">
                <AlertTriangle size={22} className="text-red-500" />
                <h3>Cancel Appointment ({cancellingApt.token})</h3>
              </div>
              <button className="close-btn" onClick={() => setCancellingApt(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="text-sm text-gray-700 mb-2">
                Are you sure you want to cancel your consultation with <strong>{cancellingApt.doctor}</strong>?
              </p>

              <div className="refund-guarantee-box mb-3">
                <ShieldCheck size={20} className="text-emerald-600" />
                <div>
                  <strong>100% Instant Refund Guarantee</strong>
                  <p className="text-xs text-gray-600">
                    The full fee of ₹{cancellingApt.finalPrice || cancellingApt.fee || 500} will be refunded back to your original payment method within 24 hours.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label className="text-xs font-semibold text-gray-700">Reason for Cancellation:</label>
                <select 
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full mt-1 p-2 border rounded text-sm"
                >
                  <option value="Schedule conflict">Schedule conflict / change of plans</option>
                  <option value="Feeling better / Symptoms resolved">Feeling better / Symptoms resolved</option>
                  <option value="Consulting alternative doctor">Consulting alternative doctor</option>
                  <option value="Emergency or personal reasons">Emergency or personal reasons</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setCancellingApt(null)}>
                Keep Appointment
              </button>
              <button className="danger-btn" onClick={handleConfirmCancel}>
                Confirm Cancellation & Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DIALOG: PRIORITY WAITLIST MODAL */}
      {/* ======================================================== */}
      {waitlistDoctor && (
        <div className="modal-overlay" onClick={() => setWaitlistDoctor(null)}>
          <div className="modal-content waitlist-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="title-with-icon">
                <Bell size={22} className="text-purple-600" />
                <h3>Join Priority Waitlist</h3>
              </div>
              <button className="close-btn" onClick={() => setWaitlistDoctor(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="text-sm text-gray-700 mb-3">
                You are adding yourself to the queue for <strong>{waitlistDoctor.name}</strong> ({waitlistDoctor.specialization}) on <strong>{calendarSelectedDate}</strong>.
              </p>
              <div className="waitlist-benefits-list">
                <div className="benefit-item">✓ Instant SMS & WhatsApp notification if another patient reschedules or cancels</div>
                <div className="benefit-item">✓ Auto-reserve slot with 15-minute confirmation window</div>
                <div className="benefit-item">✓ No advance charges until slot is confirmed</div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setWaitlistDoctor(null)}>
                Cancel
              </button>
              <button className="primary-btn purple-btn" onClick={handleConfirmWaitlist}>
                Join Priority Waitlist 🔔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
